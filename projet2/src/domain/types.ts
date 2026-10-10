/**
 * Types et interfaces fondamentales du domaine de simulation UE-SIMU.
 */

export type ScenarioId = 1 | 2;

export type CountryCode = 'DE' | 'FR' | 'IT' | 'PL' | 'SE' | 'HU';

export type PartyCode = 'PPE' | 'SDE' | 'RENEW' | 'VERT' | 'ECR' | 'GUE';

export type LobbyCode = 'BIG_TECH' | 'ENERGIES_FOSSILES' | 'BANQUES_FINANCE' | 'AGROCHIMIE' | 'PHARMA' | 'AUTOMOBILE';

export interface CountryMeta {
  code: CountryCode;
  name: string;
  population: number; // Millions
  flagUrl: string;
}

export interface CountryProfile {
  name: string;
  code: CountryCode;
  population: number;
  dev: {
    init: { croiss: number; gini: number; co2: number; veb: number };
    sens: { croiss_co2: number; co2_veb: number; veb_gini: number; veb_croiss: number };
    pond: { croiss: number; gini: number; co2: number; veb: number };
  };
  geo: {
    init: { normandie: number; vdem: number; pib: number; idh: number };
    sens: { norm_vdem: number; vdem_norm: number; norm_pib: number; norm_idh: number; pib_idh: number };
    pond: { normandie: number; vdem: number; pib: number; idh: number };
  };
}

export interface PartyProfile {
  code: PartyCode;
  nom: string;
  couleur: string;
  logoUrl?: string;
  base: {
    meps: number;
    conseil: number;
    commissaires: number;
    influence: number;
  };
  impact: {
    eco: number;
    social: number;
    env: number;
    geo: number;
  };
  pond: {
    pib: number;
    gini: number;
    co2: number;
    veb: number;
    stab: number;
    dem: number;
    idh: number;
  };
}

export interface LobbyProfile {
  code: LobbyCode;
  nom: string;
  couleur: string;
  logoUrl?: string;
  base: {
    reputation: number;
    infEtats: number;
    infParlement: number;
    infCommission: number;
  };
  facteurs: {
    rep: Record<string, number>;
    inf: Record<string, number>;
  };
  ennemis: string[];
}

export interface Amendment {
  id: string;
  type: 'parlement' | 'conseil' | 'commission' | 'lobby';
  origine: string;
  description: string;
  impact: Record<string, number>;
}

export interface Directive {
  id: number;
  nom: string;
  orientation: string;
  proposition: string;
  description: string;
  declaration_intention: string;
  statistiques_depart: Record<string, number>;
  amendements: Amendment[];
}

export interface ScenarioDefinition {
  scenario: ScenarioId;
  titre: string;
  description: string;
  directive: Directive[];
}

export type { ActionRealization, ImplementationProvider } from './realizationTypes';

export interface SimulationInputs {
  scenarioId: ScenarioId;
  inputs: Record<string, number>;
  seed?: number;
  selectedDirectiveId?: number;
  selectedAmendments?: string[];
  implementationProvider?: import('./realizationTypes').ImplementationProvider;
  skipBaseline?: boolean;
}

export interface YearState {
  year: number;
  eu: Record<string, number>;
  euSatisfaction: number;
  countries: Record<CountryCode, {
    values: Record<string, number>;
    satisfaction: number;
  }>;
  parties: Record<PartyCode, {
    satisfaction: number;
    meps: number;
    commissaires: number;
    conseil: number;
    pres: number;
  }>;
  lobbies: Record<LobbyCode, {
    reputation: number;
    infEtats: number;
    infParlement: number;
    infCommission: number;
  }>;
}

export interface CountryResult {
  code: CountryCode;
  name: string;
  series: Record<string, number[]>;
  satisfaction: number[];
  scoreSucces: number;
  ecartProgression: number;
  netGainVsReference?: number;
}

export interface PartyResult {
  code: PartyCode;
  nom: string;
  couleur: string;
  satisfactionArr: number[];
  mepsArr: number[];
  commissairesArr: number[];
  conseilArr: number[];
  presArr: number[];
  scoreVictoire: number;
  satisfactionMoyenne: number;
}

export interface LobbyResult {
  code: LobbyCode;
  nom: string;
  couleur: string;
  reputationArr: number[];
  infEtatsArr: number[];
  infParlementArr: number[];
  infCommissionArr: number[];
  scoreDeReussite: number;
}

export interface SimulationResult {
  scenarioId: ScenarioId;
  years: number[]; // 2025 à 2034
  yearlyStates: YearState[];
  euSeries: Record<string, number[]>;
  euSatisfaction: number[];
  euScoreSucces: number;
  countries: Record<CountryCode, CountryResult>;
  parties: Record<PartyCode, PartyResult>;
  lobbies: Record<LobbyCode, LobbyResult>;
  calculatedAt: number;
  seed: number;
  euNetGainVsReference?: number;
  baselineEUFinalSatisfaction?: number;
  parliament?: import('./parliamentTypes').ParliamentResult;
}
