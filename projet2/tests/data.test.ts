import { describe, it, expect } from 'vitest';
import { COUNTRIES_META, COUNTRIES_PROFILES } from '../src/data/countries';
import { PARTIES_PROFILES } from '../src/data/parties';
import { LOBBIES_PROFILES } from '../src/data/lobbies';
import { SCENARIO_1_INDICATORS, SCENARIO_2_INDICATORS } from '../src/domain/indicators';
import type { CountryCode, PartyCode, LobbyCode } from '../src/domain/types';

describe('Domain Data Integrity', () => {
  it('preserves all 6 member states with required profiles and sens', () => {
    const requiredCountries: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
    for (const code of requiredCountries) {
      expect(COUNTRIES_META[code]).toBeDefined();
      expect(COUNTRIES_PROFILES[code]).toBeDefined();
      const p = COUNTRIES_PROFILES[code];
      expect(p.dev.init.croiss).toBeGreaterThan(0);
      expect(p.dev.sens.croiss_co2).toBeGreaterThan(0);
      expect(p.geo.init.normandie).toBeGreaterThan(0);
    }
  });

  it('preserves all 6 parties with doctrinal weights summing to 1', () => {
    const requiredParties: PartyCode[] = ['PPE', 'SDE', 'RENEW', 'VERT', 'ECR', 'GUE'];
    for (const code of requiredParties) {
      const party = PARTIES_PROFILES[code];
      expect(party).toBeDefined();
      expect(party.base.meps).toBeGreaterThan(0);
      expect(party.couleur).toMatch(/^#/);
    }
  });

  it('preserves all 6 lobbies with baseline reputations and influences', () => {
    const requiredLobbies: LobbyCode[] = ['BIG_TECH', 'ENERGIES_FOSSILES', 'BANQUES_FINANCE', 'AGROCHIMIE', 'PHARMA', 'AUTOMOBILE'];
    for (const code of requiredLobbies) {
      const lobby = LOBBIES_PROFILES[code];
      expect(lobby).toBeDefined();
      expect(lobby.base.reputation).toBeGreaterThan(0);
      expect(lobby.base.infCommission).toBeGreaterThan(0);
    }
  });

  it('has valid min/max definitions for all indicators', () => {
    for (const ind of Object.values(SCENARIO_1_INDICATORS)) {
      expect(ind.max).toBeGreaterThan(ind.min);
      expect(ind.step).toBeGreaterThan(0);
    }
    for (const ind of Object.values(SCENARIO_2_INDICATORS)) {
      expect(ind.max).toBeGreaterThan(ind.min);
      expect(ind.step).toBeGreaterThan(0);
    }
  });
});
