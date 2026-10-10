import { describe, it, expect } from 'vitest';
import { runSimulation } from '../src/simulation/engine';
import {
  ReferenceImplementationProvider,
  ArtificialImplementationProvider
} from '../src/simulation/realizationContract';
import {
  computeSuccessScore,
  evaluateTriad,
  projectConservedSeats
} from '../src/simulation/successScores';
import type { CountryCode } from '../src/domain/types';

describe('Consolidation Phase A — Nouveau Moteur Mathématique', () => {
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];

  describe('1. Contrat de réalisation et Fournisseur de référence (Section 4)', () => {
    it('fournit des conditions de réalisation nationales cohérentes avec délais et montées en charge', () => {
      const provider = new ReferenceImplementationProvider();
      expect(provider.name).toBe('ReferenceNationalImplementationProvider');
      expect(provider.version).toBe('1.0.0-PhaseA');

      // Allemagne (DE) : délai 0, capacité forte
      const deY0 = provider.getRealization('DE', 'co2', 0);
      const deY9 = provider.getRealization('DE', 'co2', 9);
      expect(deY0.delayYears).toBe(0);
      expect(deY9.realizationRate).toBeGreaterThan(deY0.realizationRate);
      expect(deY9.realizationRate).toBeLessThanOrEqual(1.0);

      // Hongrie (HU) : délai d\'inertie 1 an
      const huY0 = provider.getRealization('HU', 'co2', 0);
      expect(huY0.delayYears).toBe(1);
    });

    it('permet la substitution transparente par un fournisseur artificiel (test de raccordement Phase B)', () => {
      // Fournisseur bridé à 50% de réalisation
      const halfProvider = new ArtificialImplementationProvider(0.5, 0, 'HalfSpeedProvider');
      const resHalf = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.5, gini_eu: 0.25, co2_eu: 4.0, veb_eu: 90.0 },
        seed: 42,
        implementationProvider: halfProvider
      });

      // Fournisseur standard de référence
      const resFull = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.5, gini_eu: 0.25, co2_eu: 4.0, veb_eu: 90.0 },
        seed: 42
      });

      expect(resHalf.years.length).toBe(10);
      expect(resHalf.euSatisfaction.length).toBe(10);
      // Le fournisseur standard obtient une décarbonation plus forte et donc une satisfaction finale supérieure
      expect(resFull.euSatisfaction[9]).toBeGreaterThan(resHalf.euSatisfaction[9]);
    });
  });

  describe('2. Trajectoire contrefactuelle et Gain net face à la référence (Section 3.6)', () => {
    it('calcule un gain net nul lorsque la politique correspond exactement au statu quo', () => {
      const resStatuQuo = runSimulation({
        scenarioId: 1,
        inputs: {}, // Statu quo pur sans impulsion politique
        seed: 42
      });

      expect(resStatuQuo.euNetGainVsReference).toBe(0);
      for (const c of codes) {
        expect(resStatuQuo.countries[c].netGainVsReference).toBe(0);
      }
    });

    it('isole le gain net positif d\'une directive verte par rapport au contrefactuel', () => {
      const resVerte = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.0, gini_eu: 0.26, co2_eu: 4.5, veb_eu: 88.0 },
        seed: 42
      });

      // Le gain net face au statu quo doit être positif
      expect(resVerte.euNetGainVsReference).toBeGreaterThan(0);
      expect(resVerte.baselineEUFinalSatisfaction).toBeDefined();
      expect(resVerte.euSatisfaction[9]).toBeGreaterThan(resVerte.baselineEUFinalSatisfaction!);
    });
  });

  describe('3. Évaluation triadique et Répartition des sièges (Section 3.6)', () => {
    it('garantit le bornage strict du score synthétique dans [0, 100]', () => {
      const scoreEffondrement = computeSuccessScore(1.0, 0.0, true);
      const scoreTriomphe = computeSuccessScore(0.0, 1.0, true);

      expect(scoreEffondrement).toBe(0); // Borne inférieure hermétique
      expect(scoreTriomphe).toBe(92);
      expect(scoreEffondrement).toBeGreaterThanOrEqual(0);
      expect(scoreTriomphe).toBeLessThanOrEqual(100);
    });

    it('produit une évaluation triadique complète et explicable pour les élèves', () => {
      const triad = evaluateTriad(0.50, 0.85, 0.45);
      expect(triad.finalSatisfaction).toBe(0.85);
      expect(triad.progression).toBeCloseTo(0.35, 3);
      expect(triad.netGainVsReference).toBeCloseTo(0.40, 3);
      expect(triad.syntheticScore).toBeGreaterThan(0);
    });

    it('projette exactement 720 sièges au Parlement avec attribution des restes déterministe', () => {
      const res = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 6.0, veb_eu: 80.0 },
        seed: 42
      });

      const allocated720 = projectConservedSeats(res.parties, 720);
      const totalMeps = Object.values(allocated720).reduce((a, b) => a + b, 0);

      expect(totalMeps).toBe(720);
      expect(allocated720.PPE).toBeGreaterThan(allocated720.GUE);
    });
  });

  describe('4. Persistance des actions annuelles sur 2025-2034 (Section 3.3)', () => {
    it('maintient les efforts de décarbonation dans la durée au lieu de s\'effondrer après t=0', () => {
      const resAmbitieux = runSimulation({
        scenarioId: 1,
        inputs: { pib_eu: 2.2, gini_eu: 0.27, co2_eu: 3.5, veb_eu: 90.0 },
        seed: 42
      });

      const deCO2 = resAmbitieux.countries.DE.series.co2;
      // Pour l'Allemagne avec politique verte forte, le CO2 à t=9 reste largement inférieur au CO2 historique initial (7.0)
      expect(deCO2[9]).toBeLessThan(7.0);
    });
  });
});
