import type { AppStoreState } from './storeTypes';
import type { FinancialProposal, FinancialAgreement } from '../domain/financeTypes';
import { loadCostAssessment } from '../data/financeDataLoader';
import {
  calculateFinancialBreakdown,
  evaluateCouncilVote,
  evaluateParliamentVote
} from '../simulation/financeEngine';

export async function initFinanceAction(state: AppStoreState): Promise<void> {
  const directiveId = state.selectedDirective?.id ?? 1;
  const assessment = await loadCostAssessment(state.scenarioId, directiveId);
  state.costAssessment = assessment;

  // Proposition par défaut dérivée de l'évaluation
  const def = assessment.propositionReference;
  state.financialProposal = {
    envelope: def.enveloppeProposee,
    reserveRate: def.reservePourcentage,
    cofinancingRate: def.tauxCofinancementDefaut,
    contributionKey: def.cleContributionDefaut,
    allocationKey: (def.cleAllocationDefaut === 'besoins' ? 'needs' : def.cleAllocationDefaut) as any
  };
  state.financialAgreement = null;
}

export function updateProposalAction(state: AppStoreState, updates: Partial<FinancialProposal>): void {
  if (!state.financialProposal) return;
  state.financialProposal = { ...state.financialProposal, ...updates };
  // Si un accord était déjà adopté et qu'on modifie la proposition, on l'invalide comme requis par finance.md
  if (state.financialAgreement) {
    state.financialAgreement = null;
  }
}

export function voteFinanceAction(state: AppStoreState): FinancialAgreement | null {
  if (!state.costAssessment || !state.financialProposal) return null;
  const proposal = state.financialProposal;
  const assessment = state.costAssessment;

  const breakdown = calculateFinancialBreakdown(proposal, assessment);
  const council = evaluateCouncilVote(breakdown);
  const parliament = evaluateParliamentVote(proposal, assessment);

  const reserveFund = Math.round(proposal.envelope * proposal.reserveRate * 100) / 100;
  const allocatedFund = proposal.envelope - reserveFund;

  const agreement: FinancialAgreement = {
    directiveId: state.selectedDirective?.id ?? 1,
    scenarioId: state.scenarioId,
    proposal: { ...proposal },
    breakdown,
    totalFund: proposal.envelope,
    allocatedFund,
    reserveFund,
    councilApproved: council.passed,
    parliamentApproved: parliament.passed,
    adopted: council.passed && parliament.passed,
    adoptedAt: Date.now()
  };

  state.financialAgreement = agreement;
  return agreement;
}

export function resetFinanceAction(state: AppStoreState): void {
  state.financialAgreement = null;
}

export function isFinanceUnlocked(state: AppStoreState): boolean {
  if (!state.selectedDirective) return false;
  const pkg = state.voteState?.stepStatus?.['package'];
  return Boolean(pkg?.validated && pkg?.passed && state.voteState?.appliedToSimulation);
}
