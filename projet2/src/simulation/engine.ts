import type {
  CountryCode,
  CountryResult,
  SimulationInputs,
  SimulationResult
} from '../domain/types';
import { COUNTRIES_PROFILES, getCountryDemographicWeights } from '../data/countries';
import { PARTIES_PROFILES } from '../data/parties';
import { LOBBIES_PROFILES } from '../data/lobbies';
import { normalizeValue } from '../domain/indicators';
import { PRNG } from './prng';
import { simulateParties } from './partiesEngine';
import { calculateParliamentDistribution } from './parliamentEngine';
import { simulateLobbies } from './lobbiesEngine';
import { simulateCountryTrajectories } from './countryTrajectories';
import { defaultImplementationProvider } from './realizationContract';
import { computeSuccessScore } from './successScores';
import { buildYearlyStates, SIMULATION_YEARS } from './yearlyStates';

export { SIMULATION_YEARS };

/**
 * Moteur unifié de simulation (Phase A).
 * Fonction pure sans effets de bord DOM, reproductible, déterministe et totalement couplée.
 */
export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const seed = inputs.seed ?? 42;
  const prng = new PRNG(seed);
  const scenarioId = inputs.scenarioId;
  const weights = getCountryDemographicWeights();
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
  const provider = inputs.implementationProvider ?? defaultImplementationProvider;

  // 1. Simulation des trajectoires des 6 pays sur 10 ans
  const countryResults = simulateCountryTrajectories(scenarioId, inputs.inputs || {}, prng, codes, provider);

  // 2. Agrégation démographique européenne stricte
  const euSeries: Record<string, number[]> = {};
  const euSatisfaction: number[] = [];

  const indicatorKeys = scenarioId === 1
    ? ['croiss', 'gini', 'co2', 'veb']
    : ['normandie', 'vdem', 'pib', 'idh'];

  for (const key of indicatorKeys) {
    euSeries[key] = [];
    for (let t = 0; t < 10; t++) {
      let sum = 0;
      for (const c of codes) {
        sum += (countryResults[c].values[key][t] ?? 0) * weights[c];
      }
      euSeries[key].push(sum);
    }
  }

  // 3. Satisfaction UE annuelle
  for (let t = 0; t < 10; t++) {
    let satUE = 0;
    if (scenarioId === 1) {
      const sPib = normalizeValue(euSeries.croiss[t], 0, 4);
      const sGini = 1 - normalizeValue(euSeries.gini[t], 0.2, 0.6);
      const sCo2 = 1 - normalizeValue(euSeries.co2[t], 2, 10);
      const sVeb = normalizeValue(euSeries.veb[t], 0, 100);
      satUE = (sPib + sGini + sCo2 + sVeb) / 4;
    } else {
      const sNorm = normalizeValue(euSeries.normandie[t], 0, 100);
      const sVdem = normalizeValue(euSeries.vdem[t], 0, 1);
      const sPib = normalizeValue(euSeries.pib[t], -2, 4);
      const sIdh = normalizeValue(euSeries.idh[t], 0, 1);
      satUE = (sNorm + sVdem + sPib + sIdh) / 4;
    }
    euSatisfaction.push(satUE);
  }

  // 4. Score de réussite global UE (borné dans [0, 100])
  const euInit = euSatisfaction[0];
  const euFin = euSatisfaction[9];
  const euScoreSucces = computeSuccessScore(euInit, euFin, false); // Calcul historique sans écrasement négatif non justifié

  // 5. Calcul contrefactuel de référence (statu quo avec même graine) si demandé
  let euNetGainVsReference = 0;
  let baselineFinalSat = euFin;
  const countryBaselineFinal: Record<CountryCode, number> = {} as any;

  if (!inputs.skipBaseline) {
    const baseline = runSimulation({
      scenarioId,
      inputs: {},
      seed,
      implementationProvider: provider,
      skipBaseline: true
    });
    baselineFinalSat = baseline.euSatisfaction[9];
    euNetGainVsReference = Math.round((euFin - baselineFinalSat) * 1000) / 1000;
    for (const c of codes) {
      countryBaselineFinal[c] = baseline.countries[c].satisfaction[9];
    }
  }

  // 6. Dictionnaire statsUE pour partis et lobbies
  const statsUEForSubs = {
    pibArr: scenarioId === 1 ? euSeries.croiss : euSeries.pib,
    giniArr: scenarioId === 1 ? euSeries.gini : Array(10).fill(0.30),
    co2Arr: scenarioId === 1 ? euSeries.co2 : Array(10).fill(4.0),
    vebArr: scenarioId === 1 ? euSeries.veb : Array(10).fill(80.0),
    stabArr: scenarioId === 2 ? euSeries.normandie : Array(10).fill(80.0),
    demArr: scenarioId === 2 ? euSeries.vdem : Array(10).fill(0.85),
    idhArr: scenarioId === 2 ? euSeries.idh : Array(10).fill(0.92)
  };

  const partiesResults = simulateParties(statsUEForSubs, PARTIES_PROFILES, scenarioId);
  const lobbiesResults = simulateLobbies(statsUEForSubs, LOBBIES_PROFILES, scenarioId, prng);
  const parliament = calculateParliamentDistribution(partiesResults, statsUEForSubs, scenarioId);

  // 7. Mise en forme finale des résultats des pays avec gain contrefactuel
  const finalCountries = {} as Record<CountryCode, CountryResult>;
  for (const c of codes) {
    const satArr = countryResults[c].satisfaction;
    const initSat = satArr[0];
    const finSat = satArr[9];
    const ecart = finSat - initSat;
    const scoreSucces = computeSuccessScore(initSat, finSat, false);
    const netGain = countryBaselineFinal[c] !== undefined
      ? Math.round((finSat - countryBaselineFinal[c]) * 1000) / 1000
      : 0;

    finalCountries[c] = {
      code: c,
      name: COUNTRIES_PROFILES[c].name,
      series: countryResults[c].values,
      satisfaction: satArr,
      scoreSucces,
      ecartProgression: ecart,
      netGainVsReference: netGain
    };
  }

  // 8. États annuels détaillés (YearState[])
  const yearlyStates = buildYearlyStates(
    codes,
    indicatorKeys,
    countryResults,
    partiesResults,
    lobbiesResults,
    euSeries,
    euSatisfaction
  );

  return {
    scenarioId,
    years: SIMULATION_YEARS,
    yearlyStates,
    euSeries,
    euSatisfaction,
    euScoreSucces,
    countries: finalCountries,
    parties: partiesResults,
    lobbies: lobbiesResults,
    parliament,
    calculatedAt: Date.now(),
    seed,
    euNetGainVsReference,
    baselineEUFinalSatisfaction: baselineFinalSat
  };
}
