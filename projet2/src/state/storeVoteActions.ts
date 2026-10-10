import type { CountryCode, PartyCode } from '../domain/types';
import {
  ALL_COUNTRY_CODES,
  ALL_PARTY_CODES,
  type VoteChoice,
  type VoteStepData,
  type AppStoreState
} from './storeTypes';
import { calculateVoteStepResult, applyRealisticVotesLogic } from './voteEngine';

export function setActorVoteAction(
  state: AppStoreState,
  type: 'state' | 'party',
  actorCode: string,
  stepId: string,
  choice: VoteChoice
): void {
  const vState = state.voteState;
  if (type === 'state') {
    if (!vState.stateVotes[stepId]) vState.stateVotes[stepId] = {} as any;
    vState.stateVotes[stepId][actorCode as CountryCode] = choice;
  } else {
    if (!vState.partyVotes[stepId]) vState.partyVotes[stepId] = {} as any;
    vState.partyVotes[stepId][actorCode as PartyCode] = choice;
  }

  const calc = calculateVoteStepResult(vState, stepId);
  if (!vState.stepStatus[stepId]) {
    vState.stepStatus[stepId] = { validated: false, councilPassed: false, parliamentPassed: false, passed: false };
  }
  vState.stepStatus[stepId].councilPassed = calc.councilPassed;
  vState.stepStatus[stepId].parliamentPassed = calc.parliamentPassed;
  vState.stepStatus[stepId].passed = calc.stepPassed;
}

export function setAllVotesForStepAction(
  state: AppStoreState,
  stepId: string,
  type: 'state' | 'party',
  choice: VoteChoice
): void {
  const vState = state.voteState;
  if (type === 'state') {
    if (!vState.stateVotes[stepId]) vState.stateVotes[stepId] = {} as any;
    for (const c of ALL_COUNTRY_CODES) vState.stateVotes[stepId][c] = choice;
  } else {
    if (!vState.partyVotes[stepId]) vState.partyVotes[stepId] = {} as any;
    for (const p of ALL_PARTY_CODES) vState.partyVotes[stepId][p] = choice;
  }

  const calc = calculateVoteStepResult(vState, stepId);
  if (!vState.stepStatus[stepId]) {
    vState.stepStatus[stepId] = { validated: false, councilPassed: false, parliamentPassed: false, passed: false };
  }
  vState.stepStatus[stepId].councilPassed = calc.councilPassed;
  vState.stepStatus[stepId].parliamentPassed = calc.parliamentPassed;
  vState.stepStatus[stepId].passed = calc.stepPassed;
}

export function toggleRealisticVotesForStepAction(
  state: AppStoreState,
  stepId: string,
  steps: VoteStepData[]
): void {
  const vState = state.voteState;
  if (!vState.realisticActive) vState.realisticActive = {};
  if (!vState.voteBackups) vState.voteBackups = {};

  if (vState.realisticActive[stepId]) {
    const backup = vState.voteBackups[stepId];
    if (backup) {
      for (const c of ALL_COUNTRY_CODES) vState.stateVotes[stepId][c] = backup.states[c] ?? 'abstention';
      for (const p of ALL_PARTY_CODES) vState.partyVotes[stepId][p] = backup.parties[p] ?? 'abstention';
    } else {
      resetVotesForStepAction(state, stepId);
      return;
    }
    vState.realisticActive[stepId] = false;
  } else {
    const statesSnap: Record<CountryCode, VoteChoice> = {} as any;
    for (const c of ALL_COUNTRY_CODES) statesSnap[c] = vState.stateVotes[stepId]?.[c] ?? 'abstention';
    const partiesSnap: Record<PartyCode, VoteChoice> = {} as any;
    for (const p of ALL_PARTY_CODES) partiesSnap[p] = vState.partyVotes[stepId]?.[p] ?? 'abstention';
    vState.voteBackups[stepId] = { states: statesSnap, parties: partiesSnap };

    applyRealisticVotesLogic(vState, stepId, steps);
    vState.realisticActive[stepId] = true;
  }

  const calc = calculateVoteStepResult(vState, stepId);
  vState.stepStatus[stepId] = {
    validated: false,
    councilPassed: calc.councilPassed,
    parliamentPassed: calc.parliamentPassed,
    passed: calc.stepPassed
  };
}

