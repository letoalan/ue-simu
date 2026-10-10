import type { ScenarioId, Directive, CountryCode, PartyCode, LobbyCode } from '../domain/types';
import type { FinancialProposal } from '../domain/financeTypes';
import { loadScenario, loadDirectiveDetails } from '../data/scenarios';
import { runSimulation } from '../simulation/engine';
import { FinancialImplementationProvider } from '../simulation/financialImplementationProvider';
import {
  type TabId, type VoteChoice, type VoteStepData, type VoteStepStatus,
  type VoteCalculationResult, type VoteStoreState, type AppStoreState,
  type UserJourney, type Listener, ALL_COUNTRY_CODES, ALL_PARTY_CODES
} from './storeTypes';
import { buildVoteSteps, initVoteState, calculateVoteStepResult } from './voteEngine';
import {
  setActorVoteAction, setAllVotesForStepAction, toggleRealisticVotesForStepAction,
  invertVotesForStepAction, resetVotesForStepAction, validateVoteStepAction,
  applyVoteToSimulationAction
} from './storeVoteActions';
import {
  initFinanceAction, updateProposalAction, voteFinanceAction, resetFinanceAction, isFinanceUnlocked
} from './storeFinanceActions';
import {
  recalculateInputsFromAmendmentsAction, resetSessionAction, restoreSessionAction
} from './storeSessionActions';

export type { TabId, VoteChoice, VoteStepData, VoteStepStatus, VoteCalculationResult, VoteStoreState, AppStoreState, UserJourney, Listener };
export { ALL_COUNTRY_CODES, ALL_PARTY_CODES, isFinanceUnlocked };

