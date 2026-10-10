import type {
  CountryCode,
  PartyCode,
  LobbyCode,
  YearState,
  PartyResult,
  LobbyResult
} from '../domain/types';
import type { CountryTrajectoryData } from './countryTrajectories';

export const SIMULATION_YEARS = Array.from({ length: 10 }, (_, i) => 2025 + i);

/**
 * Construit les états annuels détaillés (YearState[]) pour chaque année de 2025 à 2034.
 */
export function buildYearlyStates(
  codes: CountryCode[],
  indicatorKeys: string[],
  countryResults: Record<CountryCode, CountryTrajectoryData>,
  partiesResults: Record<PartyCode, PartyResult>,
  lobbiesResults: Record<LobbyCode, LobbyResult>,
  euSeries: Record<string, number[]>,
  euSatisfaction: number[]
): YearState[] {
  const yearlyStates: YearState[] = [];

  for (let t = 0; t < 10; t++) {
    const countriesAtYear: any = {};
    for (const c of codes) {
      const vals: Record<string, number> = {};
      for (const k of indicatorKeys) {
        vals[k] = countryResults[c].values[k][t];
      }
      countriesAtYear[c] = {
        values: vals,
        satisfaction: countryResults[c].satisfaction[t]
      };
    }

    const partiesAtYear: any = {};
    for (const [pCode, pRes] of Object.entries(partiesResults)) {
      partiesAtYear[pCode] = {
        satisfaction: pRes.satisfactionArr[t],
        meps: pRes.mepsArr[t],
        commissaires: pRes.commissairesArr[t],
        conseil: pRes.conseilArr[t],
        pres: pRes.presArr[t]
      };
    }

    const lobbiesAtYear: any = {};
    for (const [lCode, lRes] of Object.entries(lobbiesResults)) {
      lobbiesAtYear[lCode] = {
        reputation: lRes.reputationArr[t],
        infEtats: lRes.infEtatsArr[t],
        infParlement: lRes.infParlementArr[t],
        infCommission: lRes.infCommissionArr[t]
      };
    }

    const euValuesAtYear: Record<string, number> = {};
    for (const k of indicatorKeys) {
      euValuesAtYear[k] = euSeries[k][t];
    }

    yearlyStates.push({
      year: SIMULATION_YEARS[t],
      eu: euValuesAtYear,
      euSatisfaction: euSatisfaction[t],
      countries: countriesAtYear,
      parties: partiesAtYear,
      lobbies: lobbiesAtYear
    });
  }

  return yearlyStates;
}
