import { describe, it, expect } from 'vitest';
import { store } from '../src/state/store';
import { exportSessionToJson } from '../src/state/sessionStorage';
import { resetSessionAction, restoreSessionAction } from '../src/state/storeSessionActions';

describe('Gestion de Session et Transitions de Parcours UX', () => {
  it('change de parcours utilisateur sans altérer la graine ni la simulation', () => {
    const seedInit = store.getState().seed;
    const simInitScore = store.getState().simulationResult.euScoreSucces;

    store.setUserJourney('animateur');
    expect(store.getState().userJourney).toBe('animateur');
    expect(store.getState().seed).toBe(seedInit);
    expect(store.getState().simulationResult.euScoreSucces).toBe(simInitScore);

    store.setUserJourney('maitre_du_jeu');
    expect(store.getState().userJourney).toBe('maitre_du_jeu');
    expect(store.getState().seed).toBe(seedInit);

    store.setUserJourney('participant');
    expect(store.getState().userJourney).toBe('participant');
  });

  it('génère un export JSON valide et conforme au format de session', () => {
    const jsonStr = exportSessionToJson(store.getState());
    const parsed = JSON.parse(jsonStr);

    expect(parsed.version).toBe('2.0.0-UX');
    expect(parsed.scenarioId).toBe(store.getState().scenarioId);
    expect(typeof parsed.seed).toBe('number');
    expect(parsed.inputs).toBeDefined();
    expect(parsed.voteState).toBeDefined();
  });

  it('réinitialise la session correctement via resetSessionAction', () => {
    const state = { ...store.getState(), selectedAmendments: new Set(['amd_1', 'amd_2']) };
    resetSessionAction(state);

    expect(state.selectedAmendments.size).toBe(0);
    expect(state.financialAgreement).toBeNull();
    expect(state.financialProposal).toBeNull();
  });

  it('restaure fidèlement une session via restoreSessionAction', () => {
    const state = { ...store.getState() };
    const savedData = {
      seed: 9999,
      userJourney: 'animateur',
      selectedCountry: 'FR',
      selectedParty: 'RENEW',
      selectedAmendments: ['amd_1', 'amd_3'],
      inputs: { pib_eu: 3.5, co2_eu: 5.0 }
    };

    restoreSessionAction(state, savedData);

    expect(state.seed).toBe(9999);
    expect(state.userJourney).toBe('animateur');
    expect(state.selectedCountry).toBe('FR');
    expect(state.selectedParty).toBe('RENEW');
    expect(state.selectedAmendments.has('amd_1')).toBe(true);
    expect(state.selectedAmendments.has('amd_3')).toBe(true);
    expect(state.inputs.pib_eu).toBe(3.5);
  });
});
