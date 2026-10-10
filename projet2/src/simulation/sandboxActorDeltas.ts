import { COUNTRIES_META } from '../data/countries';
import { PARTIES_PROFILES } from '../data/parties';
import { LOBBIES_PROFILES } from '../data/lobbies';
import type { KPIDelta, ActorKPISummary, SandboxComparisonResult, SandboxScope } from './sandboxTypes';

/**
 * Extrait les variations de KPI et scores différentiels pour l'acteur ciblé (UE, Pays, Parti, Lobby)
 */
export function computeActorKPIDeltas(
  comparison: SandboxComparisonResult,
  scope: SandboxScope
): ActorKPISummary {
  if (scope.actorType === 'eu') {
    return {
      actorType: 'eu',
      actorKey: 'EU',
      actorName: 'Union Européenne (Globale)',
      actorSubtitle: 'Agrégation institutionnelle des 27 États et 720 eurodéputés',
      kpiDeltas: comparison.kpiDeltas,
      scoreLabel: 'Score Global UE',
      scoreBaseline: comparison.scoreBaseline,
      scoreAmended: comparison.scoreAmended,
      scoreDelta: comparison.scoreDelta
    };
  }

  if (scope.actorType === 'country') {
    return extractCountryDeltas(comparison, scope);
  }

  if (scope.actorType === 'party') {
    return extractPartyDeltas(comparison, scope);
  }

  return extractLobbyDeltas(comparison, scope);
}

function extractCountryDeltas(comparison: SandboxComparisonResult, scope: SandboxScope): ActorKPISummary {
  const cCode = scope.countryCode;
  const base = comparison.baselineResult.countries[cCode];
  const amd = comparison.amendedResult.countries[cCode];
  const meta = COUNTRIES_META[cCode];
  const isS1 = comparison.scenarioId === 1;
  const kpis: KPIDelta[] = [];

  if (isS1) {
    const basePib = base?.series?.croiss?.[9] ?? 0;
    const amdPib = amd?.series?.croiss?.[9] ?? 0;
    kpis.push({ key: 'croiss', label: 'Croissance PIB', unit: '%', baselineVal: basePib, amendedVal: amdPib, delta: amdPib - basePib, isPositiveForEU: amdPib >= basePib });

    const baseCo2 = base?.series?.co2?.[9] ?? 0;
    const amdCo2 = amd?.series?.co2?.[9] ?? 0;
    kpis.push({ key: 'co2', label: 'Émissions CO₂', unit: 't/hab', baselineVal: baseCo2, amendedVal: amdCo2, delta: amdCo2 - baseCo2, isPositiveForEU: amdCo2 <= baseCo2 });

    const baseGini = base?.series?.gini?.[9] ?? 0;
    const amdGini = amd?.series?.gini?.[9] ?? 0;
    kpis.push({ key: 'gini', label: 'Inégalités Gini', unit: '', baselineVal: baseGini, amendedVal: amdGini, delta: amdGini - baseGini, isPositiveForEU: amdGini <= baseGini });

    const baseVeb = base?.series?.veb?.[9] ?? 0;
    const amdVeb = amd?.series?.veb?.[9] ?? 0;
    kpis.push({ key: 'veb', label: 'Bien-être (VEB)', unit: 'pts', baselineVal: baseVeb, amendedVal: amdVeb, delta: amdVeb - baseVeb, isPositiveForEU: amdVeb >= baseVeb });
  } else {
    const baseNorm = base?.series?.normandie?.[9] ?? 0;
    const amdNorm = amd?.series?.normandie?.[9] ?? 0;
    kpis.push({ key: 'normandie', label: 'Indice Sécurité', unit: 'pts', baselineVal: baseNorm, amendedVal: amdNorm, delta: amdNorm - baseNorm, isPositiveForEU: amdNorm >= baseNorm });

    const baseVdem = base?.series?.vdem?.[9] ?? 0;
    const amdVdem = amd?.series?.vdem?.[9] ?? 0;
    kpis.push({ key: 'vdem', label: 'Démocratie V-Dem', unit: '', baselineVal: baseVdem, amendedVal: amdVdem, delta: amdVdem - baseVdem, isPositiveForEU: amdVdem >= baseVdem });

    const basePib = base?.series?.pib?.[9] ?? 0;
    const amdPib = amd?.series?.pib?.[9] ?? 0;
    kpis.push({ key: 'pib', label: 'Croissance PIB', unit: '%', baselineVal: basePib, amendedVal: amdPib, delta: amdPib - basePib, isPositiveForEU: amdPib >= basePib });

    const baseIdh = base?.series?.idh?.[9] ?? 0;
    const amdIdh = amd?.series?.idh?.[9] ?? 0;
    kpis.push({ key: 'idh', label: 'Indice IDH', unit: '', baselineVal: baseIdh, amendedVal: amdIdh, delta: amdIdh - baseIdh, isPositiveForEU: amdIdh >= baseIdh });
  }

  const baseGain = Math.round((base?.netGainVsReference ?? 0) * 100);
  const amdGain = Math.round((amd?.netGainVsReference ?? 0) * 100);
  kpis.push({ key: 'gain', label: 'Gain Net Relatif', unit: '%', baselineVal: baseGain, amendedVal: amdGain, delta: amdGain - baseGain, isPositiveForEU: amdGain >= baseGain });

  const baseScore = Math.round(base?.scoreSucces ?? 0);
  const amdScore = Math.round(amd?.scoreSucces ?? 0);

  return {
    actorType: 'country',
    actorKey: cCode,
    actorName: meta?.name || cCode,
    actorSubtitle: `${meta?.population ?? ''} M hab • Conseil de l'Union Européenne`,
    kpiDeltas: kpis,
    scoreLabel: `Score Succès (${meta?.name || cCode})`,
    scoreBaseline: baseScore,
    scoreAmended: amdScore,
    scoreDelta: amdScore - baseScore
  };
}

