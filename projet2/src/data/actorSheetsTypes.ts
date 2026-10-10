import type { CountryCode, PartyCode, LobbyCode } from '../domain/types';

export interface AmendmentPosition {
  amendement: string;
  titre?: string;
  position: 'FAVORABLE' | 'DEFAVORABLE' | 'FAVORABLE_CONDITIONNEL' | 'DEFAVORABLE_PARTIEL' | string;
  justification: string;
  priorite?: string;
  origine?: string;
  description?: string;
}

export interface ActorSheet {
  id: string;
  category: 'commission' | 'states' | 'parties' | 'lobbies';
  categoryLabel: string;
  type: string;
  nom: string;
  roleEuropeen: string;
  enjeuxDirective: string[];
  impactsDirective: string[];
  strategie: string;
  alliances: string[];
  oppositions: string[];
  arguments: string[];
  positionsAmendements: AmendmentPosition[];
  notesInternes?: string;
  scenarioId: number;
  directiveId: number;
  icon?: string;
  badgeColor?: string;
}

export interface DirectiveActorSheets {
  scenarioId: number;
  directiveId: number;
  commission: ActorSheet;
  states: Record<string, ActorSheet>;
  parties: Record<string, ActorSheet>;
  lobbies: Record<string, ActorSheet>;
}

/**
 * Normalise l'identifiant pays vers le CountryCode interne
 */
export function normalizeCountryId(idOrNom: string): CountryCode {
  const clean = (idOrNom || '').toLowerCase().trim();
  if (clean.includes('allemagne') || clean === 'de') return 'DE';
  if (clean.includes('france') || clean === 'fr') return 'FR';
  if (clean.includes('italie') || clean === 'it') return 'IT';
  if (clean.includes('hongrie') || clean === 'hu') return 'HU';
  if (clean.includes('pologne') || clean === 'pl') return 'PL';
  if (clean.includes('suede') || clean.includes('suède') || clean === 'se') return 'SE';
  return 'DE';
}

/**
 * Normalise l'identifiant parti vers le PartyCode interne
 */
export function normalizePartyId(idOrNom: string): PartyCode {
  const clean = (idOrNom || '').toLowerCase().trim();
  if (clean.includes('ppe')) return 'PPE';
  if (clean.includes('sd') || clean.includes('socialiste')) return 'SDE';
  if (clean.includes('renew') || clean.includes('renouveau')) return 'RENEW';
  if (clean.includes('vert')) return 'VERT';
  if (clean.includes('ecr') || clean.includes('conservateur')) return 'ECR';
  if (clean.includes('gue') || clean.includes('gauche')) return 'GUE';
  return 'PPE';
}

/**
 * Normalise l'identifiant lobby vers le LobbyCode interne
 */
export function normalizeLobbyId(idOrNom: string): LobbyCode {
  const clean = (idOrNom || '').toLowerCase().trim();
  if (clean.includes('tech')) return 'BIG_TECH';
  if (clean.includes('fossile')) return 'ENERGIES_FOSSILES';
  if (clean.includes('finance') || clean.includes('banque')) return 'BANQUES_FINANCE';
  if (clean.includes('agro')) return 'AGROCHIMIE';
  if (clean.includes('pharma')) return 'PHARMA';
  if (clean.includes('auto')) return 'AUTOMOBILE';
  return 'BIG_TECH';
}