export function invertVotesForStepAction(state: AppStoreState, stepId: string): void {
  const vState = state.voteState;
  for (const c of ALL_COUNTRY_CODES) {
    const cur = vState.stateVotes[stepId]?.[c];
    if (cur === 'pour') vState.stateVotes[stepId][c] = 'contre';
    else if (cur === 'contre') vState.stateVotes[stepId][c] = 'pour';
  }
  for (const p of ALL_PARTY_CODES) {
    const cur = vState.partyVotes[stepId]?.[p];
    if (cur === 'pour') vState.partyVotes[stepId][p] = 'contre';
    else if (cur === 'contre') vState.partyVotes[stepId][p] = 'pour';
  }
  const calc = calculateVoteStepResult(vState, stepId);
  vState.stepStatus[stepId] = {
    validated: false,
    councilPassed: calc.councilPassed,
    parliamentPassed: calc.parliamentPassed,
    passed: calc.stepPassed
  };
}

export function resetVotesForStepAction(state: AppStoreState, stepId: string): void {
  const vState = state.voteState;
  for (const c of ALL_COUNTRY_CODES) vState.stateVotes[stepId][c] = 'abstention';
  for (const p of ALL_PARTY_CODES) vState.partyVotes[stepId][p] = 'abstention';
  if (vState.realisticActive) vState.realisticActive[stepId] = false;

  const calc = calculateVoteStepResult(vState, stepId);
  vState.stepStatus[stepId] = {
    validated: false,
    councilPassed: calc.councilPassed,
    parliamentPassed: calc.parliamentPassed,
    passed: calc.stepPassed
  };
}

export function validateVoteStepAction(
  state: AppStoreState,
  stepId: string,
  steps: VoteStepData[]
): void {
  const calc = calculateVoteStepResult(state.voteState, stepId);
  state.voteState.stepStatus[stepId] = {
    validated: true,
    councilPassed: calc.councilPassed,
    parliamentPassed: calc.parliamentPassed,
    passed: calc.stepPassed
  };

  const currIdx = steps.findIndex(s => s.id === stepId);
  if (currIdx >= 0 && currIdx < steps.length - 1) {
    state.voteState.currentStepId = steps[currIdx + 1].id;
  }

  if (stepId === 'package') {
    if (calc.stepPassed) applyVoteToSimulationAction(state);
    else state.voteState.appliedToSimulation = false;
  }
}

export function applyVoteToSimulationAction(state: AppStoreState): void {
  const directive = state.selectedDirective;
  if (!directive) return;
  const pkg = state.voteState.stepStatus['package'];
  if (pkg && pkg.validated && !pkg.passed) {
    state.voteState.appliedToSimulation = false;
    return;
  }

  const passed = (directive.amendements || []).filter((_, idx) => {
    const st = state.voteState.stepStatus[`amend-${idx + 1}`];
    return st && st.validated && st.passed;
  });

  const finalStats: Record<string, number> = { ...directive.statistiques_depart };
  if (passed.length > 0) {
    const sum: Record<string, number> = {}, count: Record<string, number> = {};
    for (const a of passed) {
      if (a.impact) {
        for (const [k, v] of Object.entries(a.impact)) {
          sum[k] = (sum[k] || 0) + (v as number);
          count[k] = (count[k] || 0) + 1;
        }
      }
    }
    for (const [k, c] of Object.entries(count)) {
      if (c > 0) finalStats[k] = Math.round((sum[k] / c) * 100) / 100;
    }
  }

  state.selectedAmendments = new Set(passed.map(a => a.id));
  state.inputs = finalStats;
  state.voteState.appliedToSimulation = true;
  state.voteState.adoptedAmendmentsCount = passed.length;
  state.voteState.lastAdoptedAmendments = passed.map(a => a.id);
}
