import { describe, it, expect } from 'vitest';
import { runSimulation } from '../src/simulation/engine';
import * as fs from 'fs';

/**
 * Suite de tests : Validation des Entrées, Robustesse Multi-Graines et Diagnostic de Référence
 * Couvre : INPUT-01, REF-01, ROB-01
 */
describe('Validation des Entrées et Robustesse Pédagogique (P2)', () => {
  describe('INPUT-01 — Robustesse aux données d\'entrée invalides et limites de contrat', () => {
    it('[Caractérisation] vérifie le repli robuste en cas de champs manquants dans inputs', () => {
      // Dans engine.ts :
      // const targetPib = inputs.inputs.pib_eu ?? profile.dev.init.croiss;
      // Si inputs.inputs est vide ({}), le moteur se replie sur les valeurs initiales du profil pays
      const res = runSimulation({
        scenarioId: 1,
        inputs: {},
        seed: 42
      });

      expect(res.years.length).toBe(10);
      expect(res.euScoreSucces).toBeGreaterThanOrEqual(0);
      expect(res.euScoreSucces).toBeLessThanOrEqual(100);
      // Les pays ont tous des données valides
      expect(Number.isFinite(res.countries.DE.series.croiss[0])).toBe(true);
    });

    it('[Invariant contractuel] vérifie le bornage strict en présence de valeurs finies hors domaine', () => {
      // Valeurs aberrantes (PIB 50%, CO2 -20, VEB 500)
      const res = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 50.0, gini_eu: -1.0, co2_eu: -20.0, veb_eu: 500.0 },
        seed: 42
      });

      // Le moteur clampe rigoureusement toutes les valeurs annuelles
      for (const country of Object.values(res.countries)) {
        for (let t = 0; t < 10; t++) {
          expect(country.series.croiss[t]).toBeLessThanOrEqual(4.0);
          expect(country.series.gini[t]).toBeGreaterThanOrEqual(0.20);
          expect(country.series.co2[t]).toBeGreaterThanOrEqual(2.0);
          expect(country.series.veb[t]).toBeLessThanOrEqual(100.0);
        }
      }
    });

    it('[Caractérisation & Limite] documente la propagation non bloquée des NaN (absence de garde-fou runtime)', () => {
      // En l'absence de validation de schéma runtime (Zod ou assertions explicites),
      // l'injection de NaN propage des NaN dans tout le graphe de calcul
      const resNaN = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: NaN },
        seed: 42
      });

      expect(Number.isNaN(resNaN.countries.DE.series.croiss[0])).toBe(true);
      expect(Number.isNaN(resNaN.euScoreSucces)).toBe(true);
    });
  });

  describe('REF-01 — Absence de mécanisme de référence / statut quo natif', () => {
    it('[Caractérisation] constate que l\'API ne fournit pas de calcul différentiel automatique', () => {
      // L'API ne dispose pas d'un paramètre `baselineInputs` ou `computeDelta`.
      // Pour mesurer le gain d'une proposition par rapport au statut quo,
      // le consommateur doit exécuter deux simulations distinctes et calculer la différence manuellement.
      const resDirective = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.5, gini_eu: 0.28, co2_eu: 6.0, veb_eu: 85.0 },
        seed: 42
      });

      const resStatutQuo = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 1.5, gini_eu: 0.30, co2_eu: 7.0, veb_eu: 80.0 },
        seed: 42
      });

      const gainScoreSucces = resDirective.euScoreSucces - resStatutQuo.euScoreSucces;
      expect(Number.isFinite(gainScoreSucces)).toBe(true);
    });
  });

  describe('ROB-01 — Robustesse multi-graines et stabilité ordinale', () => {
    it('[Diagnostic exploratoire] mesure la dispersion des scores et la stabilité du classement sur 50 graines', () => {
      const s1 = JSON.parse(fs.readFileSync('./public/json/scenario1.json', 'utf8'));
      const d1 = s1.directive[0]; // Pacte vert
      const d4 = s1.directive[3]; // Flexisécurité

      const scoresD1: number[] = [];
      const scoresD4: number[] = [];
      let rankInversions = 0;

      for (let seed = 1; seed <= 50; seed++) {
        const r1 = runSimulation({
          scenarioId: 1,
          inputs: {
            pib_eu: d1.statistiques_depart.pib_eu,
            gini_eu: d1.statistiques_depart.gini_eu,
            co2_eu: d1.statistiques_depart.co2_eu,
            veb_eu: d1.statistiques_depart.veb_eu
          },
          seed
        });

        const r4 = runSimulation({
          scenarioId: 1,
          inputs: {
            pib_eu: d4.statistiques_depart.pib_eu,
            gini_eu: d4.statistiques_depart.gini_eu,
            co2_eu: d4.statistiques_depart.co2_eu,
            veb_eu: d4.statistiques_depart.veb_eu
          },
          seed
        });

        scoresD1.push(r1.euScoreSucces);
        scoresD4.push(r4.euScoreSucces);

        if (r1.euScoreSucces >= r4.euScoreSucces) {
          rankInversions++;
        }
      }

      // Moyennes et écarts-types
      const meanD1 = scoresD1.reduce((a, b) => a + b, 0) / 50;
      const stdD1 = Math.sqrt(scoresD1.reduce((a, b) => a + Math.pow(b - meanD1, 2), 0) / 50);

      const meanD4 = scoresD4.reduce((a, b) => a + b, 0) / 50;
      const stdD4 = Math.sqrt(scoresD4.reduce((a, b) => a + Math.pow(b - meanD4, 2), 0) / 50);

      // Le bruit de fluctuation (0.04) génère un très faible écart-type (std <= 0.15)
      expect(stdD1).toBeLessThan(0.15);
      expect(stdD4).toBeLessThan(0.15);

      // Stabilité ordinale : le classement entre D4 et D1 est 100% stable (0% d'inversion)
      expect(rankInversions).toBe(0);
      expect(meanD4).toBeGreaterThan(meanD1);
    });
  });
});
