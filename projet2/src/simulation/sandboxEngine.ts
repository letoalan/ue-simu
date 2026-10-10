import type { Directive, ScenarioId } from '../domain/types';
import { runSimulation } from './engine';
import type {
  KPIDelta,
  SandboxComparisonResult
} from './sandboxTypes';

export * from './sandboxTypes';
export { computeActorKPIDeltas } from './sandboxActorDeltas';

/**
 * Calcule la comparaison différentielle entre la proposition initiale (baseline)
 * et la proposition avec amendements (sandbox) sur les 10 ans de simulation (2025-2034).
 */
export function computeSandboxComparison(
  directive: Directive,
  selectedAmendments: Set<string>,
  scenarioId: ScenarioId,
  seed: number = 42
): SandboxComparisonResult {
  // 1. Inputs de référence (statistiques de départ sans aucun amendement)
  const baselineInputs: Record<string, number> = { ...(directive.statistiques_depart || {}) };

  // 2. Inputs amendés (application séquentielle des impacts des amendements cochés)
  const amendedInputs: Record<string, number> = { ...baselineInputs };
  if (directive.amendements) {
    for (const amd of directive.amendements) {
      if (selectedAmendments.has(amd.id) && amd.impact) {
        for (const [key, val] of Object.entries(amd.impact)) {
          amendedInputs[key] = val;
        }
      }
    }
  }

  // 3. Exécution des deux simulations avec la même graine (ceteris paribus)
  const baselineResult = runSimulation({
    scenarioId,
    seed,
    inputs: baselineInputs
  });

  const amendedResult = runSimulation({
    scenarioId,
    seed,
    inputs: amendedInputs
  });

  // 4. Calcul des Deltas KPI UE à horizon 2034 (dernière année t = 9)
  const isS1 = scenarioId === 1;
  const kpiDeltas: KPIDelta[] = isS1
    ? computeS1EUKPIDeltas(baselineResult, amendedResult)
    : computeS2EUKPIDeltas(baselineResult, amendedResult);

  const scoreBaseline = Math.round(baselineResult.euScoreSucces);
  const scoreAmended = Math.round(amendedResult.euScoreSucces);

  return {
    scenarioId,
    directiveId: directive.id,
    directiveName: directive.nom,
    selectedAmendmentsCount: selectedAmendments.size,
    baselineInputs,
    amendedInputs,
    baselineResult,
    amendedResult,
    kpiDeltas,
    scoreBaseline,
    scoreAmended,
    scoreDelta: scoreAmended - scoreBaseline
  };
}

function computeS1EUKPIDeltas(baselineResult: any, amendedResult: any): KPIDelta[] {
  const basePib = baselineResult.euSeries.croiss?.[9] ?? baselineResult.euSeries.pib?.[9] ?? 0;
  const amdPib = amendedResult.euSeries.croiss?.[9] ?? amendedResult.euSeries.pib?.[9] ?? 0;
  const baseGini = baselineResult.euSeries.gini?.[9] ?? 0;
  const amdGini = amendedResult.euSeries.gini?.[9] ?? 0;
  const baseCo2 = baselineResult.euSeries.co2?.[9] ?? 0;
  const amdCo2 = amendedResult.euSeries.co2?.[9] ?? 0;
  const baseVeb = baselineResult.euSeries.veb?.[9] ?? 0;
  const amdVeb = amendedResult.euSeries.veb?.[9] ?? 0;

  return [
    { key: 'pib', label: 'Croissance PIB', unit: '%', baselineVal: basePib, amendedVal: amdPib, delta: amdPib - basePib, isPositiveForEU: amdPib >= basePib },
    { key: 'gini', label: 'Inégalités Gini', unit: '', baselineVal: baseGini, amendedVal: amdGini, delta: amdGini - baseGini, isPositiveForEU: amdGini <= baseGini },
    { key: 'co2', label: 'Émissions CO₂', unit: 't/hab', baselineVal: baseCo2, amendedVal: amdCo2, delta: amdCo2 - baseCo2, isPositiveForEU: amdCo2 <= baseCo2 },
    { key: 'veb', label: 'Bien-être (VEB)', unit: 'pts', baselineVal: baseVeb, amendedVal: amdVeb, delta: amdVeb - baseVeb, isPositiveForEU: amdVeb >= baseVeb }
  ];
}

function computeS2EUKPIDeltas(baselineResult: any, amendedResult: any): KPIDelta[] {
  const baseNorm = baselineResult.euSeries.normandie?.[9] ?? 0;
  const amdNorm = amendedResult.euSeries.normandie?.[9] ?? 0;
  const baseVdem = baselineResult.euSeries.vdem?.[9] ?? 0;
  const amdVdem = amendedResult.euSeries.vdem?.[9] ?? 0;
  const basePib = baselineResult.euSeries.pib?.[9] ?? 0;
  const amdPib = amendedResult.euSeries.pib?.[9] ?? 0;
  const baseIdh = baselineResult.euSeries.idh?.[9] ?? 0;
  const amdIdh = amendedResult.euSeries.idh?.[9] ?? 0;

  return [
    { key: 'normandie', label: 'Indice Sécurité', unit: 'pts', baselineVal: baseNorm, amendedVal: amdNorm, delta: amdNorm - baseNorm, isPositiveForEU: amdNorm >= baseNorm },
    { key: 'vdem', label: 'Démocratie V-Dem', unit: '', baselineVal: baseVdem, amendedVal: amdVdem, delta: amdVdem - baseVdem, isPositiveForEU: amdVdem >= baseVdem },
    { key: 'pib', label: 'Croissance PIB', unit: '%', baselineVal: basePib, amendedVal: amdPib, delta: amdPib - basePib, isPositiveForEU: amdPib >= basePib },
    { key: 'idh', label: 'Indice IDH', unit: '', baselineVal: baseIdh, amendedVal: amdIdh, delta: amdIdh - baseIdh, isPositiveForEU: amdIdh >= baseIdh }
  ];
}
