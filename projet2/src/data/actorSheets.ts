import { COUNTRIES_META } from './countries';
import { PARTIES_PROFILES } from './parties';
import { LOBBIES_PROFILES } from './lobbies';
import {
  type AmendmentPosition,
  type ActorSheet,
  type DirectiveActorSheets,
  normalizeCountryId,
  normalizePartyId,
  normalizeLobbyId
} from './actorSheetsTypes';
import { createFallbackDirectiveSheets } from './actorSheetsFallbacks';

export type { AmendmentPosition, ActorSheet, DirectiveActorSheets };

// Cache mémoire des fiches acteurs chargées par directive
const SHEETS_CACHE: Map<string, DirectiveActorSheets> = new Map();

/**
 * Helper compatible navigateur et Node.js (Vitest) pour charger les JSON statiques
 */
async function fetchJsonFile(relativePath: string): Promise<any> {
  if (typeof window !== 'undefined') {
    const res = await fetch(relativePath);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} chargement ${relativePath}`);
    }
    return await res.json();
  }

  // Environnement Node.js pour Vitest
  try {
    const fsMod = 'fs';
    const pathMod = 'path';
    const fs = await import(/* @vite-ignore */ fsMod);
    const path = await import(/* @vite-ignore */ pathMod);
    const cleanPath = relativePath.replace(/^\.\//, '');
    const fullPath = path.resolve(process.cwd(), 'public', cleanPath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    }
  } catch {
    // Poursuite de secours
  }

  const res = await fetch(relativePath);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} chargement ${relativePath}`);
  }
  return await res.json();
}

/**
 * Charge l'ensemble des fiches acteurs pour un scénario et une directive donnés.
 */