function extractPartyDeltas(comparison: SandboxComparisonResult, scope: SandboxScope): ActorKPISummary {
  const pCode = scope.partyCode;
  const base = comparison.baselineResult.parties[pCode];
  const amd = comparison.amendedResult.parties[pCode];
  const prof = PARTIES_PROFILES[pCode];
  const kpis: KPIDelta[] = [];

  const baseMeps = base?.mepsArr?.[9] ?? 0;
  const amdMeps = amd?.mepsArr?.[9] ?? 0;
  kpis.push({ key: 'meps', label: 'Sièges MEPs (2034)', unit: 'sièges', baselineVal: baseMeps, amendedVal: amdMeps, delta: amdMeps - baseMeps, isPositiveForEU: amdMeps >= baseMeps });

  const basePart = (baseMeps / 720) * 100;
  const amdPart = (amdMeps / 720) * 100;
  kpis.push({ key: 'part', label: 'Part Hémicycle', unit: '%', baselineVal: basePart, amendedVal: amdPart, delta: amdPart - basePart, isPositiveForEU: amdPart >= basePart });

  const baseSat = base?.satisfactionArr?.[9] ?? 0;
  const amdSat = amd?.satisfactionArr?.[9] ?? 0;
  kpis.push({ key: 'sat', label: 'Satisfaction Groupe', unit: '%', baselineVal: baseSat, amendedVal: amdSat, delta: amdSat - baseSat, isPositiveForEU: amdSat >= baseSat });

  const baseCom = base?.commissairesArr?.[9] ?? 0;
  const amdCom = amd?.commissairesArr?.[9] ?? 0;
  kpis.push({ key: 'com', label: 'Commissaires', unit: '', baselineVal: baseCom, amendedVal: amdCom, delta: amdCom - baseCom, isPositiveForEU: amdCom >= baseCom });

  const baseScore = Math.round(base?.scoreVictoire ?? 0);
  const amdScore = Math.round(amd?.scoreVictoire ?? 0);

  return {
    actorType: 'party',
    actorKey: pCode,
    actorName: prof?.nom || pCode,
    actorSubtitle: `Groupe Parlementaire • ${baseMeps} sièges initiaux sur 720`,
    kpiDeltas: kpis,
    scoreLabel: `Score Victoire (${pCode})`,
    scoreBaseline: baseScore,
    scoreAmended: amdScore,
    scoreDelta: amdScore - baseScore
  };
}

function extractLobbyDeltas(comparison: SandboxComparisonResult, scope: SandboxScope): ActorKPISummary {
  const lCode = scope.lobbyCode;
  const base = comparison.baselineResult.lobbies[lCode];
  const amd = comparison.amendedResult.lobbies[lCode];
  const prof = LOBBIES_PROFILES[lCode];
  const kpis: KPIDelta[] = [];

  const baseRep = base?.reputationArr?.[9] ?? 0;
  const amdRep = amd?.reputationArr?.[9] ?? 0;
  kpis.push({ key: 'rep', label: 'Réputation Publique', unit: '/100', baselineVal: baseRep, amendedVal: amdRep, delta: amdRep - baseRep, isPositiveForEU: amdRep >= baseRep });

  const baseEtats = base?.infEtatsArr?.[9] ?? 0;
  const amdEtats = amd?.infEtatsArr?.[9] ?? 0;
  kpis.push({ key: 'etats', label: 'Influence Conseil', unit: '/100', baselineVal: baseEtats, amendedVal: amdEtats, delta: amdEtats - baseEtats, isPositiveForEU: amdEtats >= baseEtats });

  const baseParl = base?.infParlementArr?.[9] ?? 0;
  const amdParl = amd?.infParlementArr?.[9] ?? 0;
  kpis.push({ key: 'parl', label: 'Influence Parlement', unit: '/100', baselineVal: baseParl, amendedVal: amdParl, delta: amdParl - baseParl, isPositiveForEU: amdParl >= baseParl });

  const baseComm = base?.infCommissionArr?.[9] ?? 0;
  const amdComm = amd?.infCommissionArr?.[9] ?? 0;
  kpis.push({ key: 'comm', label: 'Influence Commission', unit: '/100', baselineVal: baseComm, amendedVal: amdComm, delta: amdComm - baseComm, isPositiveForEU: amdComm >= baseComm });

  const baseScore = Math.round(base?.scoreDeReussite ?? 0);
  const amdScore = Math.round(amd?.scoreDeReussite ?? 0);

  return {
    actorType: 'lobby',
    actorKey: lCode,
    actorName: prof?.nom || lCode,
    actorSubtitle: `Groupe d'intérêt économique & sociétal`,
    kpiDeltas: kpis,
    scoreLabel: `Score Réussite (${lCode})`,
    scoreBaseline: baseScore,
    scoreAmended: amdScore,
    scoreDelta: amdScore - baseScore
  };
}
