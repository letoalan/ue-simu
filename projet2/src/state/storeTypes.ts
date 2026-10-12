import type {
  ScenarioId,
  ScenarioDefinition,
  Directive,
  CountryCode,
  PartyCode,
  LobbyCode,
  SimulationResult
} from '../domain/types';
import type {
  CostAssessment,
  FinancialProposal,
  FinancialAgreement
} from '../domain/financeTypes';

export type TabId = 'landing' | 'intro' | 'institutions' | 'scenario' | 'actors' | 'vote' | 'finance' | 'pedagogy' | 'simulator';

export type VoteChoice = 'pour' | 'abstention' | 'contre';

export interface VoteStepData {
  id: string; // 'directive', 'amend-1' .. 'amend-8', 'package'
  name: string;
  description: string;
  amendIndex?: number;
  amendId?: string;
  amendOrigine?: string;
  amendType?: string;
  impact?: Record<string, number>;
}

export interface VoteStepStatus {
  validated: boolean;
  councilPassed: boolean;
  parliamentPassed: boolean;
  passed: boolean;
}

export interface VoteCalculationResult {
  statesPour: number;
  statesAbstention: number;
  statesContre: number;
  popPour: number;
  popTotal: number;
  popPct: number;
  councilPassed: boolean;
  councilRuleText: string;

  seatsPour: number;
  seatsAbstention: number;
  seatsContre: number;
  seatsTotal: number;
  parliamentPassed: boolean;
  parliamentRuleText: string;

  stepPassed: boolean;
}

export interface VoteStoreState {
  currentStepId: string;
  stateVotes: Record<string, Record<CountryCode, VoteChoice>>;
  partyVotes: Record<string, Record<PartyCode, VoteChoice>>;
  stepStatus: Record<string, VoteStepStatus>;
  appliedToSimulation: boolean;
  adoptedAmendmentsCount: number;
  lastAdoptedAmendments: string[];
  realisticActive: Record<string, boolean>;
  voteBackups: Record<string, { states: Record<CountryCode, VoteChoice>; parties: Record<PartyCode, VoteChoice> }>;
}

export type UserJourney = 'participant' | 'animateur' | 'maitre_du_jeu';

export interface AppStoreState {
  scenarioId: ScenarioId;
  scenarioData: ScenarioDefinition | null;
  selectedDirective: Directive | null;
  selectedAmendments: Set<string>;
  inputs: Record<string, number>;
  selectedCountry: CountryCode;
  selectedParty: PartyCode;
  selectedLobby: LobbyCode;
  activeTab: TabId;
  userJourney: UserJourney;
  seed: number;
  simulationResult: SimulationResult;
  voteState: VoteStoreState;
  costAssessment?: CostAssessment | null;
  financialProposal?: FinancialProposal | null;
  financialAgreement?: FinancialAgreement | null;
}

export type Listener = (state: AppStoreState) => void;

export const ALL_COUNTRY_CODES: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
export const ALL_PARTY_CODES: PartyCode[] = ['PPE', 'SDE', 'RENEW', 'VERT', 'ECR', 'GUE'];