export async function loadActorSheetsForDirective(
  scenarioId: number,
  directiveId: number
): Promise<DirectiveActorSheets> {
  const cacheKey = `s${scenarioId}_d${directiveId}`;
  if (SHEETS_CACHE.has(cacheKey)) {
    return SHEETS_CACHE.get(cacheKey)!;
  }

  const basePath = `./json/directives/fiches-acteurs/s${scenarioId}/d${directiveId}`;

  try {
    const [comRaw, couRaw, parRaw, lobRaw] = await Promise.all([
      fetchJsonFile(`${basePath}/com_s${scenarioId}-d${directiveId}.json`),
      fetchJsonFile(`${basePath}/cou_s${scenarioId}-d${directiveId}.json`),
      fetchJsonFile(`${basePath}/par_s${scenarioId}-d${directiveId}.json`),
      fetchJsonFile(`${basePath}/lob_s${scenarioId}-d${directiveId}.json`)
    ]);
    const commission: ActorSheet = parseActorRaw(comRaw, 'commission', 'Commission Européenne', scenarioId, directiveId, {
      icon: './medias/images/euro/eurocomm.jpg', badgeColor: '#16a34a'
    });

    const states: Record<string, ActorSheet> = {};
    if (Array.isArray(couRaw)) {
      for (const item of couRaw) {
        const code = normalizeCountryId(item.actor_id || item.nom);
        const meta = COUNTRIES_META[code];
        if (!states[code] || item.actor_id === code.toLowerCase()) {
          states[code] = parseActorRaw(item, 'states', 'États Membres (Conseil)', scenarioId, directiveId, {
            id: code,
            icon: meta ? meta.flagUrl : './medias/images/flags/ue.jpg',
            badgeColor: '#d97706'
          });
        }
      }
    }

    const parties: Record<string, ActorSheet> = {};
    if (Array.isArray(parRaw)) {
      for (const item of parRaw) {
        const code = normalizePartyId(item.actor_id || item.nom);
        const meta = PARTIES_PROFILES[code];
        parties[code] = parseActorRaw(item, 'parties', 'Parlement Européen', scenarioId, directiveId, {
          id: code, icon: meta?.logoUrl, badgeColor: meta ? meta.couleur : '#2563eb'
        });
      }
    }

    const lobbies: Record<string, ActorSheet> = {};
    if (Array.isArray(lobRaw)) {
      for (const item of lobRaw) {
        const code = normalizeLobbyId(item.actor_id || item.nom);
        const meta = LOBBIES_PROFILES[code];
        lobbies[code] = parseActorRaw(item, 'lobbies', 'Société Civile & Lobbies', scenarioId, directiveId, {
          id: code, icon: meta?.logoUrl, badgeColor: meta ? meta.couleur : '#7c3aed'
        });
      }
    }

    const result: DirectiveActorSheets = { scenarioId, directiveId, commission, states, parties, lobbies };

    SHEETS_CACHE.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`Fallback de secours pour les fiches acteurs s${scenarioId}-d${directiveId}:`, error);
    const fallback = createFallbackDirectiveSheets(scenarioId, directiveId);
    SHEETS_CACHE.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Récupère une fiche acteur individuelle à partir de sa clé.
 */
export async function getSingleActorSheet(
  scenarioId: number,
  directiveId: number,
  category: 'commission' | 'states' | 'parties' | 'lobbies',
  actorKey: string
): Promise<ActorSheet | null> {
  const sheets = await loadActorSheetsForDirective(scenarioId, directiveId);
  if (category === 'commission') return sheets.commission;
  if (category === 'states') return sheets.states[actorKey] || null;
  if (category === 'parties') return sheets.parties[actorKey] || null;
  if (category === 'lobbies') return sheets.lobbies[actorKey] || null;
  return null;
}

/**
 * Parse un objet JSON brut en interface typée ActorSheet.
 */
function parseActorRaw(
  raw: any,
  category: 'commission' | 'states' | 'parties' | 'lobbies',
  categoryLabel: string,
  scenarioId: number,
  directiveId: number,
  extra: { id?: string; icon?: string; badgeColor?: string }
): ActorSheet {
  return {
    id: extra.id || raw.actor_id || category,
    category,
    categoryLabel,
    type: raw.type || categoryLabel,
    nom: raw.nom || 'Acteur Européen',
    roleEuropeen: raw.role_europeen || 'Acteur du processus législatif',
    enjeuxDirective: Array.isArray(raw.enjeux_directive) ? raw.enjeux_directive : [],
    impactsDirective: Array.isArray(raw.impacts_directive) ? raw.impacts_directive : [],
    strategie: raw.stratégie || raw.strategie || 'Défense des intérêts et recherche de compromis.',
    alliances: Array.isArray(raw.alliances) ? raw.alliances : [],
    oppositions: Array.isArray(raw.oppositions) ? raw.oppositions : [],
    arguments: Array.isArray(raw.éléments_d_argumentaire)
      ? raw.éléments_d_argumentaire
      : (Array.isArray(raw.elements_d_argumentaire) ? raw.elements_d_argumentaire : []),
    positionsAmendements: Array.isArray(raw.positions_amendements)
      ? raw.positions_amendements.map((p: any) => {
          const impact = Array.isArray(raw.impacts_amendements)
            ? raw.impacts_amendements.find((ia: any) => ia.id === p.amendement)
            : null;
          const desc = p.description || impact?.description || '';
          const cleanTitre = (p.titre && p.titre !== 'Sans titre' && String(p.titre).trim() !== '')
            ? String(p.titre).trim() : desc;
          return {
            amendement: String(p.amendement || ''),
            titre: cleanTitre,
            position: p.position || 'NEUTRE',
            justification: p.justification || '',
            priorite: p.priorite || 'moyenne',
            origine: p.origine || impact?.origine || '',
            description: desc || cleanTitre
          };
        })
      : [],
    notesInternes: raw.notes_internes || undefined,
    scenarioId,
    directiveId,
    icon: extra.icon,
    badgeColor: extra.badgeColor
  };
}
