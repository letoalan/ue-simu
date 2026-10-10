import { describe, it, expect } from 'vitest';
import { runSimulation, SIMULATION_YEARS } from '../src/simulation/engine';
import { COUNTRIES_META, COUNTRIES_PROFILES, getCountryDemographicWeights } from '../src/data/countries';
import { PARTIES_PROFILES } from '../src/data/parties';
import { LOBBIES_PROFILES } from '../src/data/lobbies';
import type { CountryCode } from '../src/domain/types';

/**
 * Suite de tests : Agrégation Démographique, Temporalité et Intégrité d'État
 * Couvre : AGG-01, AGG-02, TIME-01, STATE-01
 */
describe('Agrégation, Temporalité et Intégrité d\'État (P1)', () => {
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];

  describe('AGG-01 — Couplage exact sur tous les indicateurs et toutes les années', () => {
    it('[Invariant contractuel] vérifie les poids démographiques stricts (somme = 1, poids > 0)', () => {
      const weights = getCountryDemographicWeights();
      let sumWeights = 0;

      for (const c of codes) {
        expect(weights[c]).toBeGreaterThan(0);
        sumWeights += weights[c];
      }
      expect(sumWeights).toBeCloseTo(1.0, 10);
    });

    it('[Invariant contractuel] vérifie que chaque série UE est la moyenne pondérée exacte des 6 pays (S1 & S2)', () => {
      const weights = getCountryDemographicWeights();

      // Scénario 1
      const resS1 = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.4, gini_eu: 0.28, co2_eu: 5.5, veb_eu: 85.0 },
        seed: 777
      });

      for (const ind of ['croiss', 'gini', 'co2', 'veb'] as const) {
        for (let t = 0; t < 10; t++) {
          let independentSum = 0;
          let minVal = Infinity;
          let maxVal = -Infinity;

          for (const c of codes) {
            const val = resS1.countries[c].series[ind][t];
            independentSum += val * weights[c];
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
          }

          const euVal = resS1.euSeries[ind][t];
          expect(euVal).toBeCloseTo(independentSum, 8);
          // Borne d'agrégation : val_min <= moyenne_pondérée <= val_max
          expect(euVal).toBeGreaterThanOrEqual(minVal - 1e-6);
          expect(euVal).toBeLessThanOrEqual(maxVal + 1e-6);
        }
      }

      // Scénario 2
      const resS2 = runSimulation({
        scenarioId: 2,
        inputs: { normandie_eu: 80.0, vdem_eu: 0.85, pib_growth_eu: 1.5, idh_eu: 0.90 },
        seed: 777
      });

      for (const ind of ['normandie', 'vdem', 'pib', 'idh'] as const) {
        for (let t = 0; t < 10; t++) {
          let independentSum = 0;
          let minVal = Infinity;
          let maxVal = -Infinity;

          for (const c of codes) {
            const val = resS2.countries[c].series[ind][t];
            independentSum += val * weights[c];
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
          }

          const euVal = resS2.euSeries[ind][t];
          expect(euVal).toBeCloseTo(independentSum, 8);
          expect(euVal).toBeGreaterThanOrEqual(minVal - 1e-6);
          expect(euVal).toBeLessThanOrEqual(maxVal + 1e-6);
        }
      }
    });
  });

  describe('AGG-02 — Périmètre démographique et validité de l\'interprétation', () => {
    it('[Diagnostic exploratoire] documente la représentativité démographique de l\'échantillon (59% de l\'UE)', () => {
      const samplePop = Object.values(COUNTRIES_META).reduce((sum, c) => sum + c.population, 0);
      expect(samplePop).toBeCloseTo(266.0, 1);

      // Population réelle de l'UE à 27 (Eurostat ~448 millions)
      const ratioUE = samplePop / 448.0;
      expect(ratioUE).toBeGreaterThan(0.55);
      expect(ratioUE).toBeLessThan(0.65);
      // Les 21 autres États membres ne sont pas représentés dans l'agrégat.
    });
  });

  describe('TIME-01 — Année initiale et nombre de transitions dynamiques', () => {
    it('[Caractérisation & Invariant] prouve que l\'an 0 (2025) intègre l\'impulsion et qu\'il y a 9 transitions', () => {
      const targetPib = 3.5;
      const targetGini = 0.25;

      const res = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: targetPib, gini_eu: targetGini, co2_eu: 6.0, veb_eu: 80.0 },
        seed: 12
      });

      // Oracle indépendant pour l'année 0 d'Allemagne (DE) :
      // init.croiss = 1.5, targetPib = 3.5 => impulsion = 1.5 + 0.4 * (3.5 - 1.5) = 1.5 + 0.8 = 2.3
      // init.gini = 0.29, targetGini = 0.25 => impulsion = 0.29 + 0.3 * (0.25 - 0.29) = 0.29 - 0.012 = 0.278
      const expectedCroissDE_Y0 = 1.5 + 0.4 * (targetPib - 1.5);
      const expectedGiniDE_Y0 = 0.29 + 0.3 * (targetGini - 0.29);

      expect(res.countries.DE.series.croiss[0]).toBeCloseTo(expectedCroissDE_Y0, 6);
      expect(res.countries.DE.series.gini[0]).toBeCloseTo(expectedGiniDE_Y0, 6);

      // Vérifie qu'il y a 10 années affichées et 9 transitions dynamiques
      expect(res.years.length).toBe(10);
      expect(SIMULATION_YEARS[0]).toBe(2025);
      expect(SIMULATION_YEARS[9]).toBe(2034);
    });
  });

  describe('STATE-01 — Immuabilité et intégrité des structures en mémoire', () => {
    it('[Invariant contractuel] garantit l\'absence totale de mutation des profils de référence et des inputs', () => {
      const snapCountries = JSON.stringify(COUNTRIES_PROFILES);
      const snapParties = JSON.stringify(PARTIES_PROFILES);
      const snapLobbies = JSON.stringify(LOBBIES_PROFILES);

      const inputObj = {
        scenarioId: 1 as const,
        inputs: { pib_eu: 4.0, gini_eu: 0.60, co2_eu: 10.0, veb_eu: 0.0 },
        seed: 99
      };
      const inputSnap = JSON.stringify(inputObj);

      // Exécute plusieurs simulations
      runSimulation(inputObj);
      runSimulation({ scenarioId: 2, inputs: { normandie_eu: 100, vdem_eu: 1, pib_growth_eu: 4, idh_eu: 1 }, seed: 1 });

      // Vérifie que les profils globaux et l'objet d'entrée n'ont subi aucune modification
      expect(JSON.stringify(COUNTRIES_PROFILES)).toBe(snapCountries);
      expect(JSON.stringify(PARTIES_PROFILES)).toBe(snapParties);
      expect(JSON.stringify(LOBBIES_PROFILES)).toBe(snapLobbies);
      expect(JSON.stringify(inputObj)).toBe(inputSnap);
    });
  });
});
