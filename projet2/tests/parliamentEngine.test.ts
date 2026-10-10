import { describe, it, expect } from 'vitest';
import { runSimulation } from '../src/simulation/engine';
import { TOTAL_PARLIAMENT_SEATS, MAJORITY_THRESHOLD } from '../src/simulation/parliamentCoalitions';

describe('Parlement Européen : Moteur Électoral 720 Sièges (P0)', () => {
  it('conserve rigoureusement 720 sièges au total pour chaque année', () => {
    const sim = runSimulation({ scenarioId: 1, inputs: {} });
    expect(sim.parliament).toBeDefined();

    const parliament = sim.parliament!;
    expect(parliament.totalSeats).toBe(TOTAL_PARLIAMENT_SEATS);
    expect(parliament.majorityThreshold).toBe(MAJORITY_THRESHOLD);

    // Vérifie la somme des sièges pour chaque année de 0 à 9
    for (let t = 0; t < 10; t++) {
      const totalYearT = parliament.groupList.reduce((sum, g) => sum + g.seatsArr[t], 0);
      expect(totalYearT).toBe(720);
    }
  });

  it('calcule la progression ou régression de chaque parti avec delta et pourcentage', () => {
    const sim = runSimulation({ scenarioId: 1, inputs: {} });
    const parliament = sim.parliament!;

    let sumCurrent = 0;
    for (const g of parliament.groupList) {
      expect(g.delta).toBe(g.currentSeats - g.baseSeats);
      expect(g.percent).toBeCloseTo((g.currentSeats / 720) * 100, 1);
      sumCurrent += g.currentSeats;
    }
    expect(sumCurrent).toBe(720);
  });

  it('ordonne les groupes de gauche à droite dans l\'hémicycle', () => {
    const sim = runSimulation({ scenarioId: 1, inputs: {} });
    const parliament = sim.parliament!;

    const codes = parliament.groupList.map(g => g.code);
    expect(codes).toEqual(['GUE', 'SDE', 'VERT', 'RENEW', 'PPE', 'ECR', 'OTHERS']);
  });

  it('calcule les coalitions et détecte la majorité absolue à 361 sièges', () => {
    const sim = runSimulation({ scenarioId: 1, inputs: {} });
    const parliament = sim.parliament!;

    expect(parliament.coalitions.length).toBeGreaterThan(0);
    for (const c of parliament.coalitions) {
      if (c.seats >= 361) {
        expect(c.hasMajority).toBe(true);
      } else {
        expect(c.hasMajority).toBe(false);
      }
    }
  });
});
