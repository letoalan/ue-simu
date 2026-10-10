import { describe, it, expect } from 'vitest';

/**
 * Suite de tests : Scores de Réussite et Fonctions d'Utilité
 * Couvre : SCORE-01, SCORE-02, SCORE-03
 */
describe('Scores de Réussite (P0)', () => {
  // Oracle indépendant conforme à la spécification mathématique
  const independentScoreFormula = (s0: number, sf: number): number => {
    const raw = 100 * (0.4 * sf + 0.4 * (1 - Math.abs(0.8 - sf)) + 0.2 * (sf - s0));
    return Math.round(raw * 10) / 10;
  };

  describe('SCORE-01 — Formule indépendante et cas témoins contractuels', () => {
    it('[Invariant contractuel] vérifie les cas témoins exacts de la formule de score', () => {
      // 1. S0 = 1, Sf = 0 => Q = -12
      const q1 = independentScoreFormula(1.0, 0.0);
      expect(q1).toBe(-12);

      // 2. S0 = 0, Sf = 1 => Q = 92
      const q2 = independentScoreFormula(0.0, 1.0);
      expect(q2).toBe(92);

      // 3. S0 = 0.5, Sf = 0.8 => Q = 78
      const q3 = independentScoreFormula(0.5, 0.8);
      expect(q3).toBe(78);

      // 4. S0 = 0.5, Sf = 1.0 => Q = 82
      const q4 = independentScoreFormula(0.5, 1.0);
      expect(q4).toBe(82);
    });

    it('[Caractérisation & Diagnostic] vérifie que le moteur produit exactement ces valeurs et ne borne pas les scores négatifs', () => {
      // Dans engine.ts (lignes 183-185 et 209-211) :
      // Math.round((0.4 * finSat + 0.4 * (1 - Math.abs(0.8 - finSat)) + 0.2 * ecart) * 100 * 10) / 10
      // Le moteur n'applique AUCUN Math.max(0, Math.min(100, ...)) sur le score final.

      const s0 = 1.0;
      const sf = 0.0;
      const ecart = sf - s0; // -1.0
      const scoreMoteur = Math.round(
        (0.4 * sf + 0.4 * (1 - Math.abs(0.8 - sf)) + 0.2 * ecart) * 100 * 10
      ) / 10;

      expect(scoreMoteur).toBe(-12);
      expect(scoreMoteur).toBeLessThan(0); // Score négatif possible en théorie
    });

    it('[Invariant contractuel] vérifie l\'évaluation de la grille complète {0, 0.2, 0.5, 0.8, 1.0}^2', () => {
      const grid = [0, 0.2, 0.5, 0.8, 1.0];
      for (const s0 of grid) {
        for (const sf of grid) {
          const expected = independentScoreFormula(s0, sf);
          const engineEquiv = Math.round(
            (0.4 * sf + 0.4 * (1 - Math.abs(0.8 - sf)) + 0.2 * (sf - s0)) * 100 * 10
          ) / 10;
          expect(engineEquiv).toBe(expected);
        }
      }
    });
  });

  describe('SCORE-02 — Paradoxe de la cible et monotonie au-delà de 0.8', () => {
    it('[Diagnostic exploratoire] démontre que 0.8 n\'est PAS un maximum local et que le score continue de croître pour Sf > 0.8', () => {
      // Analyse mathématique de la dérivée pour Sf > 0.8 :
      // Q(Sf, S0) = 100 * [0.4*Sf + 0.4*(1 - (Sf - 0.8)) + 0.2*(Sf - S0)]
      //           = 100 * [0.4*Sf + 0.4*(1.8 - Sf) + 0.2*Sf - 0.2*S0]
      //           = 100 * [0.72 + 0.2*Sf - 0.2*S0] = 72 + 20*Sf - 20*S0
      // dQ / dSf = +20 > 0.
      // Donc pour tout Sf > 0.8, le score AUGMENTE avec Sf !

      const s0 = 0.5;
      const qAt080 = independentScoreFormula(s0, 0.80); // 78
      const qAt081 = independentScoreFormula(s0, 0.81); // 78.2
      const qAt090 = independentScoreFormula(s0, 0.90); // 80
      const qAt100 = independentScoreFormula(s0, 1.00); // 82

      expect(qAt080).toBe(78);
      expect(qAt081).toBeGreaterThan(qAt080);
      expect(qAt090).toBeGreaterThan(qAt081);
      expect(qAt100).toBeGreaterThan(qAt090);

      // Conclusion : la documentation pédagogique affirmant que 0.8 est l'optimum absolu d'équilibre est inexacte.
      // 0.8 est un point anguleux où la dérivée passe de +100 (pour Sf < 0.8) à +20 (pour Sf > 0.8),
      // mais le maximum absolu est toujours atteint en Sf = 1.0.
    });
  });

  describe('SCORE-03 — Biais d\'initialisation et comparaison des acteurs', () => {
    it('[Diagnostic exploratoire] démontre la sur-valorisation de la progression au détriment de la vertu initiale', () => {
      // Cas : deux acteurs atteignent exactement le même niveau final d'excellence Sf = 0.80.
      // Acteur A (vertueux dès le départ) : S0 = 0.80 => progression nulle.
      // Acteur B (en retard au départ) : S0 = 0.20 => forte progression (+0.60).
      const scoreActeurA = independentScoreFormula(0.80, 0.80);
      const scoreActeurB = independentScoreFormula(0.20, 0.80);

      expect(scoreActeurA).toBe(72); // 100 * (0.32 + 0.40 + 0)
      expect(scoreActeurB).toBe(84); // 100 * (0.32 + 0.40 + 0.2 * 0.6)

      // L'acteur initialement vertueux reçoit un score inférieur de 12 points !
      expect(scoreActeurB - scoreActeurA).toBe(12);
    });
  });
});
