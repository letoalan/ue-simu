import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/state/store';

describe('Module de Vote et Co-législation Européenne', () => {
  beforeEach(async () => {
    await store.initScenario(1);
    store.selectDirective(1); // Pacte vert innovant
  });

  it('initialise correctement les étapes de vote (Directive + Amendements + Package)', () => {
    const steps = store.buildVoteSteps();
    expect(steps.length).toBeGreaterThanOrEqual(4);
    expect(steps[0].id).toBe('directive');
    expect(steps[1].id).toBe('amend-1');
    expect(steps[steps.length - 1].id).toBe('package');
  });

  it('calcule rigoureusement la Majorité Qualifiée du Conseil (≥ 4 États et ≥ 65% de la population)', () => {
    const stepId = 'amend-1';

    // Total population: DE (84.3) + FR (64.7) + IT (58.9) + PL (38.0) + SE (10.5) + HU (9.6) = 266.0 M
    // Cas 1 : 4 petits États votent Pour : PL (38.0) + SE (10.5) + HU (9.6) + IT (58.9) = 117.0 M (43.98% pop)
    // 4 États sur 6 (≥ 55% atteint) MAIS seulement 44% de population (< 65% manquant)
    store.setAllVotesForStep(stepId, 'state', 'contre');
    store.setActorVote('state', 'PL', stepId, 'pour');
    store.setActorVote('state', 'SE', stepId, 'pour');
    store.setActorVote('state', 'HU', stepId, 'pour');
    store.setActorVote('state', 'IT', stepId, 'pour');

    let calc = store.calculateVoteStepResult(stepId);
    expect(calc.statesPour).toBe(4);
    expect(calc.popPct).toBeLessThan(65.0);
    expect(calc.councilPassed).toBe(false); // Refusé au Conseil car manque de population

    // Cas 2 : 2 grands États votent Pour : DE (84.3) + FR (64.7) = 149.0 M (56% pop)
    // Toujours insuffisant en États (2/6 < 4) et en pop (56% < 65%)
    store.setAllVotesForStep(stepId, 'state', 'contre');
    store.setActorVote('state', 'DE', stepId, 'pour');
    store.setActorVote('state', 'FR', stepId, 'pour');
    calc = store.calculateVoteStepResult(stepId);
    expect(calc.councilPassed).toBe(false);

    // Cas 3 : Majorité Qualifiée atteinte : DE (84.3) + FR (64.7) + IT (58.9) + SE (10.5) = 218.4 M (82.1% pop)
    // 4 États sur 6 ET 82.1% population (≥ 65%)
    store.setActorVote('state', 'IT', stepId, 'pour');
    store.setActorVote('state', 'SE', stepId, 'pour');
    calc = store.calculateVoteStepResult(stepId);
    expect(calc.statesPour).toBe(4);
    expect(calc.popPct).toBeGreaterThanOrEqual(65.0);
    expect(calc.councilPassed).toBe(true); // Validé au Conseil !
  });

  it('calcule rigoureusement la Majorité Absolue du Parlement (> 50% des sièges totaux = ≥ 306 voix)', () => {
    const stepId = 'amend-1';

    // Total sièges: PPE (182) + SDE (154) + RENEW (102) + VERT (72) + ECR (62) + GUE (39) = 611 sièges
    // Seuil de majorité absolue = > 305.5 => 306 sièges

    // Cas 1 : PPE seul (182 sièges < 306)
    store.setAllVotesForStep(stepId, 'party', 'contre');
    store.setActorVote('party', 'PPE', stepId, 'pour');
    let calc = store.calculateVoteStepResult(stepId);
    expect(calc.seatsPour).toBe(182);
    expect(calc.parliamentPassed).toBe(false);

    // Cas 2 : Coalition SDE (154) + VERT (72) + GUE (39) = 265 sièges (< 306)
    store.setAllVotesForStep(stepId, 'party', 'contre');
    store.setActorVote('party', 'SDE', stepId, 'pour');
    store.setActorVote('party', 'VERT', stepId, 'pour');
    store.setActorVote('party', 'GUE', stepId, 'pour');
    calc = store.calculateVoteStepResult(stepId);
    expect(calc.seatsPour).toBe(265);
    expect(calc.parliamentPassed).toBe(false);

    // Cas 3 : Coalition majoritaire SDE (154) + RENEW (102) + VERT (72) + GUE (39) = 367 sièges (≥ 306)
    store.setActorVote('party', 'RENEW', stepId, 'pour');
    calc = store.calculateVoteStepResult(stepId);
    expect(calc.seatsPour).toBe(367);
    expect(calc.parliamentPassed).toBe(true); // Validé au Parlement !
  });

  it('adopte un amendement SI ET SEULEMENT SI le Conseil et le Parlement votent tous deux Pour', () => {
    const stepId = 'amend-1';

    // Conseil OK, Parlement KO
    store.setAllVotesForStep(stepId, 'state', 'pour');
    store.setAllVotesForStep(stepId, 'party', 'contre');
    let calc = store.calculateVoteStepResult(stepId);
    expect(calc.councilPassed).toBe(true);
    expect(calc.parliamentPassed).toBe(false);
    expect(calc.stepPassed).toBe(false);

    // Conseil KO, Parlement OK
    store.setAllVotesForStep(stepId, 'state', 'contre');
    store.setAllVotesForStep(stepId, 'party', 'pour');
    calc = store.calculateVoteStepResult(stepId);
    expect(calc.councilPassed).toBe(false);
    expect(calc.parliamentPassed).toBe(true);
    expect(calc.stepPassed).toBe(false);

    // Conseil OK et Parlement OK => ADOPTÉ !
    store.setAllVotesForStep(stepId, 'state', 'pour');
    store.setAllVotesForStep(stepId, 'party', 'pour');
    calc = store.calculateVoteStepResult(stepId);
    expect(calc.councilPassed).toBe(true);
    expect(calc.parliamentPassed).toBe(true);
    expect(calc.stepPassed).toBe(true);
  });

  it('applique les amendements adoptés et met à jour les indicateurs de la simulation', () => {
    // Validons amend-1 comme ADOPTÉ (Pacte vert amendement 1: { pib_eu: 2.5, gini_eu: 0.29, co2_eu: 6, veb_eu: 85 })
    store.setAllVotesForStep('amend-1', 'state', 'pour');
    store.setAllVotesForStep('amend-1', 'party', 'pour');
    store.validateVoteStep('amend-1');

    // Amend-2 REJETÉ
    store.setAllVotesForStep('amend-2', 'state', 'contre');
    store.setAllVotesForStep('amend-2', 'party', 'contre');
    store.validateVoteStep('amend-2');

    // Appliquer au simulateur
    store.applyVoteToSimulation();

    const state = store.getState();
    expect(state.activeTab).toBe('simulator');
    expect(state.voteState.appliedToSimulation).toBe(true);
    expect(state.voteState.adoptedAmendmentsCount).toBe(1);

    // L'amendement 1 a été retenu et a modifié le PIB de départ à 2.5 (au lieu de 2.0)
    expect(state.inputs.pib_eu).toBe(2.5);
    expect(state.inputs.co2_eu).toBe(6.0);
  });

  it('permet d\'inverser (annuler / rétablir) le vote réaliste par un second clic', () => {
    const stepId = 'amend-1';

    // État de départ personnalisé : tous contre
    store.setAllVotesForStep(stepId, 'state', 'contre');
    store.setAllVotesForStep(stepId, 'party', 'contre');
    let calcInit = store.calculateVoteStepResult(stepId);
    expect(calcInit.statesPour).toBe(0);
    expect(calcInit.seatsPour).toBe(0);

    // 1er clic : active le vote réaliste
    store.toggleRealisticVotesForStep(stepId);
    let state = store.getState();
    expect(state.voteState.realisticActive[stepId]).toBe(true);
    let calcRealistic = store.calculateVoteStepResult(stepId);
    expect(calcRealistic.statesPour).toBeGreaterThanOrEqual(3);
    expect(calcRealistic.seatsPour).toBeGreaterThan(0);

    // 2nd clic : INVERSE / ANNULE le vote réaliste et rétablit l'état de départ
    store.toggleRealisticVotesForStep(stepId);
    state = store.getState();
    expect(state.voteState.realisticActive[stepId]).toBe(false);
    let calcRestored = store.calculateVoteStepResult(stepId);
    expect(calcRestored.statesPour).toBe(0);
    expect(calcRestored.seatsPour).toBe(0);
  });

  it('permet d\'inverser instantanément tous les votes (Pour ⇄ Contre)', () => {
    const stepId = 'directive';

    // DE et FR votent Pour, IT et PL votent Contre
    store.resetVotesForStep(stepId);
    store.setActorVote('state', 'DE', stepId, 'pour');
    store.setActorVote('state', 'FR', stepId, 'pour');
    store.setActorVote('state', 'IT', stepId, 'contre');
    store.setActorVote('state', 'PL', stepId, 'contre');

    let calc = store.calculateVoteStepResult(stepId);
    expect(calc.statesPour).toBe(2);
    expect(calc.statesContre).toBe(2);

    // Inversion globale
    store.invertVotesForStep(stepId);

    const vState = store.getState().voteState;
    expect(vState.stateVotes[stepId]['DE']).toBe('contre');
    expect(vState.stateVotes[stepId]['FR']).toBe('contre');
    expect(vState.stateVotes[stepId]['IT']).toBe('pour');
    expect(vState.stateVotes[stepId]['PL']).toBe('pour');

    calc = store.calculateVoteStepResult(stepId);
    expect(calc.statesPour).toBe(2);
    expect(calc.statesContre).toBe(2);
  });
});
