import type { SandboxComparisonResult, SandboxScope } from '../../simulation/sandboxEngine';
import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';

export interface MetricDef {
  key: string;
  label: string;
  color: string;
  baseData: number[];
  amdData: number[];
}

export interface SandboxChartPayload {
  title: string;
  metrics: MetricDef[];
}

/**
 * Construit la liste des métriques comparatives et le titre de graphique selon le scope (UE, Pays, Parti, Lobby)
 */
export function buildSandboxChartPayload(
  comparison: SandboxComparisonResult,
  scope: SandboxScope
): SandboxChartPayload {
  const { baselineResult, amendedResult, scenarioId } = comparison;
  const isS1 = scenarioId === 1;

  if (scope.actorType === 'eu') {
    return {
      title: 'Trajectoire Globale UE (2025-2034)',
      metrics: isS1 ? buildS1EUMetrics(baselineResult, amendedResult) : buildS2EUMetrics(baselineResult, amendedResult)
    };
  }

  if (scope.actorType === 'country') {
    const cMeta = COUNTRIES_META[scope.countryCode];
    const baseC = baselineResult.countries[scope.countryCode];
    const amdC = amendedResult.countries[scope.countryCode];
    return {
      title: `Trajectoire comparative : ${cMeta?.name || scope.countryCode} (Conseil)`,
      metrics: isS1 ? buildS1CountryMetrics(baseC, amdC) : buildS2CountryMetrics(baseC, amdC)
    };
  }

  if (scope.actorType === 'party') {
    const pProf = PARTIES_PROFILES[scope.partyCode];
    const baseP = baselineResult.parties[scope.partyCode];
    const amdP = amendedResult.parties[scope.partyCode];
    return {
      title: `Équilibres comparatifs : ${pProf?.nom || scope.partyCode} (Parlement)`,
      metrics: [
        { key: 'meps', label: 'Sièges au Parlement (MEPs)', color: pProf?.couleur || '#2563eb', baseData: baseP?.mepsArr || [], amdData: amdP?.mepsArr || [] },
        { key: 'sat', label: 'Satisfaction Députés (%)', color: '#10b981', baseData: baseP?.satisfactionArr || [], amdData: amdP?.satisfactionArr || [] }
      ]
    };
  }

  // Lobby
  const lProf = LOBBIES_PROFILES[scope.lobbyCode];
  const baseL = baselineResult.lobbies[scope.lobbyCode];
  const amdL = amendedResult.lobbies[scope.lobbyCode];
  return {
    title: `Dynamique d'influence : ${lProf?.nom || scope.lobbyCode} (Société Civile)`,
    metrics: [
      { key: 'rep', label: 'Réputation Publique (/100)', color: '#2563eb', baseData: baseL?.reputationArr || [], amdData: amdL?.reputationArr || [] },
      { key: 'etats', label: 'Influence Conseil (/100)', color: '#d97706', baseData: baseL?.infEtatsArr || [], amdData: amdL?.infEtatsArr || [] },
      { key: 'parl', label: 'Influence Parlement (/100)', color: '#7c3aed', baseData: baseL?.infParlementArr || [], amdData: amdL?.infParlementArr || [] },
      { key: 'comm', label: 'Influence Commission (/100)', color: '#059669', baseData: baseL?.infCommissionArr || [], amdData: amdL?.infCommissionArr || [] }
    ]
  };
}

function buildS1EUMetrics(base: any, amd: any): MetricDef[] {
  return [
    { key: 'croiss', label: 'Croissance PIB (%)', color: '#2563eb', baseData: base.euSeries.croiss || base.euSeries.pib || [], amdData: amd.euSeries.croiss || amd.euSeries.pib || [] },
    { key: 'gini', label: 'Inégalités Gini (×10)', color: '#eab308', baseData: (base.euSeries.gini || []).map((v: number) => v * 10), amdData: (amd.euSeries.gini || []).map((v: number) => v * 10) },
    { key: 'co2', label: 'Émissions CO₂ (t/hab)', color: '#ef4444', baseData: base.euSeries.co2 || [], amdData: amd.euSeries.co2 || [] },
    { key: 'veb', label: 'Bien-être VEB (/10)', color: '#10b981', baseData: (base.euSeries.veb || []).map((v: number) => v / 10), amdData: (amd.euSeries.veb || []).map((v: number) => v / 10) }
  ];
}

function buildS2EUMetrics(base: any, amd: any): MetricDef[] {
  return [
    { key: 'normandie', label: 'Indice Sécurité (/10)', color: '#0284c7', baseData: (base.euSeries.normandie || []).map((v: number) => v / 10), amdData: (amd.euSeries.normandie || []).map((v: number) => v / 10) },
    { key: 'vdem', label: 'Démocratie V-Dem (×10)', color: '#8b5cf6', baseData: (base.euSeries.vdem || []).map((v: number) => v * 10), amdData: (amd.euSeries.vdem || []).map((v: number) => v * 10) },
    { key: 'pib', label: 'Croissance PIB (%)', color: '#2563eb', baseData: base.euSeries.pib || [], amdData: amd.euSeries.pib || [] },
    { key: 'idh', label: 'Indice IDH (×10)', color: '#10b981', baseData: (base.euSeries.idh || []).map((v: number) => v * 10), amdData: (amd.euSeries.idh || []).map((v: number) => v * 10) }
  ];
}

function buildS1CountryMetrics(baseC: any, amdC: any): MetricDef[] {
  return [
    { key: 'croiss', label: 'Croissance PIB (%)', color: '#2563eb', baseData: baseC?.series?.croiss || [], amdData: amdC?.series?.croiss || [] },
    { key: 'gini', label: 'Inégalités Gini (×10)', color: '#eab308', baseData: (baseC?.series?.gini || []).map((v: number) => v * 10), amdData: (amdC?.series?.gini || []).map((v: number) => v * 10) },
    { key: 'co2', label: 'Émissions CO₂ (t/hab)', color: '#ef4444', baseData: baseC?.series?.co2 || [], amdData: amdC?.series?.co2 || [] },
    { key: 'veb', label: 'Bien-être VEB (/10)', color: '#10b981', baseData: (baseC?.series?.veb || []).map((v: number) => v / 10), amdData: (amdC?.series?.veb || []).map((v: number) => v / 10) }
  ];
}

function buildS2CountryMetrics(baseC: any, amdC: any): MetricDef[] {
  return [
    { key: 'normandie', label: 'Indice Sécurité (/10)', color: '#0284c7', baseData: (baseC?.series?.normandie || []).map((v: number) => v / 10), amdData: (amdC?.series?.normandie || []).map((v: number) => v / 10) },
    { key: 'vdem', label: 'Démocratie V-Dem (×10)', color: '#8b5cf6', baseData: (baseC?.series?.vdem || []).map((v: number) => v * 10), amdData: (amdC?.series?.vdem || []).map((v: number) => v * 10) },
    { key: 'pib', label: 'Croissance PIB (%)', color: '#2563eb', baseData: baseC?.series?.pib || [], amdData: amdC?.series?.pib || [] },
    { key: 'idh', label: 'Indice IDH (×10)', color: '#10b981', baseData: (baseC?.series?.idh || []).map((v: number) => v * 10), amdData: (amdC?.series?.idh || []).map((v: number) => v * 10) }
  ];
}
