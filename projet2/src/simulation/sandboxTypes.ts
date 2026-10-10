import type { ScenarioId, SimulationResult, CountryCode, PartyCode, LobbyCode } from '../domain/types';

export type SandboxActorType = 'eu' | 'country' | 'party' | 'lobby';

export interface SandboxScope {
  actorType: SandboxActorType;
  countryCode: CountryCode;
  partyCode: PartyCode;
  lobbyCode: LobbyCode;
}

export interface KPIDelta {
  key: string;
  label: string;
  unit: string;
  baselineVal: number;
  amendedVal: number;
  delta: number;
  isPositiveForEU: boolean;
}

export interface ActorKPISummary {
  actorType: SandboxActorType;
  actorKey: string;
  actorName: string;
  actorSubtitle?: string;
  kpiDeltas: KPIDelta[];
  scoreLabel: string;
  scoreBaseline: number;
  scoreAmended: number;
  scoreDelta: number;
}

export interface SandboxComparisonResult {
  scenarioId: ScenarioId;
  directiveId: number;
  directiveName: string;
  selectedAmendmentsCount: number;
  baselineInputs: Record<string, number>;
  amendedInputs: Record<string, number>;
  baselineResult: SimulationResult;
  amendedResult: SimulationResult;
  kpiDeltas: KPIDelta[];
  scoreBaseline: number;
  scoreAmended: number;
  scoreDelta: number;
}
