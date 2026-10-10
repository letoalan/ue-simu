import type { VoteStepData, VoteStoreState } from './storeTypes';

/**
 * Heuristique de vote réaliste des acteurs selon l'orientation politique ou thématique du pas de vote
 */
export function applyRealisticVotesLogic(
  vState: VoteStoreState,
  stepId: string,
  steps: VoteStepData[]
): void {
  const currentStep = steps.find(s => s.id === stepId);
  if (!vState.stateVotes[stepId]) vState.stateVotes[stepId] = {} as any;
  if (!vState.partyVotes[stepId]) vState.partyVotes[stepId] = {} as any;

  if (stepId === 'directive' || stepId === 'package') {
    vState.stateVotes[stepId]['DE'] = 'pour';
    vState.stateVotes[stepId]['FR'] = 'pour';
    vState.stateVotes[stepId]['IT'] = 'pour';
    vState.stateVotes[stepId]['SE'] = 'pour';
    vState.stateVotes[stepId]['PL'] = 'abstention';
    vState.stateVotes[stepId]['HU'] = 'contre';

    vState.partyVotes[stepId]['PPE'] = 'pour';
    vState.partyVotes[stepId]['SDE'] = 'pour';
    vState.partyVotes[stepId]['RENEW'] = 'pour';
    vState.partyVotes[stepId]['VERT'] = 'pour';
    vState.partyVotes[stepId]['ECR'] = 'contre';
    vState.partyVotes[stepId]['GUE'] = 'abstention';
  } else if (currentStep?.amendOrigine?.includes('Verts') || currentStep?.amendOrigine?.includes('environnement')) {
    vState.stateVotes[stepId]['DE'] = 'pour';
    vState.stateVotes[stepId]['FR'] = 'pour';
    vState.stateVotes[stepId]['SE'] = 'pour';
    vState.stateVotes[stepId]['IT'] = 'abstention';
    vState.stateVotes[stepId]['PL'] = 'contre';
    vState.stateVotes[stepId]['HU'] = 'contre';

    vState.partyVotes[stepId]['VERT'] = 'pour';
    vState.partyVotes[stepId]['SDE'] = 'pour';
    vState.partyVotes[stepId]['GUE'] = 'pour';
    vState.partyVotes[stepId]['RENEW'] = 'pour';
    vState.partyVotes[stepId]['PPE'] = 'abstention';
    vState.partyVotes[stepId]['ECR'] = 'contre';
  } else if (currentStep?.amendOrigine?.includes('PPE') || currentStep?.amendOrigine?.includes('industrie')) {
    vState.stateVotes[stepId]['DE'] = 'pour';
    vState.stateVotes[stepId]['FR'] = 'pour';
    vState.stateVotes[stepId]['IT'] = 'pour';
    vState.stateVotes[stepId]['PL'] = 'pour';
    vState.stateVotes[stepId]['SE'] = 'abstention';
    vState.stateVotes[stepId]['HU'] = 'pour';

    vState.partyVotes[stepId]['PPE'] = 'pour';
    vState.partyVotes[stepId]['RENEW'] = 'pour';
    vState.partyVotes[stepId]['ECR'] = 'pour';
    vState.partyVotes[stepId]['SDE'] = 'abstention';
    vState.partyVotes[stepId]['VERT'] = 'contre';
    vState.partyVotes[stepId]['GUE'] = 'contre';
  } else {
    vState.stateVotes[stepId]['DE'] = 'pour';
    vState.stateVotes[stepId]['FR'] = 'pour';
    vState.stateVotes[stepId]['IT'] = 'pour';
    vState.stateVotes[stepId]['SE'] = 'pour';
    vState.stateVotes[stepId]['PL'] = 'abstention';
    vState.stateVotes[stepId]['HU'] = 'abstention';

    vState.partyVotes[stepId]['PPE'] = 'pour';
    vState.partyVotes[stepId]['SDE'] = 'pour';
    vState.partyVotes[stepId]['RENEW'] = 'pour';
    vState.partyVotes[stepId]['VERT'] = 'abstention';
    vState.partyVotes[stepId]['ECR'] = 'contre';
    vState.partyVotes[stepId]['GUE'] = 'abstention';
  }
}
