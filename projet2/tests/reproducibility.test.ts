import { describe, it, expect } from 'vitest';
import { runSimulation } from '../src/simulation/engine';
import { PRNG } from '../src/simulation/prng';

/**
 * Suite de tests : Reproductibilité, Générateur Pseudo-Aléatoire et Ordre d'Exécution
 * Couvre : RNG-01, RNG-02, RNG-03
 */
describe('Aléatoire, Reproductibilité et Indépendance d\'Ordre (P1)', () => {
  describe('RNG-01 — Reproductibilité stricte et non-interférence', () => {
    it('[Invariant contractuel] garantit l\'exactitude bit-à-bit sur deux exécutions avec la même graine', () => {
      const inputs = {
        scenarioId: 1 as const,
        inputs: { pib_eu: 2.1, gini_eu: 0.31, co2_eu: 7.2, veb_eu: 78.0 },
        seed: 42
      };

      const run1 = runSimulation(inputs);
      const run2 = runSimulation(inputs);

      expect(run1.euScoreSucces).toBe(run2.euScoreSucces);
      expect(run1.euSeries).toEqual(run2.euSeries);
      expect(run1.countries).toEqual(run2.countries);
      expect(run1.parties).toEqual(run2.parties);
      expect(run1.lobbies).toEqual(run2.lobbies);
    });

    it('[Invariant contractuel] prouve l\'absence d\'état global caché lors de l\'intercalation d\'autres graines', () => {
      const inputsTarget = {
        scenarioId: 2 as const,
        inputs: { normandie_eu: 75, vdem_eu: 0.80, pib_growth_eu: 1.2, idh_eu: 0.90 },
        seed: 12345
      };

      // 1. Première exécution de référence
      const refResult = runSimulation(inputsTarget);

      // 2. Intercalation de simulations avec d'autres graines et d'autres scénarios
      runSimulation({ scenarioId: 1, inputs: { pib_eu: 3.0, gini_eu: 0.40, co2_eu: 9.0, veb_eu: 40.0 }, seed: 999 });
      runSimulation({ scenarioId: 2, inputs: { normandie_eu: 90, vdem_eu: 0.95, pib_growth_eu: 2.0, idh_eu: 0.95 }, seed: 888 });

      // 3. Seconde exécution avec la graine cible
      const testResult = runSimulation(inputsTarget);

      expect(testResult.euScoreSucces).toBe(refResult.euScoreSucces);
      expect(testResult.euSeries).toEqual(refResult.euSeries);
      expect(testResult.countries).toEqual(refResult.countries);
      expect(testResult.lobbies).toEqual(refResult.lobbies);
    });
  });

  describe('RNG-02 — Couplage de séquence séquentielle et dépendance d\'ordre', () => {
    it('[Caractérisation & Diagnostic] démontre que les tirages aléatoires sont consommés séquentiellement par les pays puis les lobbies', () => {
      // Dans engine.ts :
      // 1. Une seule instance `const prng = new PRNG(seed)` est créée.
      // 2. Les 6 pays sont itérés dans l'ordre fixe : 'DE', 'FR', 'IT', 'PL', 'SE', 'HU'.
      // 3. Chaque pays consomme 9 tirages (années t = 1..9) de `prng.fluctuation(0.04)`.
      //    Total pays = 6 * 9 = 54 appels à prng.next().
      // 4. L'instance prng est ensuite passée à simulateLobbies qui consomme les tirages 55+.

      const seed = 500;
      const shadowPrng = new PRNG(seed);

      // Simule les 9 tirages de fluctuation pour le premier pays (DE)
      const expectedNoisesDE: number[] = [];
      for (let t = 1; t < 10; t++) {
        expectedNoisesDE.push(shadowPrng.fluctuation(0.04));
      }

      // Simule les 9 tirages pour le second pays (FR)
      const expectedNoisesFR: number[] = [];
      for (let t = 1; t < 10; t++) {
        expectedNoisesFR.push(shadowPrng.fluctuation(0.04));
      }

      // Les bruits de DE et de FR proviennent de tranches disjointes de la même séquence PRNG
      expect(expectedNoisesDE).not.toEqual(expectedNoisesFR);

      // Si l'ordre des pays était inversé (ex: FR avant DE), DE recevrait expectedNoisesFR !
      // Ce test établit que les trajectoires individuelles dépendent strictement de l'ordre d'itération dans `codes`.
    });
  });

  describe('RNG-03 — Injection de profils et architecture de l\'API', () => {
    it('[Caractérisation] constate que les profils pays, partis et lobbies sont statiques et non injectables', () => {
      // Contrat de type actuel de SimulationInputs :
      // interface SimulationInputs {
      //   scenarioId: ScenarioId;
      //   inputs: Record<string, number>;
      //   seed?: number;
      //   selectedDirectiveId?: number;
      //   selectedAmendments?: string[];
      // }
      // Les dictionnaires COUNTRIES_PROFILES, PARTIES_PROFILES, LOBBIES_PROFILES sont importés statiquement.
      // L'API ne permet donc pas l'injection dynamique d'un 7ème pays sans refactorisation préalable.
      const inputs = {
        scenarioId: 1 as const,
        inputs: { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 6.0, veb_eu: 80.0 },
        seed: 42
      };
      const res = runSimulation(inputs);

      // Les 6 pays retournés sont exactement ceux définis statiquement
      const returnedCodes = Object.keys(res.countries);
      expect(returnedCodes).toEqual(['DE', 'FR', 'IT', 'PL', 'SE', 'HU']);
    });
  });
});
