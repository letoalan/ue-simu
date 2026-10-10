import type { ActorSheet, DirectiveActorSheets } from './actorSheetsTypes';
import { COUNTRIES_META } from './countries';
import { PARTIES_PROFILES } from './parties';
import { LOBBIES_PROFILES } from './lobbies';
import type { CountryCode, PartyCode, LobbyCode } from '../domain/types';

/**
 * Fallback de secours si le chargement des JSON échoue (ex: environnement Node / tests unitaires sans serveur statique).
 */
export function createFallbackDirectiveSheets(scenarioId: number, directiveId: number): DirectiveActorSheets {
  const commission: ActorSheet = {
    id: 'commission',
    category: 'commission',
    categoryLabel: 'Commission Européenne',
    type: 'Commission',
    nom: 'Commission Européenne',
    roleEuropeen: 'Gardienne des traités et monopole de proposition',
    enjeuxDirective: ['Garantir la cohérence institutionnelle', 'Concilier ambition et faisabilité budgétaire'],
    impactsDirective: ['Consolide le rôle d’arbitre impartial de la Commission'],
    strategie: 'Bâtir un consensus entre le Parlement européen et le Conseil des ministres.',
    alliances: ['Parti Populaire Européen (PPE)', 'France', 'Allemagne'],
    oppositions: ['Positions extrêmes rejetant le compromis'],
    arguments: ['La directive répond à un impératif d’intérêt général européen.'],
    positionsAmendements: [
      {
        amendement: '1',
        titre: 'Renforcement des clauses de sauvegarde',
        position: 'FAVORABLE_CONDITIONNEL',
        justification: 'Accepte les compromis préservant l’ambition globale du texte.',
        priorite: 'haute'
      }
    ],
    scenarioId,
    directiveId,
    icon: './medias/images/euro/eurocomm.jpg',
    badgeColor: '#16a34a'
  };

  const countryCodes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
  const states: Record<string, ActorSheet> = {};
  for (const c of countryCodes) {
    const meta = COUNTRIES_META[c];
    states[c] = {
      id: c,
      category: 'states',
      categoryLabel: 'États Membres (Conseil)',
      type: 'État Membre',
      nom: meta.name,
      roleEuropeen: 'Membre du Conseil de l’Union Européenne',
      enjeuxDirective: [`Défense des intérêts économiques et industriels de ${meta.name}`],
      impactsDirective: [`Modulation des impacts budgétaires nationaux`],
      strategie: 'Former une minorité de blocage ou négocier des exemptions ciblées.',
      alliances: ['Partenaires régionaux'],
      oppositions: ['Contraintes réglementaires disproportionnées'],
      arguments: [`La souveraineté et les spécificités de ${meta.name} doivent être préservées.`],
      positionsAmendements: [],
      scenarioId,
      directiveId,
      icon: meta.flagUrl,
      badgeColor: '#d97706'
    };
  }

  const partyCodes: PartyCode[] = ['PPE', 'SDE', 'RENEW', 'VERT', 'ECR', 'GUE'];
  const parties: Record<string, ActorSheet> = {};
  for (const p of partyCodes) {
    const meta = PARTIES_PROFILES[p];
    parties[p] = {
      id: p,
      category: 'parties',
      categoryLabel: 'Parlement Européen',
      type: 'Groupe Politique',
      nom: meta.nom,
      roleEuropeen: `Groupe parlementaire (${meta.base.meps} députés)`,
      enjeuxDirective: [`Alignement sur les valeurs et doctrines du groupe ${meta.nom}`],
      impactsDirective: [`Renforcement de la base électorale`],
      strategie: 'Co-légiférer avec le Conseil et peser sur les amendements.',
      alliances: ['Partenaires de coalition'],
      oppositions: ['Groupes politiques opposés'],
      arguments: [`Le mandat des citoyens européens exige une action résolue.`],
      positionsAmendements: [],
      scenarioId,
      directiveId,
      icon: meta.logoUrl,
      badgeColor: meta.couleur
    };
  }

  const lobbyCodes: LobbyCode[] = ['BIG_TECH', 'ENERGIES_FOSSILES', 'BANQUES_FINANCE', 'AGROCHIMIE', 'PHARMA', 'AUTOMOBILE'];
  const lobbies: Record<string, ActorSheet> = {};
  for (const l of lobbyCodes) {
    const meta = LOBBIES_PROFILES[l];
    lobbies[l] = {
      id: l,
      category: 'lobbies',
      categoryLabel: 'Société Civile & Lobbies',
      type: 'Groupe d’Intérêt',
      nom: meta.nom,
      roleEuropeen: 'Groupe de pression et représentation sectorielle',
      enjeuxDirective: [`Préservation de la compétitivité et régulation du secteur ${meta.nom}`],
      impactsDirective: [`Impact direct sur les coûts et marges du secteur`],
      strategie: 'Sensibiliser les décideurs publics et amender les articles critiques.',
      alliances: ['Fédérations industrielles alliées'],
      oppositions: ['Sur-réglementation et fiscalité défavorable'],
      arguments: [`L’innovation et l’emploi dépendent de la viabilité économique du secteur.`],
      positionsAmendements: [],
      scenarioId,
      directiveId,
      icon: meta.logoUrl,
      badgeColor: meta.couleur
    };
  }

  return {
    scenarioId,
    directiveId,
    commission,
    states,
    parties,
    lobbies
  };
}
