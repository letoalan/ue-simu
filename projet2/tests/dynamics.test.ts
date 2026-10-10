import { describe, it, expect } from 'vitest';
import { runSimulation } from '../src/simulation/engine';
import * as fs from 'fs';

/**
 * Suite de tests : Dynamique Systémique, Saturations et Modélisation Temporelle
 * Couvre : DYN-01, DYN-02, SAT-01, POLICY-01
 */
describe('Dynamique Systémique et Saturation (P1)', () => {
  const countryCodes = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'] as const;

  describe('DYN-01 — Dérive déterministe structurelle dans le Scénario 1', () => {
    it('[Caractérisation] vérifie la dérive entropique naturelle (hausse CO2, chute VEB, freinage croissance)', () => {
      // Simulation neutre sans impulsion corrective extrême
      const res = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 7.0, veb_eu: 75.0 },
        seed: 42
      });

      // Pour un pays à forte sensibilité écologique comme la Pologne (PL) :
      // sens: croiss_co2: 0.18, co2_veb: 0.13, veb_gini: 0.08, veb_croiss: 0.10
      const co2SeriesPL = res.countries.PL.series.co2;
      const vebSeriesPL = res.countries.PL.series.veb;
      const croissSeriesPL = res.countries.PL.series.croiss;

      // Le CO2 croît d'année en année
      expect(co2SeriesPL[9]).toBeGreaterThan(co2SeriesPL[0]);
      // Le VEB chute d'année en année
      expect(vebSeriesPL[9]).toBeLessThan(vebSeriesPL[0]);
      // La croissance s'érode sous l'effet du malus écologique
      expect(croissSeriesPL[9]).toBeLessThan(croissSeriesPL[0]);
    });
  });

  describe('DYN-02 — Dynamique géopolitique à seuil critique (Scénario 2)', () => {
    it('[Diagnostic exploratoire] vérifie la bifurcation entre spirale vertueuse et spirale régressive', () => {
      // Cas 1 : Configuration haute (au-dessus du seuil norm=50, vdem=0.5)
      const resHaut = runSimulation({
        scenarioId: 2,
        inputs: { normandie_eu: 85, vdem_eu: 0.85, pib_growth_eu: 2.0, idh_eu: 0.90 },
        seed: 42
      });

      // Cas 2 : Configuration basse (au-dessous du seuil norm=50, vdem=0.5)
      const resBas = runSimulation({
        scenarioId: 2,
        inputs: { normandie_eu: 25, vdem_eu: 0.25, pib_growth_eu: -1.0, idh_eu: 0.50 },
        seed: 42
      });

      // Dans la configuration haute, l'Allemagne (DE) progresse vers les plafonds
      const vdemHautDE = resHaut.countries.DE.series.vdem;
      expect(vdemHautDE[9]).toBeGreaterThanOrEqual(vdemHautDE[0]);
      expect(vdemHautDE[9]).toBeCloseTo(1.0, 2); // Atteint ou frôle la saturation haute

      // Analyse de la bifurcation autour du point critique (normandie = 50, vdem = 0.5) :
      // L'Allemagne démarre très haut (init 85 et 0.88) : même avec une impulsion basse (25 et 0.25),
      // son état an 0 reste à 61 > 50 et 0.628 > 0.5, ce qui lui permet de rebondir vers le haut.
      // En revanche, la Hongrie (HU) démarre plus bas (init 60 et 0.66) :
      // l'impulsion basse la fait basculer sous le seuil critique (normandie_0 = 46 < 50, vdem_0 = 0.496 < 0.50).
      // Elle entre alors dans une spirale descendante mutuelle :
      const vdemBasHU = resBas.countries.HU.series.vdem;
      const normBasHU = resBas.countries.HU.series.normandie;

      // La Hongrie chute continuellement sous le seuil de basculement
      expect(vdemBasHU[9]).toBeLessThan(vdemBasHU[0]);
      expect(normBasHU[9]).toBeLessThan(normBasHU[0]);

      // Tandis qu'en configuration haute, la Hongrie est tirée vers le haut
      const vdemHautHU = resHaut.countries.HU.series.vdem;
      expect(vdemHautHU[9]).toBeGreaterThan(vdemHautHU[0]);
    });
  });

  describe('SAT-01 — Diagnostic de saturation toutes directives', () => {
    it('[Diagnostic exploratoire] quantifie les occurrences de saturation aux bornes sur les 16 directives', () => {
      const s1 = JSON.parse(fs.readFileSync('./public/json/scenario1.json', 'utf8'));
      const s2 = JSON.parse(fs.readFileSync('./public/json/scenario2.json', 'utf8'));

      let satCountS1CroissMin = 0;
      let satCountS1Co2Max = 0;
      let satCountS1GiniMax = 0;
      let satCountS2VdemMax = 0;
      let satCountS2IdhMax = 0;

      // Parcours Scénario 1
      for (const d of s1.directive) {
        const res = runSimulation({
          scenarioId: 1,
          inputs: {
            pib_eu: d.statistiques_depart?.pib_eu ?? 2.0,
            gini_eu: d.statistiques_depart?.gini_eu ?? 0.30,
            co2_eu: d.statistiques_depart?.co2_eu ?? 8.0,
            veb_eu: d.statistiques_depart?.veb_eu ?? 80.0
          },
          seed: 42
        });

        for (const c of countryCodes) {
          const sCroiss = res.countries[c].series.croiss;
          const sCo2 = res.countries[c].series.co2;
          const sGini = res.countries[c].series.gini;

          if (sCroiss.some(v => v <= 0.0 + 1e-6)) satCountS1CroissMin++;
          if (sCo2.some(v => v >= 10.0 - 1e-6)) satCountS1Co2Max++;
          if (sGini.some(v => v >= 0.60 - 1e-6)) satCountS1GiniMax++;
        }
      }

      // Parcours Scénario 2
      for (const d of s2.directive) {
        const res = runSimulation({
          scenarioId: 2,
          inputs: {
            normandie_eu: d.statistiques_depart?.normandie_eu ?? 85.0,
            vdem_eu: d.statistiques_depart?.vdem_eu ?? 0.86,
            pib_growth_eu: d.statistiques_depart?.pib_growth_eu ?? 1.6,
            idh_eu: d.statistiques_depart?.idh_eu ?? 0.93
          },
          seed: 42
        });

        for (const c of countryCodes) {
          const sVdem = res.countries[c].series.vdem;
          const sIdh = res.countries[c].series.idh;

          if (sVdem.some(v => v >= 1.0 - 1e-6)) satCountS2VdemMax++;
          if (sIdh.some(v => v >= 1.0 - 1e-6)) satCountS2IdhMax++;
        }
      }

      // Assertions sur les faits observés :
      // 1. La croissance s'annule (0%) pour les pays vulnérables en l'absence de régulation verte suffisante
      // (Consolidé en Phase A : atténuation des saturations excessives de 32 à 24 grâce aux actions pérennes)
      expect(satCountS1CroissMin).toBeGreaterThanOrEqual(20);
      // 2. Le Gini sature au max (0.60) chez les pays les plus fragiles (Hongrie)
      expect(satCountS1GiniMax).toBeGreaterThanOrEqual(8);
      // 3. V-Dem et IDH saturent au plafond maximal de 1.00 dans une majorité de directives S2
      expect(satCountS2VdemMax).toBeGreaterThanOrEqual(40);
      expect(satCountS2IdhMax).toBeGreaterThanOrEqual(40);
    });
  });

  describe('POLICY-01 — Nature de l\'impulsion : choc ponctuel an 0 vs persistance', () => {
    it('[Caractérisation] prouve que les cibles de la directive n\'interviennent qu\'à l\'an 0', () => {
      // Dans engine.ts (lignes 65-68) :
      // let croiss = profile.dev.init.croiss + 0.4 * (targetPib - profile.dev.init.croiss);
      // Pour t = 1..9, la récurrence n'utilise plus jamais targetPib, targetGini, targetCo2, targetVeb.
      // Il s'agit d'une impulsion initiale ponctuelle suivie d'une dynamique libre.

      const resA = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 3.5, gini_eu: 0.30, co2_eu: 7.0, veb_eu: 80.0 },
        seed: 42
      });

      // Si la cible persistait, la croissance à long terme convergerait vers 3.5%.
      // Or, en fin de trajectoire, la dynamique libre nationale l'a fait diverger :
      const euCroissY9 = resA.euSeries.croiss[9];
      expect(euCroissY9).not.toBeCloseTo(3.5, 1);
    });
  });
});
