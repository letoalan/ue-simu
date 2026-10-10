import { describe, it, expect } from 'vitest';
import { simulateParties } from '../src/simulation/partiesEngine';
import { PARTIES_PROFILES } from '../src/data/parties';

/**
 * Suite de tests : Effectifs Institutionnels et Conservation des Sièges
 * Couvre : SEATS-01, SEATS-02
 */
describe('Effectifs Institutionnels et Conservation des Sièges (P0)', () => {
  const partyCodes = Object.keys(PARTIES_PROFILES) as (keyof typeof PARTIES_PROFILES)[];

  describe('SEATS-01 — Échelles de satisfaction et formules électorales', () => {
    it('[Caractérisation] vérifie la plage du multiplicateur électoral [0.8, 1.6]', () => {
      // Formule dans partiesEngine.ts :
      // meps = Math.round(party.base.meps * (0.8 + 0.8 * sMoy / 100))
      // Comme sMoy est sur l'échelle [0, 100], sMoy / 100 est dans [0, 1].
      // Multiplicateur minimal (sat = 0%) : 0.8 + 0 = 0.8
      // Multiplicateur maximal (sat = 100%) : 0.8 + 0.8 = 1.6

      const makeDefaultStats = () => ({
        pibArr: Array(10).fill(2.0),
        giniArr: Array(10).fill(0.30),
        co2Arr: Array(10).fill(4.0),
        vebArr: Array(10).fill(80.0),
        stabArr: Array(10).fill(80.0),
        demArr: Array(10).fill(0.85),
        idhArr: Array(10).fill(0.92)
      });

      const res = simulateParties(makeDefaultStats(), PARTIES_PROFILES, 1);

      for (const p of Object.values(res)) {
        const base = PARTIES_PROFILES[p.code].base.meps;
        // Années 0-4 : sièges de base
        expect(p.mepsArr[0]).toBe(base);
        expect(p.mepsArr[4]).toBe(base);

        // Années 5-8 et 9 : sièges réévalués
        const mepY5 = p.mepsArr[5];
        expect(mepY5).toBeGreaterThanOrEqual(Math.round(base * 0.8));
        expect(mepY5).toBeLessThanOrEqual(Math.round(base * 1.6));
      }
    });
  });

  describe('SEATS-02 — Non-conservation des effectifs parlementaires et institutionnels', () => {
    it('[Diagnostic exploratoire] démontre que la somme des députés n\'est PAS conservée (statut d\'indice de puissance)', () => {
      // Somme de base des sièges dans PARTIES_PROFILES
      const baseTotalMeps = partyCodes.reduce((sum, c) => sum + PARTIES_PROFILES[c].base.meps, 0);
      expect(baseTotalMeps).toBe(611); // 182 + 154 + 102 + 72 + 62 + 39 = 611 (et non 720)

      // Test avec un scénario hyper-favorable (satisfactions élevées)
      const highStats = {
        pibArr: Array(10).fill(3.8),
        giniArr: Array(10).fill(0.22),
        co2Arr: Array(10).fill(2.2),
        vebArr: Array(10).fill(98.0),
        stabArr: Array(10).fill(95.0),
        demArr: Array(10).fill(0.98),
        idhArr: Array(10).fill(0.98)
      };

      const resHigh = simulateParties(highStats, PARTIES_PROFILES, 1);
      const totalMepsY0 = partyCodes.reduce((sum, c) => sum + resHigh[c].mepsArr[0], 0);
      const totalMepsY5 = partyCodes.reduce((sum, c) => sum + resHigh[c].mepsArr[5], 0);
      const totalMepsY9 = partyCodes.reduce((sum, c) => sum + resHigh[c].mepsArr[9], 0);

      expect(totalMepsY0).toBe(611);
      // La somme des sièges explose bien au-delà de 611 et de 720 :
      expect(totalMepsY5).toBeGreaterThan(611);
      expect(totalMepsY9).toBeGreaterThan(611);

      // Test avec un scénario hyper-dégradé (satisfactions très basses)
      const lowStats = {
        pibArr: Array(10).fill(-1.5),
        giniArr: Array(10).fill(0.58),
        co2Arr: Array(10).fill(9.8),
        vebArr: Array(10).fill(5.0),
        stabArr: Array(10).fill(10.0),
        demArr: Array(10).fill(0.10),
        idhArr: Array(10).fill(0.10)
      };

      const resLow = simulateParties(lowStats, PARTIES_PROFILES, 1);
      const lowTotalMepsY5 = partyCodes.reduce((sum, c) => sum + resLow[c].mepsArr[5], 0);
      expect(lowTotalMepsY5).toBeLessThan(611);

      // Conclusion : les effectifs parlementaires ne constituent pas une assemblée de taille fixe
      // répartie à la proportionnelle, mais 6 séries d'indices de puissance indépendants.
    });

    it('[Diagnostic exploratoire] démontre la non-conservation des commissaires et des pourcentages au Conseil', () => {
      // Somme de base des commissaires = 27
      const baseComm = partyCodes.reduce((sum, c) => sum + PARTIES_PROFILES[c].base.commissaires, 0);
      expect(baseComm).toBe(27);

      // Somme de base des pourcentages Conseil = 106%
      const baseConseil = partyCodes.reduce((sum, c) => sum + PARTIES_PROFILES[c].base.conseil, 0);
      expect(baseConseil).toBe(106);

      const stats = {
        pibArr: Array(10).fill(3.5),
        giniArr: Array(10).fill(0.25),
        co2Arr: Array(10).fill(2.5),
        vebArr: Array(10).fill(90.0),
        stabArr: Array(10).fill(85.0),
        demArr: Array(10).fill(0.90),
        idhArr: Array(10).fill(0.95)
      };

      const res = simulateParties(stats, PARTIES_PROFILES, 1);
      const totalCommY5 = partyCodes.reduce((sum, c) => sum + res[c].commissairesArr[5], 0);
      const totalConseilY5 = partyCodes.reduce((sum, c) => sum + res[c].conseilArr[5], 0);

      // Le collège des commissaires dépasse 27
      expect(totalCommY5).toBeGreaterThan(27);
      // Les pourcentages au Conseil ne totalisent pas 100%
      expect(totalConseilY5).not.toBe(100);
    });
  });
});
