import type { CountryCode, ScenarioId } from './types';

export type ActionCategory = 'equipement' | 'infrastructure' | 'accompagnement' | 'r_d' | 'administration';

export interface ActionCost {
  id: string;
  nom: string;
  categorie: ActionCategory;
  coutUnitaire: number; // Mds € par unité
  coutFixe: number; // Mds €
  quantiteParPays: Record<CountryCode, number>;
  coutTotalParPays: Record<CountryCode, number>;
  coutTotalGlobal: number; // Mds €
  source: string;
}

export interface CostAssessment {
  directiveId: number;
  scenarioId: ScenarioId;
  actions: ActionCost[];
  coutTotalGlobal: number; // K
  moyensNationauxRef: Record<CountryCode, number>; // Nref(c)
  besoinRestant: Record<CountryCode, number>; // G(c) = max(0, K(c) - Nref(c))
  besoinRestantTotal: number;
  propositionReference: {
    enveloppeProposee: number;
    reservePourcentage: number;
    tauxCofinancementDefaut: number;
    cleContributionDefaut: ContributionKey;
    cleAllocationDefaut: AllocationKey;
  };
  bornes: {
    enveloppeMin: number;
    enveloppeMax: number;
    cofinancementMin: number;
    cofinancementMax: number;
  };
}

export type ContributionKey = 'pib' | 'population' | 'equal' | 'mixed';
export type AllocationKey = 'needs' | 'convergence' | 'equal' | 'mixed' | 'besoins';
export type FinancialTier = 'P1' | 'P2' | 'P3' | 'P4';

export interface FinancialProposal {
  envelope: number; // Mds €
  reserveRate: number; // ex: 0.05 à 0.10
  cofinancingRate: number; // ex: 0.15 à 0.40
  contributionKey: ContributionKey;
  allocationKey: AllocationKey;
}

export interface CountryFinancialBreakdown {
  code: CountryCode;
  need: number;
  nationalRef: number;
  remainingNeed: number;
  contribution: number;
  allocation: number;
  netBalance: number; // allocation - contribution
  cofinancing: number;
  coverageRate: number; // (allocation + cofinancing) / remainingNeed
}

export interface FinancialAgreement {
  directiveId: number;
  scenarioId: ScenarioId;
  proposal: FinancialProposal;
  breakdown: Record<CountryCode, CountryFinancialBreakdown>;
  totalFund: number;
  allocatedFund: number;
  reserveFund: number;
  councilApproved: boolean;
  parliamentApproved: boolean;
  adopted: boolean;
  adoptedAt: number;
}