class AppStore {
  private state: AppStoreState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    const initialScenarioId: ScenarioId = 1;
    const initialSeed = 42;
    const initialInputs = { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 8.0, veb_eu: 80.0 };
    this.state = {
      scenarioId: initialScenarioId,
      scenarioData: null,
      selectedDirective: null,
      selectedAmendments: new Set(),
      inputs: initialInputs,
      selectedCountry: 'DE',
      selectedParty: 'PPE',
      selectedLobby: 'BIG_TECH',
      activeTab: 'intro',
      userJourney: 'participant',
      seed: initialSeed,
      simulationResult: runSimulation({ scenarioId: initialScenarioId, inputs: initialInputs, seed: initialSeed }),
      voteState: initVoteState(null),
      costAssessment: null,
      financialProposal: null,
      financialAgreement: null
    };
  }

  getState(): Readonly<AppStoreState> { return this.state; }
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify(): void { for (const listener of this.listeners) listener(this.state); }

  async initScenario(scenarioId: ScenarioId): Promise<void> {
    try {
      this.state.scenarioId = scenarioId;
      this.state.scenarioData = await loadScenario(scenarioId);
      this.selectDirective(1);
    } catch (err) { console.error(`Erreur chargement scénario ${scenarioId}:`, err); }
  }

  async drawRandomScenario(): Promise<void> {
    await this.initScenario((Math.floor(Math.random() * 5) + 1) as ScenarioId);
  }

  async drawRandomDirective(): Promise<void> {
    if (!this.state.scenarioData) return;
    const directives = this.state.scenarioData.directive || [];
    if (directives.length === 0) return;
    const rand = directives[Math.floor(Math.random() * directives.length)];
    const details = await loadDirectiveDetails(this.state.scenarioId, rand.id);
    if (details) this.selectDirective(details.id);
  }

  selectDirective(directiveId: number): void {
    const list = this.state.scenarioData?.directive || [];
    const d = list.find(item => item.id === directiveId);
    if (d) {
      this.state.selectedDirective = d;
      this.state.selectedAmendments.clear();
      this.state.inputs = { ...d.statistiques_depart };
      this.state.financialAgreement = null;
      this.state.costAssessment = null;
      this.state.financialProposal = null;
      this.initVoteStateForDirective(d);
      this.recomputeSimulation();
    }
  }

  buildVoteSteps(directive: Directive | null = this.state.selectedDirective): VoteStepData[] {
    return buildVoteSteps(directive);
  }

  initVoteStateForDirective(directive: Directive | null): void {
    if (directive) this.state.voteState = initVoteState(directive);
  }
  setActorVote(type: 'state' | 'party', actorCode: string, stepId: string, choice: VoteChoice): void {
    setActorVoteAction(this.state, type, actorCode, stepId, choice);
    this.notify();
  }
  setAllVotesForStep(stepId: string, type: 'state' | 'party', choice: VoteChoice): void {
    setAllVotesForStepAction(this.state, stepId, type, choice);
    this.notify();
  }
  toggleRealisticVotesForStep(stepId: string): void {
    toggleRealisticVotesForStepAction(this.state, stepId, this.buildVoteSteps());
    this.notify();
  }
  setRealisticVotesForStep(stepId: string): void { this.toggleRealisticVotesForStep(stepId); }
  invertVotesForStep(stepId: string): void { invertVotesForStepAction(this.state, stepId); this.notify(); }
  resetVotesForStep(stepId: string): void { resetVotesForStepAction(this.state, stepId); this.notify(); }
  setStepCurrent(stepId: string): void { this.state.voteState.currentStepId = stepId; this.notify(); }
  validateVoteStep(stepId: string): void {
    validateVoteStepAction(this.state, stepId, this.buildVoteSteps());
    this.notify();
  }
  calculateVoteStepResult(stepId: string): VoteCalculationResult {
    return calculateVoteStepResult(this.state.voteState, stepId);
  }

  applyVoteToSimulation(): void {
    applyVoteToSimulationAction(this.state);
    this.recomputeSimulation();
    this.setActiveTab('simulator');
  }

  toggleAmendment(amendmentId: string): void {
    const updated = new Set(this.state.selectedAmendments);
    if (updated.has(amendmentId)) updated.delete(amendmentId);
    else updated.add(amendmentId);
    this.state.selectedAmendments = updated;
    recalculateInputsFromAmendmentsAction(this.state);
    this.recomputeSimulation();
  }

  clearAmendments(): void {
    this.state.selectedAmendments = new Set();
    recalculateInputsFromAmendmentsAction(this.state);
    this.recomputeSimulation();
  }

  updateInput(key: string, value: number): void {
    this.state.inputs = { ...this.state.inputs, [key]: value };
    this.recomputeSimulation();
  }
  setSeed(seed: number): void { this.state.seed = seed; this.recomputeSimulation(); }
  selectCountry(country: CountryCode): void { this.state.selectedCountry = country; this.notify(); }
  selectParty(party: PartyCode): void { this.state.selectedParty = party; this.notify(); }
  selectLobby(lobby: LobbyCode): void { this.state.selectedLobby = lobby; this.notify(); }
  setActiveTab(tab: TabId): void { this.state.activeTab = tab; this.notify(); }
  setUserJourney(journey: UserJourney): void { this.state.userJourney = journey; this.notify(); }

  resetSession(): void {
    resetSessionAction(this.state);
    this.recomputeSimulation();
  }

  async restoreSession(data: any): Promise<void> {
    if (data.scenarioId && data.scenarioId !== this.state.scenarioId) {
      await this.initScenario(data.scenarioId);
    }
    if (data.directiveId && data.directiveId !== this.state.selectedDirective?.id) {
      this.selectDirective(data.directiveId);
    }
    restoreSessionAction(this.state, data);
    this.recomputeSimulation();
  }

  async initFinance(): Promise<void> {
    await initFinanceAction(this.state);
    this.notify();
  }
  updateFinancialProposal(updates: Partial<FinancialProposal>): void {
    updateProposalAction(this.state, updates);
    this.notify();
  }
  voteFinancialAgreement(): void {
    voteFinanceAction(this.state);
    this.recomputeSimulation();
  }
  resetFinancialAgreement(): void {
    resetFinanceAction(this.state);
    this.recomputeSimulation();
  }

  recomputeSimulation(): void {
    const provider = this.state.financialAgreement?.adopted
      ? new FinancialImplementationProvider(this.state.financialAgreement)
      : undefined;

    this.state.simulationResult = runSimulation({
      scenarioId: this.state.scenarioId,
      inputs: this.state.inputs,
      seed: this.state.seed,
      implementationProvider: provider
    });
    this.notify();
  }
}

export const store = new AppStore();
