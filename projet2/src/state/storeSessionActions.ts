import type { AppStoreState } from './storeTypes';
import { initVoteState } from './voteEngine';

export function recalculateInputsFromAmendmentsAction(state: AppStoreState): void {
  if (!state.selectedDirective) return;
  const base = { ...state.selectedDirective.statistiques_depart };
  for (const amdId of state.selectedAmendments) {
    const amd = state.selectedDirective.amendements?.find(a => a.id === amdId);
    if (amd?.impact) for (const [k, v] of Object.entries(amd.impact)) base[k] = v;
  }
  state.inputs = base;
}

export function resetSessionAction(state: AppStoreState): void {
  if (state.selectedDirective) {
    state.inputs = { ...state.selectedDirective.statistiques_depart };
    state.voteState = initVoteState(state.selectedDirective);
  } else {
    state.inputs = { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 8.0, veb_eu: 80.0 };
    state.voteState = initVoteState(null);
  }
  state.selectedAmendments = new Set();
  state.financialProposal = null;
  state.financialAgreement = null;
  state.costAssessment = null;
}

export function restoreSessionAction(state: AppStoreState, data: any): void {
  if (!data) return;
  if (typeof data.seed === 'number') state.seed = data.seed;
  if (data.userJourney) state.userJourney = data.userJourney;
  if (data.selectedCountry) state.selectedCountry = data.selectedCountry;
  if (data.selectedParty) state.selectedParty = data.selectedParty;
  if (data.selectedLobby) state.selectedLobby = data.selectedLobby;

  if (data.inputs && typeof data.inputs === 'object') {
    state.inputs = { ...data.inputs };
  }

  if (Array.isArray(data.selectedAmendments)) {
    state.selectedAmendments = new Set(data.selectedAmendments);
  }

  if (data.voteState) {
    state.voteState = {
      ...state.voteState,
      ...data.voteState,
      stepStatus: { ...(data.voteState.stepStatus || {}) },
      stateVotes: { ...(data.voteState.stateVotes || {}) },
      partyVotes: { ...(data.voteState.partyVotes || {}) }
    };
  }

  if (data.financialAgreement !== undefined) {
    state.financialAgreement = data.financialAgreement;
  }
}
