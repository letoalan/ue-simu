import type { CostAssessment } from '../domain/financeTypes';

export async function fetchJsonSafely<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function getDefaultCostAssessment(scenarioId: number, directiveId: number): CostAssessment {
  const baseActions = [
    {
      id: `act-${scenarioId}-${directiveId}-1`,
      nom: "Infrastructures clés & modernisation",
      categorie: 'infrastructure' as const,
      coutUnitaire: 0.6,
      coutFixe: 1.2,
      quantiteParPays: { DE: 14, FR: 12, IT: 10, PL: 9, SE: 5, HU: 4 },
      coutTotalParPays: { DE: 9.6, FR: 8.4, IT: 7.2, PL: 6.6, SE: 4.2, HU: 3.6 },
      coutTotalGlobal: 39.6,
      source: "Évaluation préliminaire européenne de référence"
    },
    {
      id: `act-${scenarioId}-${directiveId}-2`,
      nom: "R&D, innovation technologique & pilotes",
      categorie: 'r_d' as const,
      coutUnitaire: 0.8,
      coutFixe: 1.5,
      quantiteParPays: { DE: 16, FR: 14, IT: 11, PL: 10, SE: 6, HU: 5 },
      coutTotalParPays: { DE: 14.3, FR: 12.7, IT: 10.3, PL: 9.5, SE: 6.3, HU: 5.5 },
      coutTotalGlobal: 58.6,
      source: "Évaluation préliminaire européenne de référence"
    },
    {
      id: `act-${scenarioId}-${directiveId}-3`,
      nom: "Équipements de déploiement et réseaux",
      categorie: 'equipement' as const,
      coutUnitaire: 1.1,
      coutFixe: 2.0,
      quantiteParPays: { DE: 18, FR: 16, IT: 12, PL: 11, SE: 7, HU: 6 },
      coutTotalParPays: { DE: 21.8, FR: 19.6, IT: 15.2, PL: 14.1, SE: 9.7, HU: 8.6 },
      coutTotalGlobal: 89.0,
      source: "Évaluation préliminaire européenne de référence"
    },
    {
      id: `act-${scenarioId}-${directiveId}-4`,
      nom: "Accompagnement, formation & compétences",
      categorie: 'accompagnement' as const,
      coutUnitaire: 1.4,
      coutFixe: 2.5,
      quantiteParPays: { DE: 20, FR: 18, IT: 13, PL: 12, SE: 8, HU: 7 },
      coutTotalParPays: { DE: 30.5, FR: 27.7, IT: 20.7, PL: 19.3, SE: 13.7, HU: 12.3 },
      coutTotalGlobal: 124.2,
      source: "Évaluation préliminaire européenne de référence"
    }
  ];

  const moyensNationauxRef = { DE: 22, FR: 18, IT: 14, PL: 9, SE: 7, HU: 5 };
  const besoinRestant = {
    DE: Math.max(0, Math.round((76.2 - 22) * 10) / 10),
    FR: Math.max(0, Math.round((68.4 - 18) * 10) / 10),
    IT: Math.max(0, Math.round((53.4 - 14) * 10) / 10),
    PL: Math.max(0, Math.round((49.5 - 9) * 10) / 10),
    SE: Math.max(0, Math.round((33.9 - 7) * 10) / 10),
    HU: Math.max(0, Math.round((30.0 - 5) * 10) / 10)
  };
  const besoinRestantTotal = Object.values(besoinRestant).reduce((a, b) => a + b, 0);

  return {
    directiveId,
    scenarioId: scenarioId as any,
    actions: baseActions,
    coutTotalGlobal: 311.4,
    moyensNationauxRef,
    besoinRestant,
    besoinRestantTotal,
    propositionReference: {
      enveloppeProposee: Math.round(besoinRestantTotal * 0.65),
      reservePourcentage: 0.05,
      tauxCofinancementDefaut: 0.25,
      cleContributionDefaut: 'pib',
      cleAllocationDefaut: 'needs'
    },
    bornes: {
      enveloppeMin: Math.round(besoinRestantTotal * 0.30),
      enveloppeMax: Math.round(besoinRestantTotal * 1.05),
      cofinancementMin: 0.15,
      cofinancementMax: 0.40
    }
  };
}

export async function loadCostAssessment(scenarioId: number, directiveId: number): Promise<CostAssessment> {
  const fallback = getDefaultCostAssessment(scenarioId, directiveId);
  const url = `./json/finance/s${scenarioId}/d${directiveId}/evaluation.json`;
  return fetchJsonSafely<CostAssessment>(url, fallback);
}

export async function loadFinancialCommission(scenarioId: number, directiveId: number): Promise<any> {
  const url = `./json/finance/s${scenarioId}/d${directiveId}/commission.json`;
  return fetchJsonSafely(url, {
    propositionInitiale: "Enveloppe de référence de 150 Mds € garantissant 65% de couverture.",
    justification: "Compromis solidaire et discipliné."
  });
}
