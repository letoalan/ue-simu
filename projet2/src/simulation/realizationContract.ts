import type { CountryCode } from '../domain/types';
import type { ActionRealization, ImplementationProvider } from '../domain/realizationTypes';

/**
 * Fournisseur de réalisation de référence pour la Phase A.
 * Modélise les capacités administratives et d'investissement conventionnelles
 * des 6 États membres sans exiger ni simuler de fonds monétaire (Phase B).
 */
export class ReferenceImplementationProvider implements ImplementationProvider {
  readonly name = 'ReferenceNationalImplementationProvider';
  readonly version = '1.0.0-PhaseA';

  // Coefficients conventionnels de capacité institutionnelle et d'inertie
  private static readonly COUNTRY_CAPACITIES: Record<CountryCode, { baseRate: number; delay: number }> = {
    DE: { baseRate: 0.95, delay: 0 },
    SE: { baseRate: 0.98, delay: 0 },
    FR: { baseRate: 0.90, delay: 0 },
    IT: { baseRate: 0.82, delay: 1 },
    PL: { baseRate: 0.80, delay: 1 },
    HU: { baseRate: 0.75, delay: 1 }
  };

  getRealization(country: CountryCode, actionKey: string, year: number): ActionRealization {
    const profile = ReferenceImplementationProvider.COUNTRY_CAPACITIES[country] ?? { baseRate: 0.85, delay: 0 };
    const effectiveYear = Math.max(0, year - profile.delay);

    // Montée en charge progressive selon le temps (apprentissage et déploiement)
    const rampUp = Math.min(1.0, 0.70 + (effectiveYear / 9) * 0.30);
    const realizationRate = Math.min(1.0, Math.max(0.0, profile.baseRate * rampUp));

    return {
      country,
      actionKey,
      year,
      realizationRate: Math.round(realizationRate * 1000) / 1000,
      delayYears: profile.delay,
      maintenanceRate: 0.95,
      sourceVersion: this.version
    };
  }
}

/**
 * Fournisseur artificiel paramétrable pour tests et stress-tests.
 */
export class ArtificialImplementationProvider implements ImplementationProvider {
  readonly name: string;
  readonly version = 'test-mock';
  private rate: number;
  private delay: number;

  constructor(rate = 1.0, delay = 0, name = 'ArtificialMockProvider') {
    this.rate = rate;
    this.delay = delay;
    this.name = name;
  }

  getRealization(country: CountryCode, actionKey: string, year: number): ActionRealization {
    const effectiveRate = year < this.delay ? 0 : this.rate;
    return {
      country,
      actionKey,
      year,
      realizationRate: effectiveRate,
      delayYears: this.delay,
      maintenanceRate: 1.0,
      sourceVersion: this.version
    };
  }
}

export const defaultImplementationProvider = new ReferenceImplementationProvider();
