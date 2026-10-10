import type { CountryCode } from '../domain/types';
import type { ActionRealization, ImplementationProvider } from '../domain/realizationTypes';
import type { FinancialAgreement } from '../domain/financeTypes';

export class FinancialImplementationProvider implements ImplementationProvider {
  readonly name = 'FinancialImplementationProvider';
  readonly version = '2.0.0-PhaseB';
  private agreement: FinancialAgreement | null;

  private static readonly BASE_CAPACITIES: Record<CountryCode, { baseRate: number; delay: number }> = {
    DE: { baseRate: 0.95, delay: 0 },
    SE: { baseRate: 0.98, delay: 0 },
    FR: { baseRate: 0.90, delay: 0 },
    IT: { baseRate: 0.82, delay: 1 },
    PL: { baseRate: 0.80, delay: 1 },
    HU: { baseRate: 0.75, delay: 1 }
  };

  constructor(agreement: FinancialAgreement | null = null) {
    this.agreement = agreement;
  }

  getRealization(country: CountryCode, actionKey: string, year: number): ActionRealization {
    const profile = FinancialImplementationProvider.BASE_CAPACITIES[country] ?? { baseRate: 0.85, delay: 0 };
    
    // Si aucun accord financier n'a été voté : retombée sur moyens nationaux seuls
    if (!this.agreement || !this.agreement.adopted) {
      const effectiveYear = Math.max(0, year - profile.delay);
      const rampUp = Math.min(1.0, 0.60 + (effectiveYear / 9) * 0.25);
      const rate = Math.min(1.0, Math.max(0.0, profile.baseRate * 0.75 * rampUp));
      return {
        country,
        actionKey,
        year,
        realizationRate: Math.round(rate * 1000) / 1000,
        delayYears: profile.delay,
        maintenanceRate: 0.85,
        sourceVersion: 'PhaseB-NationalOnly'
      };
    }

    // Accord financier européen adopté : modulation par le taux de couverture
    const countryData = this.agreement.breakdown[country];
    const covRate = countryData?.coverageRate ?? 0.70;

    // Réduction de délai si forte solidarité financière (>= 75% couverture)
    const effectiveDelay = covRate >= 0.75 ? Math.max(0, profile.delay - 1) : profile.delay;
    const effectiveYear = Math.max(0, year - effectiveDelay);

    // Multiplicateur de réalisation selon la couverture financière
    const financeMultiplier = Math.min(1.15, 0.40 + 0.60 * covRate);
    const rampUp = Math.min(1.0, 0.70 + (effectiveYear / 9) * 0.30);
    const realizationRate = Math.min(1.0, Math.max(0.0, profile.baseRate * financeMultiplier * rampUp));

    return {
      country,
      actionKey,
      year,
      realizationRate: Math.round(realizationRate * 1000) / 1000,
      delayYears: effectiveDelay,
      maintenanceRate: Math.min(1.0, 0.85 + 0.15 * covRate),
      sourceVersion: `PhaseB-Fund-${this.agreement.proposal.envelope}B`
    };
  }
}
