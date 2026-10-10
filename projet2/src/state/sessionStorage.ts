import type { AppStoreState } from './storeTypes';

export function exportSessionToJson(state: AppStoreState): string {
  const sessionData = {
    version: '2.0.0-UX',
    timestamp: Date.now(),
    scenarioId: state.scenarioId,
    directiveId: state.selectedDirective?.id ?? 1,
    inputs: state.inputs,
    seed: state.seed,
    userJourney: state.userJourney,
    selectedCountry: state.selectedCountry,
    selectedParty: state.selectedParty,
    selectedLobby: state.selectedLobby,
    selectedAmendments: Array.from(state.selectedAmendments),
    voteState: {
      stepStatus: state.voteState.stepStatus,
      stateVotes: state.voteState.stateVotes,
      partyVotes: state.voteState.partyVotes,
      appliedToSimulation: state.voteState.appliedToSimulation,
      adoptedAmendmentsCount: state.voteState.adoptedAmendmentsCount,
      lastAdoptedAmendments: state.voteState.lastAdoptedAmendments
    },
    financialAgreement: state.financialAgreement ?? null
  };
  return JSON.stringify(sessionData, null, 2);
}

export function downloadSessionFile(state: AppStoreState): void {
  const jsonStr = exportSessionToJson(state);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ue-simu-session-s${state.scenarioId}-d${state.selectedDirective?.id ?? 1}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function promptImportSession(onSuccess: (data: any) => void, onError?: (err: string) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.scenarioId || !parsed.directiveId) {
          throw new Error('Format de session UE-SIMU invalide.');
        }
        onSuccess(parsed);
      } catch (err: any) {
        if (onError) onError(err.message || 'Fichier JSON corrompu');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
