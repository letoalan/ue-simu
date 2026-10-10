import type { CountryCode } from '../domain/types';
import type {
  CostAssessment,
  FinancialProposal,
  CountryFinancialBreakdown,
  FinancialTier
} from '../domain/financeTypes';

const COUNTRY_PIB_SHARES: Record<CountryCode, number> = {
  DE: 0.33, FR: 0.25, IT: 0.18, PL: 0.09, SE: 0.08, HU: 0.04
};

const COUNTRY_POP_SHARES: Record<CountryCode, number> = {
  DE: 0.317, FR: 0.243, IT: 0.221, PL: 0.143, SE: 0.040, HU: 0.036
};

const COUNTRY_CONVERGENCE_WEIGHTS: Record<CountryCode, number> = {
  PL: 0.28, HU: 0.24, IT: 0.18, FR: 0.12, DE: 0.10, SE: 0.08
};

export function calculateFinancialBreakdown(
  proposal: FinancialProposal,
  assessment: CostAssessment
): Record<CountryCode, CountryFinancialBreakdown> {
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
  const totalFund = proposal.envelope;
  const reserveFund = Math.round(totalFund * proposal.reserveRate * 100) / 100;
  const allocatableFund = totalFund - reserveFund;

  // 1. Clé de contribution (qui paie)
  const contribWeights: Record<CountryCode, number> = {} as any;
  codes.forEach(c => {
    if (proposal.contributionKey === 'pib') contribWeights[c] = COUNTRY_PIB_SHARES[c];
    else if (proposal.contributionKey === 'population') contribWeights[c] = COUNTRY_POP_SHARES[c];
    else if (proposal.contributionKey === 'equal') contribWeights[c] = 1 / 6;
    else contribWeights[c] = 0.6 * COUNTRY_PIB_SHARES[c] + 0.4 * COUNTRY_POP_SHARES[c];
  });

  // 2. Clé d'allocation (qui reçoit)
  const allocWeights: Record<CountryCode, number> = {} as any;
  const totalRemaining = Math.max(0.1, assessment.besoinRestantTotal);
  codes.forEach(c => {
    const needShare = (assessment.besoinRestant[c] ?? 0) / totalRemaining;
    if (proposal.allocationKey === 'needs') allocWeights[c] = needShare;
    else if (proposal.allocationKey === 'convergence') allocWeights[c] = COUNTRY_CONVERGENCE_WEIGHTS[c];
    else if (proposal.allocationKey === 'equal') allocWeights[c] = 1 / 6;
    else allocWeights[c] = 0.6 * needShare + 0.4 * COUNTRY_CONVERGENCE_WEIGHTS[c];
  });

  // Normalisation des poids pour conservation exacte
  const sumContribW = Object.values(contribWeights).reduce((a, b) => a + b, 0);
  const sumAllocW = Object.values(allocWeights).reduce((a, b) => a + b, 0);

  const breakdown: Record<CountryCode, CountryFinancialBreakdown> = {} as any;

  codes.forEach(c => {
    const need = assessment.actions.reduce((sum, a) => sum + (a.coutTotalParPays[c] ?? 0), 0);
    const nationalRef = assessment.moyensNationauxRef[c] ?? 0;
    const remainingNeed = assessment.besoinRestant[c] ?? 0;

    const contrib = Math.round(((contribWeights[c] / sumContribW) * totalFund) * 100) / 100;
    const alloc = Math.round(((allocWeights[c] / sumAllocW) * allocatableFund) * 100) / 100;
    const netBalance = Math.round((alloc - contrib) * 100) / 100;
    const cofin = Math.round((alloc * proposal.cofinancingRate) * 100) / 100;
    const effectiveRes = alloc + cofin;
    const covRate = remainingNeed > 0 ? Math.min(1.0, Math.round((effectiveRes / remainingNeed) * 100) / 100) : 1.0;

    breakdown[c] = {
      code: c,
      need,
      nationalRef,
      remainingNeed,
      contribution: contrib,
      allocation: alloc,
      netBalance,
      cofinancing: cofin,
      coverageRate: covRate
    };
  });

  return breakdown;
}

export function evaluateFinancialTier(val: number, min: number, max: number): { tier: FinancialTier; label: string; score: number } {
  if (max <= min) return { tier: 'P2', label: 'Modéré', score: 0.5 };
  const z = Math.max(0, Math.min(1, (val - min) / (max - min)));
  if (z < 0.25) return { tier: 'P1', label: 'Faible', score: z };
  if (z < 0.50) return { tier: 'P2', label: 'Modéré', score: z };
  if (z < 0.75) return { tier: 'P3', label: 'Élevé', score: z };
  return { tier: 'P4', label: 'Très élevé', score: z };
}

export function evaluateCouncilVote(breakdown: Record<CountryCode, CountryFinancialBreakdown>): { passed: boolean; statesPour: number; popPourPct: number } {
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
  let statesPour = 0;
  let popPour = 0;

  codes.forEach(c => {
    const item = breakdown[c];
    // Vote favorable si bénéficiaire net, ou si bonne couverture (>55%) et contribution modérée
    const isFavorable = item.netBalance >= -2.0 || item.coverageRate >= 0.60;
    if (isFavorable) {
      statesPour++;
      popPour += COUNTRY_POP_SHARES[c];
    }
  });

  const popPourPct = Math.round(popPour * 1000) / 10;
  // Majorité qualifiée : 55% des États (4/6) et 65% de la pop
  const passed = statesPour >= 4 && popPourPct >= 65.0;

  return { passed, statesPour, popPourPct };
}

export function evaluateParliamentVote(proposal: FinancialProposal, assessment: CostAssessment): { passed: boolean; votesPour: number; votesTotal: number } {
  // 720 députés au total, seuil 361
  const b = assessment.bornes;
  const envTier = evaluateFinancialTier(proposal.envelope, b.enveloppeMin, b.enveloppeMax);
  let votesPour = 250; // base pro-européenne

  if (envTier.tier === 'P1') votesPour -= 80; // jugé insuffisant par gauche/verts
  else if (envTier.tier === 'P2') votesPour += 80;
  else if (envTier.tier === 'P3') votesPour += 160;
  else if (envTier.tier === 'P4') votesPour += 120; // trop dispendieux pour certains libéraux/conservateurs

  if (proposal.allocationKey === 'convergence' || proposal.allocationKey === 'mixed') votesPour += 40;
  if (proposal.cofinancingRate >= 0.20 && proposal.cofinancingRate <= 0.35) votesPour += 30;

  votesPour = Math.max(120, Math.min(650, votesPour));
  return { passed: votesPour >= 361, votesPour, votesTotal: 720 };
}
