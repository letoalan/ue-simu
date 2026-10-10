import type { PartyCode } from './types';

export type ParliamentGroupCode = PartyCode | 'OTHERS';

export interface ParliamentGroupData {
  code: ParliamentGroupCode;
  nom: string;
  nomCourt: string;
  couleur: string;
  baseSeats: number;
  currentSeats: number;
  delta: number;
  percent: number;
  seatsArr: number[];
  satisfaction: number;
}

export interface ParliamentCoalition {
  nom: string;
  groupCodes: ParliamentGroupCode[];
  seats: number;
  hasMajority: boolean;
  percent: number;
}

export interface ParliamentResult {
  totalSeats: number;
  majorityThreshold: number;
  groups: Record<ParliamentGroupCode, ParliamentGroupData>;
  groupList: ParliamentGroupData[];
  coalitions: ParliamentCoalition[];
}
