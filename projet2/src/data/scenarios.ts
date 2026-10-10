import type { ScenarioDefinition, ScenarioId, Directive } from '../domain/types';

/**
 * Cache mémoire pour les scénarios chargés.
 */
const SCENARIOS_CACHE: Map<ScenarioId, ScenarioDefinition> = new Map();

/**
 * Charge un scénario depuis les fichiers statiques JSON (compatible GitHub Pages).
 */
export async function loadScenario(scenarioId: ScenarioId): Promise<ScenarioDefinition> {
  if (SCENARIOS_CACHE.has(scenarioId)) {
    return SCENARIOS_CACHE.get(scenarioId)!;
  }

  const url = `./json/scenario${scenarioId}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} chargement ${url}`);
    }
    const rawData = await response.json();
    const validated = validateScenarioDefinition(rawData, scenarioId);
    SCENARIOS_CACHE.set(scenarioId, validated);
    return validated;
  } catch (error) {
    console.error(`Erreur lors du chargement du scénario ${scenarioId} depuis ${url}:`, error);
    // Fournit un fallback minimal pour tests ou erreurs réseau
    const fallback = createFallbackScenario(scenarioId);
    SCENARIOS_CACHE.set(scenarioId, fallback);
    return fallback;
  }
}

/**
 * Charge les fiches pédagogiques détaillées d'une directive (enjeux et stratégie des acteurs).
 */
export async function loadDirectiveDetails(scenarioId: ScenarioId, directiveId: number): Promise<any | null> {
  const url = `./json/directives/enjeux/s${scenarioId}/s${scenarioId}d${directiveId}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Valide la structure du JSON du scénario.
 */
function validateScenarioDefinition(data: any, expectedId: ScenarioId): ScenarioDefinition {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de scénario invalides (non-objet)');
  }

  const directives: Directive[] = (Array.isArray(data.directive) ? data.directive : []).map((d: any) => ({
    id: Number(d.id) || 1,
    nom: String(d.nom || `Directive ${d.id}`),
    orientation: String(d.orientation || ''),
    proposition: String(d.proposition || ''),
    description: String(d.description || ''),
    declaration_intention: String(d.declaration_intention || ''),
    statistiques_depart: d.statistiques_depart || {},
    amendements: Array.isArray(d.amendements) ? d.amendements.map((a: any) => ({
      id: String(a.id || ''),
      type: a.type || 'parlement',
      origine: String(a.origine || ''),
      description: String(a.description || ''),
      impact: a.impact || {}
    })) : []
  }));

  return {
    scenario: expectedId,
    titre: expectedId === 1 ? 'Développement Durable & Transition Écologique' : 'Stabilité Géopolitique & Démocratie',
    description: expectedId === 1
      ? 'Équilibrez transition énergétique, réduction des émissions de CO2 et justice sociale.'
      : 'Renforcez la sécurité de l’Union, l’État de droit et la résilience stratégique.',
    directive: directives
  };
}

/**
 * Fallback de secours en cas d'absence de serveur web (par exemple tests locaux).
 */
function createFallbackScenario(scenarioId: ScenarioId): ScenarioDefinition {
  if (scenarioId === 1) {
    return {
      scenario: 1,
      titre: 'Développement Durable & Transition Écologique',
      description: 'Scénario axé sur la décarbonation, la biodiversité et la réduction des inégalités.',
      directive: [
        {
          id: 1,
          nom: 'Pacte vert innovant',
          orientation: 'Investir 2% du PIB dans les énergies renouvelables',
          proposition: 'Financement massif de projets solaires/éoliens et R&D hydrogène',
          description: 'Réduire les émissions de CO₂ de 50% d’ici 2035',
          declaration_intention: 'Engagement pour un mix énergétique durable et équitable.',
          statistiques_depart: { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 8.0, veb_eu: 80 },
          amendements: [
            {
              id: '1-1A',
              type: 'parlement',
              origine: 'Verts/ALE',
              description: 'Augmenter la part du PIB investi à 2,5%',
              impact: { pib_eu: 2.5, gini_eu: 0.29, co2_eu: 6.0, veb_eu: 85 }
            },
            {
              id: '1-1B',
              type: 'conseil',
              origine: 'Hongrie',
              description: 'Réduire l’investissement à 1,5% du PIB',
              impact: { pib_eu: 1.5, gini_eu: 0.32, co2_eu: 9.0, veb_eu: 75 }
            }
          ]
        }
      ]
    };
  }

  return {
    scenario: 2,
    titre: 'Stabilité Géopolitique & Démocratie',
    description: 'Scénario axé sur la sécurité commune, la défense et les droits démocratiques.',
    directive: [
      {
        id: 1,
        nom: 'Initiative sécurité énergétique',
        orientation: 'Stock stratégique de gaz (90 jours)',
        proposition: 'Diversification des approvisionnements hors zones de crise',
        description: 'Réduire la vulnérabilité énergétique de l’Union européenne',
        declaration_intention: 'Garantir la résilience et la continuité énergétique européenne.',
        statistiques_depart: { normandie_eu: 85, vdem_eu: 0.86, pib_growth_eu: 1.6, idh_eu: 0.93 },
        amendements: [
          {
            id: '2-1A',
            type: 'parlement',
            origine: 'PPE',
            description: 'Porter le stock stratégique à 120 jours',
            impact: { normandie_eu: 88, vdem_eu: 0.87, pib_growth_eu: 1.5, idh_eu: 0.94 }
          }
        ]
      }
    ]
  };
}
