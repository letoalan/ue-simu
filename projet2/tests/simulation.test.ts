import { describe, it, expect } from 'vitest';
import { runSimulation } from '../src/simulation/engine';
import { getCountryDemographicWeights } from '../src/data/countries';
import type { CountryCode } from '../src/domain/types';

describe('Unified Simulation Engine', () => {
  it('runs scenario 1 cleanly and yields 10 years of data', () => {
    const result = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 2.2, gini_eu: 0.28, co2_eu: 6.5, veb_eu: 85 },
      seed: 42
    });

    expect(result.years.length).toBe(10);
    expect(result.yearlyStates.length).toBe(10);
    expect(result.euSatisfaction.length).toBe(10);
    expect(result.euScoreSucces).toBeGreaterThanOrEqual(0);
    expect(result.euScoreSucces).toBeLessThanOrEqual(100);

    // Vérifie les 6 pays
    const countryCodes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
    for (const code of countryCodes) {
      expect(result.countries[code]).toBeDefined();
      expect(result.countries[code].satisfaction.length).toBe(10);
      expect(result.countries[code].series.croiss.length).toBe(10);
      expect(result.countries[code].series.co2.length).toBe(10);
    }

    // Vérifie les 6 partis
    expect(Object.keys(result.parties).length).toBe(6);
    for (const party of Object.values(result.parties)) {
      expect(party.satisfactionArr.length).toBe(10);
      expect(party.mepsArr.length).toBe(10);
      expect(party.scoreVictoire).toBeGreaterThanOrEqual(0);
      expect(party.scoreVictoire).toBeLessThanOrEqual(100);
    }

    // Vérifie les 6 lobbies
    expect(Object.keys(result.lobbies).length).toBe(6);
    for (const lobby of Object.values(result.lobbies)) {
      expect(lobby.reputationArr.length).toBe(10);
      expect(lobby.infCommissionArr.length).toBe(10);
      expect(lobby.scoreDeReussite).toBeGreaterThanOrEqual(0);
      expect(lobby.scoreDeReussite).toBeLessThanOrEqual(100);
    }
  });

  it('proves exact mathematical coupling: EU series is weighted mean of countries', () => {
    const result = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 2.0, gini_eu: 0.30, co2_eu: 7.0, veb_eu: 80 },
      seed: 42
    });

    const weights = getCountryDemographicWeights();
    const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];

    for (let t = 0; t < 10; t++) {
      let expectedCo2 = 0;
      for (const c of codes) {
        expectedCo2 += result.countries[c].series.co2[t] * weights[c];
      }
      expect(result.euSeries.co2[t]).toBeCloseTo(expectedCo2, 5);
    }
  });

  it('strictly reproduces identical results when using the same seed', () => {
    const resA = runSimulation({
      scenarioId: 2,
      inputs: { normandie_eu: 80, vdem_eu: 0.85, pib_growth_eu: 1.5, idh_eu: 0.90 },
      seed: 100
    });

    const resB = runSimulation({
      scenarioId: 2,
      inputs: { normandie_eu: 80, vdem_eu: 0.85, pib_growth_eu: 1.5, idh_eu: 0.90 },
      seed: 100
    });

    expect(resA.euScoreSucces).toBe(resB.euScoreSucces);
    expect(resA.euSeries.normandie).toEqual(resB.euSeries.normandie);
    expect(resA.countries.DE.satisfaction).toEqual(resB.countries.DE.satisfaction);
  });

  it('guarantees strict mathematical clamping within bounds across all countries and years (S1 & S2)', () => {
    // Test sous conditions extrêmes
    const resS1 = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 10.0, gini_eu: 0.9, co2_eu: 20.0, veb_eu: -50 },
      seed: 7
    });

    const countryCodes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
    for (const c of countryCodes) {
      for (let t = 0; t < 10; t++) {
        const croiss = resS1.countries[c].series.croiss[t];
        const gini = resS1.countries[c].series.gini[t];
        const co2 = resS1.countries[c].series.co2[t];
        const veb = resS1.countries[c].series.veb[t];

        expect(croiss).toBeGreaterThanOrEqual(0);
        expect(croiss).toBeLessThanOrEqual(4);

        expect(gini).toBeGreaterThanOrEqual(0.2);
        expect(gini).toBeLessThanOrEqual(0.6);

        expect(co2).toBeGreaterThanOrEqual(2);
        expect(co2).toBeLessThanOrEqual(10);

        expect(veb).toBeGreaterThanOrEqual(0);
        expect(veb).toBeLessThanOrEqual(100);
      }
    }

    const resS2 = runSimulation({
      scenarioId: 2,
      inputs: { normandie_eu: 150, vdem_eu: 2.0, pib_growth_eu: -10, idh_eu: 1.5 },
      seed: 7
    });

    for (const c of countryCodes) {
      for (let t = 0; t < 10; t++) {
        const norm = resS2.countries[c].series.normandie[t];
        const vdem = resS2.countries[c].series.vdem[t];
        const pib = resS2.countries[c].series.pib[t];
        const idh = resS2.countries[c].series.idh[t];

        expect(norm).toBeGreaterThanOrEqual(0);
        expect(norm).toBeLessThanOrEqual(100);

        expect(vdem).toBeGreaterThanOrEqual(0);
        expect(vdem).toBeLessThanOrEqual(1);

        expect(pib).toBeGreaterThanOrEqual(-2);
        expect(pib).toBeLessThanOrEqual(4);

        expect(idh).toBeGreaterThanOrEqual(0);
        expect(idh).toBeLessThanOrEqual(1);
      }
    }
  });

  it('proves exact mathematical coupling in Scenario 2 (weighted demographic aggregation)', () => {
    const res = runSimulation({
      scenarioId: 2,
      inputs: { normandie_eu: 82, vdem_eu: 0.88, pib_growth_eu: 1.8, idh_eu: 0.94 },
      seed: 42
    });

    const weights = getCountryDemographicWeights();
    const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];

    for (let t = 0; t < 10; t++) {
      let expNorm = 0;
      let expVdem = 0;
      let expPib = 0;
      let expIdh = 0;

      for (const c of codes) {
        expNorm += res.countries[c].series.normandie[t] * weights[c];
        expVdem += res.countries[c].series.vdem[t] * weights[c];
        expPib += res.countries[c].series.pib[t] * weights[c];
        expIdh += res.countries[c].series.idh[t] * weights[c];
      }

      expect(res.euSeries.normandie[t]).toBeCloseTo(expNorm, 5);
      expect(res.euSeries.vdem[t]).toBeCloseTo(expVdem, 5);
      expect(res.euSeries.pib[t]).toBeCloseTo(expPib, 5);
      expect(res.euSeries.idh[t]).toBeCloseTo(expIdh, 5);
    }
  });

  it('validates party ideological sensitivity and electoral dynamics (re-elections)', () => {
    // Simulation très verte
    const greenResult = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 1.5, gini_eu: 0.25, co2_eu: 2.5, veb_eu: 95 },
      seed: 42
    });

    // Simulation productiviste fossile
    const fossilResult = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 3.8, gini_eu: 0.45, co2_eu: 9.5, veb_eu: 20 },
      seed: 42
    });

    // Les Verts doivent avoir une satisfaction et un score de victoire nettement plus élevés dans la simulation verte
    expect(greenResult.parties.VERT.satisfactionMoyenne).toBeGreaterThan(fossilResult.parties.VERT.satisfactionMoyenne);
    expect(greenResult.parties.VERT.scoreVictoire).toBeGreaterThan(fossilResult.parties.VERT.scoreVictoire);
    expect(greenResult.parties.VERT.mepsArr[9]).toBeGreaterThan(fossilResult.parties.VERT.mepsArr[9]);

    // La Gauche (GUE) doit être pénalisée quand les inégalités (Gini) explosent
    expect(greenResult.parties.GUE.satisfactionMoyenne).toBeGreaterThan(fossilResult.parties.GUE.satisfactionMoyenne);
  });

  it('validates lobby reputation, influence and rivalries', () => {
    const greenResult = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 2.0, gini_eu: 0.25, co2_eu: 2.5, veb_eu: 95 },
      seed: 42
    });

    const fossilResult = runSimulation({
      scenarioId: 1,
      inputs: { pib_eu: 3.5, gini_eu: 0.40, co2_eu: 9.5, veb_eu: 25 },
      seed: 42
    });

    // L'industrie des énergies fossiles doit avoir une meilleure influence dans la simulation fossile que dans la simulation verte
    expect(fossilResult.lobbies.ENERGIES_FOSSILES.scoreDeReussite)
      .toBeGreaterThan(greenResult.lobbies.ENERGIES_FOSSILES.scoreDeReussite);
  });
});
