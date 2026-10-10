import { describe, it, expect } from 'vitest';
import {
  calculateFinancialBreakdown,
  evaluateFinancialTier,
  evaluateCouncilVote,
  evaluateParliamentVote
} from '../src/simulation/financeEngine';
import { FinancialImplementationProvider } from '../src/simulation/financialImplementationProvider';
import { isFinanceUnlocked } from '../src/state/storeFinanceActions';
import type { CostAssessment, FinancialProposal, FinancialAgreement } from '../src/domain/financeTypes';

describe('Finance Engine - Phase B', () => {
  const dummyAssessment: CostAssessment = {
    directiveId: 1,
    scenarioId: 1,
    coutTotalGlobal: 300,
    moyensNationauxRef: { DE: 20, FR: 15, IT: 10, PL: 8, SE: 5, HU: 4 },
    besoinRestant: { DE: 50, FR: 45, IT: 35, PL: 30, SE: 15, HU: 10 },
    besoinRestantTotal: 185,
    actions: [
      {
        id: 'act-1',
        nom: 'Action test',
        categorie: 'equipement',
        coutUnitaire: 1,
        coutFixe: 0,
        quantiteParPays: { DE: 50, FR: 45, IT: 35, PL: 30, SE: 15, HU: 10 },
        coutTotalParPays: { DE: 70, FR: 60, IT: 45, PL: 38, SE: 20, HU: 14 },
        coutTotalGlobal: 247,
        source: 'Test'
      }
    ],
    propositionReference: {
      enveloppeProposee: 120,
      reservePourcentage: 0.05,
      tauxCofinancementDefaut: 0.25,
      cleContributionDefaut: 'pib',
      cleAllocationDefaut: 'needs'
    },
    bornes: {
      enveloppeMin: 60,
      enveloppeMax: 200,
      cofinancementMin: 0.15,
      cofinancementMax: 0.40
    }
  };

  const dummyProposal: FinancialProposal = {
    envelope: 120,
    reserveRate: 0.05,
    cofinancingRate: 0.25,
    contributionKey: 'pib',
    allocationKey: 'needs'
  };

  it('respecte le principe de conservation financière (Section 5)', () => {
    const breakdown = calculateFinancialBreakdown(dummyProposal, dummyAssessment);
    const countries = Object.values(breakdown);

    // 1. Somme des contributions = Enveloppe totale
    const totalContrib = countries.reduce((sum, c) => sum + c.contribution, 0);
    expect(Math.abs(totalContrib - dummyProposal.envelope)).toBeLessThan(0.1);

    // 2. Somme des allocations + Réserve = Enveloppe totale
    const totalAlloc = countries.reduce((sum, c) => sum + c.allocation, 0);
    const reserve = dummyProposal.envelope * dummyProposal.reserveRate;
    expect(Math.abs(totalAlloc + reserve - dummyProposal.envelope)).toBeLessThan(0.1);
  });

  it('calcule correctement les différents paliers d ambition (P1 à P4)', () => {
    const { enveloppeMin: min, enveloppeMax: max } = dummyAssessment.bornes;

    expect(evaluateFinancialTier(min, min, max).tier).toBe('P1');
    expect(evaluateFinancialTier(min + (max - min) * 0.35, min, max).tier).toBe('P2');
    expect(evaluateFinancialTier(min + (max - min) * 0.60, min, max).tier).toBe('P3');
    expect(evaluateFinancialTier(max, min, max).tier).toBe('P4');
  });

  it('évalue la Majorité Qualifiée du Conseil (55% États et 65% Population)', () => {
    const breakdown = calculateFinancialBreakdown(dummyProposal, dummyAssessment);
    const councilVote = evaluateCouncilVote(breakdown);

    expect(councilVote).toHaveProperty('statesPour');
    expect(councilVote).toHaveProperty('popPourPct');
    expect(councilVote).toHaveProperty('passed');

    // Les grands contributeurs nets ou les pays bien couverts réagissent rationnellement
    expect(councilVote.statesPour).toBeGreaterThanOrEqual(0);
    expect(councilVote.statesPour).toBeLessThanOrEqual(6);
    expect(councilVote.popPourPct).toBeGreaterThanOrEqual(0);
    expect(councilVote.popPourPct).toBeLessThanOrEqual(100);
  });

  it('évalue la Majorité Absolue du Parlement Européen (≥ 361 voix)', () => {
    // Proposition modérée P2/P3
    const result = evaluateParliamentVote(dummyProposal, dummyAssessment);
    expect(result.votesPour).toBeGreaterThanOrEqual(0);
    expect(result.votesPour).toBeLessThanOrEqual(720);
    expect(result.passed).toBe(result.votesPour >= 361);

    // Proposition P1 (austérité excessive rejetée par la majorité parlementaire)
    const lowProposal: FinancialProposal = { ...dummyProposal, envelope: dummyAssessment.bornes.enveloppeMin };
    const lowResult = evaluateParliamentVote(lowProposal, dummyAssessment);
    expect(lowResult.passed).toBe(false);
  });

  it('module l avancement de la simulation via FinancialImplementationProvider', () => {
    const breakdown = calculateFinancialBreakdown(dummyProposal, dummyAssessment);
    const agreement: FinancialAgreement = {
      directiveId: 1,
      scenarioId: 1,
      proposal: dummyProposal,
      breakdown,
      totalFund: dummyProposal.envelope,
      allocatedFund: dummyProposal.envelope * (1 - dummyProposal.reserveRate),
      reserveFund: dummyProposal.envelope * dummyProposal.reserveRate,
      councilApproved: true,
      parliamentApproved: true,
      adopted: true,
      adoptedAt: Date.now()
    };

    const providerWithFund = new FinancialImplementationProvider(agreement);
    const providerNoFund = new FinancialImplementationProvider(null);

    const rWithFund = providerWithFund.getRealization('DE', 'act-1', 9);
    const rNoFund = providerNoFund.getRealization('DE', 'act-1', 9);

    expect(rWithFund.realizationRate).toBeGreaterThanOrEqual(0);
    expect(rWithFund.realizationRate).toBeLessThanOrEqual(1.0);
    expect(rWithFund.realizationRate).toBeGreaterThan(rNoFund.realizationRate);
    expect(rWithFund.sourceVersion).toContain('PhaseB-Fund');
  });

  it('exige obligatoirement que le package soit vote et adopte pour ouvrir le financement (Phase B)', () => {
    // 1. Directive sans vote du package
    const state: any = {
      selectedDirective: { id: 1, nom: 'Directive Test' },
      voteState: { stepStatus: {}, appliedToSimulation: false }
    };
    expect(isFinanceUnlocked(state)).toBe(false);

    // 2. Package vote mais REJETE (aucun besoin de financement n'existe)
    state.voteState.stepStatus['package'] = {
      validated: true,
      councilPassed: false,
      parliamentPassed: true,
      passed: false
    };
    state.voteState.appliedToSimulation = false;
    expect(isFinanceUnlocked(state)).toBe(false);

    // 3. Package vote et ADOPTE (Conseil MQ + Parlement MA)
    state.voteState.stepStatus['package'] = {
      validated: true,
      councilPassed: true,
      parliamentPassed: true,
      passed: true
    };
    state.voteState.appliedToSimulation = true;
    expect(isFinanceUnlocked(state)).toBe(true);

    // 4. Si on change de directive, le verrou se reactive
    const resetState: any = {
      selectedDirective: { id: 2, nom: 'Nouvelle Directive' },
      voteState: { stepStatus: {}, appliedToSimulation: false }
    };
    expect(isFinanceUnlocked(resetState)).toBe(false);
  });
});
