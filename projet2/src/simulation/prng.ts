/**
 * Générateur Pseudo-Aléatoire Déterministe (Mulberry32).
 * Assure une reproductibilité stricte des simulations avec une graine donnée.
 */

export class PRNG {
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed >>> 0;
  }

  /**
   * Retourne un nombre pseudo-aléatoire dans l'intervalle [0, 1).
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Retourne une fluctuation centrée en 0 dans l'intervalle [-amplitude, +amplitude].
   */
  fluctuation(amplitude: number = 0.05): number {
    return (this.next() - 0.5) * 2 * amplitude;
  }

  /**
   * Réinitialise la graine.
   */
  reset(seed: number = 42): void {
    this.state = seed >>> 0;
  }
}
