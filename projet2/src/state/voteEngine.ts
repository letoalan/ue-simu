import type { Directive, CountryCode, PartyCode } from '../domain/types';
import { COUNTRIES_META } from '../data/countries';
import { PARTIES_PROFILES } from '../data/parties';
import {
  ALL_COUNTRY_CODES,
  ALL_PARTY_CODES,
  type VoteChoice,
  type VoteStepData,
  type VoteStepStatus,
  type VoteCalculationResult,
  type VoteStoreState
} from './storeTypes';

export { applyRealisticVotesLogic } from './voteRealistic';

/**
 * Construit les étapes de vote pour une directive donnée
 */
export function buildVoteSteps(directive: Directive | null): VoteStepData[] {
  if (!directive) return [];

  const steps: VoteStepData[] = [
    {
      id: 'directive',
      name: 'Directive générale',
      description: directive.description || directive.declaration_intention || 'Proposition initiale de la Commission.'
    }
  ];

  if (Array.isArray(directive.amendements)) {
    directive.amendements.forEach((amd, idx) => {
      steps.push({
        id: `amend-${idx + 1}`,
        name: `Amendement ${idx + 1}`,
        description: amd.description,
        amendIndex: idx,
        amendId: amd.id,
        amendOrigine: amd.origine,
        amendType: amd.type,
        impact: amd.impact
      });
    });
  }

  steps.push({
    id: 'package',
    name: 'Package Final',
    description: 'Vote final sur le texte consolidé intégrant tous les amendements adoptés.'
  });

  return steps;
}

/**
 * Initialise l'état de vote complet pour une directive
 */
export function initVoteState(directive: Directive | null): VoteStoreState {
  const steps = buildVoteSteps(directive);
  const stateVotes: Record<string, Record<CountryCode, VoteChoice>> = {};
  const partyVotes: Record<string, Record<PartyCode, VoteChoice>> = {};
  const stepStatus: Record<string, VoteStepStatus> = {};

  for (const step of steps) {
    stateVotes[step.id] = {} as Record<CountryCode, VoteChoice>;
    for (const c of ALL_COUNTRY_CODES) {
      stateVotes[step.id][c] = 'abstention';
    }

    partyVotes[step.id] = {} as Record<PartyCode, VoteChoice>;
    for (const p of ALL_PARTY_CODES) {
      partyVotes[step.id][p] = 'abstention';
    }

    stepStatus[step.id] = {
      validated: false,
      councilPassed: false,
      parliamentPassed: false,
      passed: false
    };
  }

  return {
    currentStepId: steps.length > 0 ? steps[0].id : 'directive',
    stateVotes,
    partyVotes,
    stepStatus,
    appliedToSimulation: false,
    adoptedAmendmentsCount: 0,
    lastAdoptedAmendments: [],
    realisticActive: {},
    voteBackups: {}
  };
}

/**
 * Calcule les résultats de vote (Majorité Qualifiée Conseil et Majorité Absolue Parlement)
 */
export function calculateVoteStepResult(vState: VoteStoreState, stepId: string): VoteCalculationResult {
  const isDirective = stepId === 'directive';

  // 1. Calcul Conseil
  let statesPour = 0;
  let statesAbstention = 0;
  let statesContre = 0;
  let popPour = 0;
  let popTotal = 0;

  for (const c of ALL_COUNTRY_CODES) {
    const pop = COUNTRIES_META[c].population;
    popTotal += pop;
    const v = vState.stateVotes[stepId]?.[c] ?? 'abstention';
    if (v === 'pour') {
      statesPour++;
      popPour += pop;
    } else if (v === 'contre') {
      statesContre++;
    } else {
      statesAbstention++;
    }
  }

  const popPct = popTotal > 0 ? (popPour / popTotal) * 100 : 0;
  let councilPassed = false;
  let councilRuleText = '';

  if (isDirective) {
    councilPassed = statesPour > statesContre;
    councilRuleText = 'Majorité simple des États';
  } else {
    const statesMq = statesPour >= 4;
    const popMq = popPct >= 65.0 - 1e-6;
    councilPassed = statesMq && popMq;
    councilRuleText = 'Majorité Qualifiée (≥ 4 États & ≥ 65% pop.)';
  }

  // 2. Calcul Parlement
  let seatsPour = 0;
  let seatsAbstention = 0;
  let seatsContre = 0;
  let seatsTotal = 0;

  for (const p of ALL_PARTY_CODES) {
    const meps = PARTIES_PROFILES[p].base.meps;
    seatsTotal += meps;
    const v = vState.partyVotes[stepId]?.[p] ?? 'abstention';
    if (v === 'pour') {
      seatsPour += meps;
    } else if (v === 'contre') {
      seatsContre += meps;
    } else {
      seatsAbstention += meps;
    }
  }

  let parliamentPassed = false;
  let parliamentRuleText = '';

  if (isDirective) {
    parliamentPassed = seatsPour > seatsContre;
    parliamentRuleText = 'Majorité simple des sièges exprimés';
  } else {
    parliamentPassed = seatsPour > seatsTotal / 2;
    parliamentRuleText = 'Majorité Absolue (≥ 306 sièges sur 611)';
  }

  const stepPassed = councilPassed && parliamentPassed;

  return {
    statesPour,
    statesAbstention,
    statesContre,
    popPour,
    popTotal,
    popPct,
    councilPassed,
    councilRuleText,
    seatsPour,
    seatsAbstention,
    seatsContre,
    seatsTotal,
    parliamentPassed,
    parliamentRuleText,
    stepPassed
  };
}
