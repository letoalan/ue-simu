import { describe, it, expect } from 'vitest';
import { simulateParties } from '../src/simulation/partiesEngine';
import { simulateLobbies } from '../src/simulation/lobbiesEngine';
import { runSimulation } from '../src/simulation/engine';
import { PARTIES_PROFILES } from '../src/data/parties';
import { LOBBIES_PROFILES } from '../src/data/lobbies';
import { PRNG } from '../src/simulation/prng';

/**
 * Suite de tests : Sensibilité Politique, Doctrinale et Lobbies
 * Couvre : GINI-01, GINI-02, GINI-03, ECO-01, ECO-02, ECO-03, ECO-04
 */
describe('Sensibilité Politique et Lobbies (P0)', () => {
  // Oracle indépendant pour la normalisation de nuisance
  const independentNormalize = (val: number, min: number, max: number): number => {
    const clamped = Math.max(min, Math.min(max, val));
    return (clamped - min) / (max - min);
  };

  describe('GINI-01 — Unités, seuil et portée du malus politique', () => {
    it('[Caractérisation & Invariant] prouve que le seuil 0.60 porte sur la nuisance normalisée et équivaut à un Gini brut de 0.44', () => {
      // Hypothèse : dans partiesEngine.ts, norm.gini est la nuisance normalisée (raw - 0.2) / 0.4.
      // La condition `if (norm.gini > 0.6)` teste donc (raw - 0.2) / 0.4 > 0.6 <=> raw > 0.44.
      const rawAtThreshold = 0.2 + 0.6 * 0.4; // 0.44
      expect(rawAtThreshold).toBeCloseTo(0.44, 6);

      const makeStats = (giniVal: number) => ({
        pibArr: Array(10).fill(2.0),
        giniArr: Array(10).fill(giniVal),
        co2Arr: Array(10).fill(4.0),
        vebArr: Array(10).fill(80.0),
        stabArr: Array(10).fill(80.0),
        demArr: Array(10).fill(0.85),
        idhArr: Array(10).fill(0.92)
      });

      // Oracle indépendant pour S&D :
      // pond: pib: 0.15, gini: 0.25, co2: 0.10, veb: 0.10. total = 0.60.
      // norm.pib = (2 - (-2)) / 6 = 4/6 = 2/3
      // norm.co2 = (4 - 2) / 8 = 2/8 = 0.25
      // norm.veb = (80 - 0) / 100 = 0.8
      // s_base = [0.15*(2/3) + 0.25*(1 - norm.gini) + 0.10*(1 - 0.25) + 0.10*0.8] / 0.60
      const calcExpectedSDE = (rawGini: number): number => {
        const normGini = independentNormalize(rawGini, 0.2, 0.6);
        const normPib = independentNormalize(2.0, -2, 4);
        const normCo2 = independentNormalize(4.0, 2, 10);
        const normVeb = independentNormalize(80.0, 0, 100);

        let s = (0.15 * normPib + 0.25 * (1 - normGini) + 0.10 * (1 - normCo2) + 0.10 * normVeb) / 0.60;
        if (normGini > 0.6) {
          s -= (normGini - 0.6) * 1.5;
        }
        return Math.max(0, Math.min(1, s)) * 100;
      };

      // 1. Juste en dessous du seuil : Gini brut = 0.43 (norm.gini = 0.575 <= 0.6)
      const resBelow = simulateParties(makeStats(0.43), PARTIES_PROFILES, 1);
      const expBelow = calcExpectedSDE(0.43);
      expect(resBelow.SDE.satisfactionArr[0]).toBeCloseTo(expBelow, 4);

      // 2. Exactement au seuil : Gini brut = 0.44 (norm.gini = 0.600 <= 0.6)
      const resAt = simulateParties(makeStats(0.44), PARTIES_PROFILES, 1);
      const expAt = calcExpectedSDE(0.44);
      expect(resAt.SDE.satisfactionArr[0]).toBeCloseTo(expAt, 4);

      // 3. Juste au-dessus du seuil : Gini brut = 0.45 (norm.gini = 0.625 > 0.6 -> malus déclenché)
      const resAbove = simulateParties(makeStats(0.45), PARTIES_PROFILES, 1);
      const expAbove = calcExpectedSDE(0.45);
      expect(resAbove.SDE.satisfactionArr[0]).toBeCloseTo(expAbove, 4);
      // Le malus a provoqué un décrochage supplémentaire
      const diffBelowAt = expBelow - expAt; // baisse régulière due à 1 - norm.gini
      const diffAtAbove = expAt - expAbove; // baisse régulière + malus (0.025 * 1.5 * 100 = 3.75%)
      expect(diffAtAbove).toBeGreaterThan(diffBelowAt * 2);

      // 4. Inaccessibilité d'un seuil brut 0.60 :
      // Si la règle métier voulait un seuil brut à 0.60, avec un Gini brut clampé à max 0.60,
      // la condition `rawGini > 0.60` serait strictement impossible.
      // Le fait que le code utilise norm.gini > 0.6 rend la condition active sur [0.44, 0.60].
    });
  });

  describe('GINI-02 — Atteignabilité intégrée dans la simulation complète', () => {
    it('[Diagnostic exploratoire] confirme que le seuil Gini (0.44 brut) est atteint dans les trajectoires réelles du Scénario 1', () => {
      // Test de la Directive 6 (Industrie 5.0) sans forçage
      const resD6 = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.2, gini_eu: 0.32, co2_eu: 8.2, veb_eu: 75.0 },
        seed: 42
      });

      // Vérifie l'évolution du Gini UE : atteint-il > 0.44 ?
      const maxGini = Math.max(...resD6.euSeries.gini);
      const maxNormGini = (maxGini - 0.2) / 0.4;

      expect(maxGini).toBeGreaterThan(0.44);
      expect(maxNormGini).toBeGreaterThan(0.60);

      // Le malus a donc été effectivement appliqué aux partis S&D et GUE dans les dernières années
      const lastYearSatSDE = resD6.parties.SDE.satisfactionArr[9];
      expect(lastYearSatSDE).toBeLessThan(40); // sévère chute de satisfaction
    });

    it('[Caractérisation] teste la réponse sous Gini maximal (0.60 brut)', () => {
      const resMax = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.0, gini_eu: 0.60, co2_eu: 8.0, veb_eu: 80.0 },
        seed: 42
      });

      // En fin de trajectoire avec Gini très haut, la satisfaction S&D s'effondre
      expect(resMax.parties.SDE.satisfactionArr[9]).toBeLessThanOrEqual(5.0);
      expect(resMax.parties.GUE.satisfactionArr[9]).toBeLessThanOrEqual(5.0);
    });
  });

  describe('GINI-03 — Sens de préférence et monotonie par parti', () => {
    it('[Exigence de modèle] vérifie que la satisfaction de S&D et GUE décroît strictement avec le Gini', () => {
      const giniValues = [0.20, 0.25, 0.30, 0.35, 0.40, 0.44, 0.48, 0.55, 0.60];
      const sdeSats: number[] = [];
      const gueSats: number[] = [];

      for (const g of giniValues) {
        const stats = {
          pibArr: Array(10).fill(2.0),
          giniArr: Array(10).fill(g),
          co2Arr: Array(10).fill(4.0),
          vebArr: Array(10).fill(80.0),
          stabArr: Array(10).fill(80.0),
          demArr: Array(10).fill(0.85),
          idhArr: Array(10).fill(0.92)
        };
        const res = simulateParties(stats, PARTIES_PROFILES, 1);
        sdeSats.push(res.SDE.satisfactionArr[0]);
        gueSats.push(res.GUE.satisfactionArr[0]);
      }

      // S&D décroît strictement sur tout le domaine [0.20, 0.60]
      for (let i = 1; i < giniValues.length; i++) {
        expect(sdeSats[i]).toBeLessThan(sdeSats[i - 1]);
      }

      // GUE est plafonné contractuellement à 80% (code: `if (code === 'GUE') s = Math.min(s, 0.80)`)
      // Ainsi, pour les Gini très bas (0.20 et 0.25), sa satisfaction est saturée au plafond de 80%.
      expect(gueSats[0]).toBe(80.0);
      expect(gueSats[1]).toBe(80.0);

      // Dès que le Gini dépasse le seuil de saturation haute (~0.28) et avant la saturation basse (0%),
      // la satisfaction de GUE décroît strictement (testé sur 0.30, 0.35, 0.40, 0.44, 0.48)
      const nonSaturatedIndices = [2, 3, 4, 5, 6]; // correspond à 0.30, 0.35, 0.40, 0.44, 0.48
      for (let i = 1; i < nonSaturatedIndices.length; i++) {
        const prevIdx = nonSaturatedIndices[i - 1];
        const currIdx = nonSaturatedIndices[i];
        expect(gueSats[currIdx]).toBeLessThan(gueSats[prevIdx]);
      }

      // Pour les Gini extrêmes (0.55 et 0.60), le malus violent fait tomber le score brut en négatif,
      // entraînant une saturation au plancher absolu de 0% (Math.max(0, s))
      expect(gueSats[7]).toBe(0.0); // Gini = 0.55
      expect(gueSats[8]).toBe(0.0); // Gini = 0.60
    });
  });

  describe('ECO-01 — Effet isolé du CO₂ (à VEB constant)', () => {
    it('[Caractérisation] vérifie la décroissance de la satisfaction des Verts et le bonus sous CO2 < 3.6', () => {
      const co2Levels = [2.0, 3.0, 3.5, 3.7, 5.0, 7.0, 9.0, 10.0];
      const vertSats: number[] = [];

      for (const co2 of co2Levels) {
        const stats = {
          pibArr: Array(10).fill(2.0),
          giniArr: Array(10).fill(0.30),
          co2Arr: Array(10).fill(co2),
          vebArr: Array(10).fill(85.0), // VEB > 80% pour déclencher la condition bonus si CO2 < 3.6
          stabArr: Array(10).fill(80.0),
          demArr: Array(10).fill(0.85),
          idhArr: Array(10).fill(0.92)
        };
        const res = simulateParties(stats, PARTIES_PROFILES, 1);
        vertSats.push(res.VERT.satisfactionArr[0]);
      }

      // La satisfaction des Verts doit être strictement décroissante avec la hausse du CO2
      for (let i = 1; i < vertSats.length; i++) {
        expect(vertSats[i]).toBeLessThan(vertSats[i - 1]);
      }

      // Détecte le décrochage au seuil de bonus (norm.co2 < 0.2 <=> co2 < 3.6) :
      // Entre 3.5 et 3.7, il y a la perte du bonus doctrinal de +0.20 (+20 points)
      const diffBonus = vertSats[2] - vertSats[3]; // CO2 3.5 vs 3.7
      expect(diffBonus).toBeGreaterThan(15.0); // chute brutale d'au moins 15 points
    });
  });

  describe('ECO-02 — Effet isolé du VEB (à CO₂ constant)', () => {
    it('[Caractérisation] vérifie la croissance de la satisfaction des Verts et le seuil bonus à VEB > 80%', () => {
      const vebLevels = [0, 20, 50, 70, 79, 81, 90, 100];
      const vertSats: number[] = [];

      for (const veb of vebLevels) {
        const stats = {
          pibArr: Array(10).fill(2.0),
          giniArr: Array(10).fill(0.30),
          co2Arr: Array(10).fill(3.0), // CO2 < 3.6 (norm.co2 < 0.2)
          vebArr: Array(10).fill(veb),
          stabArr: Array(10).fill(80.0),
          demArr: Array(10).fill(0.85),
          idhArr: Array(10).fill(0.92)
        };
        const res = simulateParties(stats, PARTIES_PROFILES, 1);
        vertSats.push(res.VERT.satisfactionArr[0]);
      }

      // Croissance stricte avec le VEB
      for (let i = 1; i < vertSats.length; i++) {
        expect(vertSats[i]).toBeGreaterThan(vertSats[i - 1]);
      }

      // Décrochage du bonus norm.veb > 0.8 (veb > 80%)
      const jumpBonus = vertSats[5] - vertSats[4]; // 81 vs 79
      expect(jumpBonus).toBeGreaterThan(15.0);
    });
  });

  describe('ECO-03 — Sensibilités contrastées des lobbies', () => {
    it('[Invariant contractuel] vérifie que la hausse du CO2 favorise les fossiles et défavorise les Verts', () => {
      const lowCo2Stats = {
        pibArr: Array(10).fill(2.0),
        giniArr: Array(10).fill(0.30),
        co2Arr: Array(10).fill(2.5),
        vebArr: Array(10).fill(85.0),
        stabArr: Array(10).fill(80.0),
        demArr: Array(10).fill(0.85),
        idhArr: Array(10).fill(0.92)
      };

      const highCo2Stats = {
        pibArr: Array(10).fill(2.0),
        giniArr: Array(10).fill(0.30),
        co2Arr: Array(10).fill(9.5),
        vebArr: Array(10).fill(85.0),
        stabArr: Array(10).fill(80.0),
        demArr: Array(10).fill(0.85),
        idhArr: Array(10).fill(0.92)
      };

      const resLow = simulateLobbies(lowCo2Stats, LOBBIES_PROFILES, 1, new PRNG(123));
      const resHigh = simulateLobbies(highCo2Stats, LOBBIES_PROFILES, 1, new PRNG(123));

      // Les énergies fossiles obtiennent une réputation et un score plus élevés avec fort CO2
      // car 'ecologie' est une composante hostile pour eux (facteur rep: -0.5, inf: -0.4, ennemi: ecologie)
      expect(resHigh.ENERGIES_FOSSILES.scoreDeReussite)
        .toBeGreaterThan(resLow.ENERGIES_FOSSILES.scoreDeReussite);

      // Tandis que pour les partis, les Verts s'effondrent
      const partyLow = simulateParties(lowCo2Stats, PARTIES_PROFILES, 1);
      const partyHigh = simulateParties(highCo2Stats, PARTIES_PROFILES, 1);
      expect(partyLow.VERT.scoreVictoire).toBeGreaterThan(partyHigh.VERT.scoreVictoire);
    });
  });

  describe('ECO-04 — Parcours complet : effet direct vs effet systémique médié', () => {
    it('[Diagnostic exploratoire] analyse la boucle de rétroaction macroéconomique dans une simulation complète', () => {
      // Dans le moteur national (engine.ts), co2 dégrade le VEB, qui augmente le GINI, qui réduit le PIB.
      const resClean = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.0, gini_eu: 0.28, co2_eu: 3.0, veb_eu: 85.0 },
        seed: 42
      });

      const resDirty = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.0, gini_eu: 0.28, co2_eu: 9.0, veb_eu: 85.0 },
        seed: 42
      });

      // En simulation complète, l'effet d'un fort CO2 initial dégrade aussi la trajectoire de croissance
      const meanCroissClean = resClean.euSeries.croiss.reduce((a, b) => a + b, 0) / 10;
      const meanCroissDirty = resDirty.euSeries.croiss.reduce((a, b) => a + b, 0) / 10;

      expect(meanCroissClean).toBeGreaterThan(meanCroissDirty);
    });
  });
});
