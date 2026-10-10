import { describe, it, expect } from 'vitest';
import { PRNG } from '../src/simulation/prng';

describe('PRNG Determinism', () => {
  it('generates identical sequences with the same seed', () => {
    const prng1 = new PRNG(42);
    const prng2 = new PRNG(42);

    const seq1 = Array.from({ length: 10 }, () => prng1.next());
    const seq2 = Array.from({ length: 10 }, () => prng2.next());

    expect(seq1).toEqual(seq2);
  });

  it('generates different sequences with different seeds', () => {
    const prng1 = new PRNG(42);
    const prng2 = new PRNG(99);

    const seq1 = Array.from({ length: 5 }, () => prng1.next());
    const seq2 = Array.from({ length: 5 }, () => prng2.next());

    expect(seq1).not.toEqual(seq2);
  });

  it('keeps fluctuations within requested amplitude', () => {
    const prng = new PRNG(123);
    for (let i = 0; i < 50; i++) {
      const fluc = prng.fluctuation(0.1);
      expect(fluc).toBeGreaterThanOrEqual(-0.1);
      expect(fluc).toBeLessThanOrEqual(0.1);
    }
  });
});
