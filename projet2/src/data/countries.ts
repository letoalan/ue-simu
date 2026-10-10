import type { CountryCode, CountryMeta, CountryProfile } from '../domain/types';

export const COUNTRIES_META: Record<CountryCode, CountryMeta> = {
  DE: {
    code: 'DE',
    name: 'Allemagne',
    population: 84.3,
    flagUrl: './medias/images/flags/allemagne.jpg'
  },
  FR: {
    code: 'FR',
    name: 'France',
    population: 64.7,
    flagUrl: './medias/images/flags/france.jpg'
  },
  IT: {
    code: 'IT',
    name: 'Italie',
    population: 58.9,
    flagUrl: './medias/images/flags/italie.jpg'
  },
  PL: {
    code: 'PL',
    name: 'Pologne',
    population: 38.0,
    flagUrl: './medias/images/flags/pologne.jpg'
  },
  SE: {
    code: 'SE',
    name: 'Suède',
    population: 10.5,
    flagUrl: './medias/images/flags/suede.jpg'
  },
  HU: {
    code: 'HU',
    name: 'Hongrie',
    population: 9.6,
    flagUrl: './medias/images/flags/hongrie.jpg'
  }
};

export const COUNTRIES_PROFILES: Record<CountryCode, CountryProfile> = {
  DE: {
    name: 'Allemagne',
    code: 'DE',
    population: 84.3,
    dev: {
      init: { croiss: 1.5, gini: 0.29, co2: 7.0, veb: 85 },
      sens: { croiss_co2: 0.13, co2_veb: 0.10, veb_gini: 0.06, veb_croiss: 0.07 },
      pond: { croiss: 0.21, gini: 0.25, co2: 0.18, veb: 0.18 }
    },
    geo: {
      init: { normandie: 85, vdem: 0.88, pib: 1.5, idh: 0.94 },
      sens: { norm_vdem: 0.10, vdem_norm: 0.10, norm_pib: 0.09, norm_idh: 0.08, pib_idh: 0.07 },
      pond: { normandie: 0.28, vdem: 0.21, pib: 0.19, idh: 0.18 }
    }
  },
  FR: {
    name: 'France',
    code: 'FR',
    population: 64.7,
    dev: {
      init: { croiss: 1.2, gini: 0.32, co2: 5.0, veb: 80 },
      sens: { croiss_co2: 0.12, co2_veb: 0.11, veb_gini: 0.07, veb_croiss: 0.09 },
      pond: { croiss: 0.20, gini: 0.27, co2: 0.18, veb: 0.17 }
    },
    geo: {
      init: { normandie: 80, vdem: 0.85, pib: 1.2, idh: 0.92 },
      sens: { norm_vdem: 0.10, vdem_norm: 0.10, norm_pib: 0.08, norm_idh: 0.09, pib_idh: 0.07 },
      pond: { normandie: 0.26, vdem: 0.22, pib: 0.18, idh: 0.18 }
    }
  },
  PL: {
    name: 'Pologne',
    code: 'PL',
    population: 38.0,
    dev: {
      init: { croiss: 2.8, gini: 0.31, co2: 8.0, veb: 70 },
      sens: { croiss_co2: 0.18, co2_veb: 0.13, veb_gini: 0.08, veb_croiss: 0.10 },
      pond: { croiss: 0.28, gini: 0.20, co2: 0.16, veb: 0.14 }
    },
    geo: {
      init: { normandie: 75, vdem: 0.77, pib: 2.8, idh: 0.89 },
      sens: { norm_vdem: 0.08, vdem_norm: 0.08, norm_pib: 0.11, norm_idh: 0.09, pib_idh: 0.09 },
      pond: { normandie: 0.30, vdem: 0.18, pib: 0.22, idh: 0.12 }
    }
  },
  IT: {
    name: 'Italie',
    code: 'IT',
    population: 58.9,
    dev: {
      init: { croiss: 0.8, gini: 0.35, co2: 6.0, veb: 75 },
      sens: { croiss_co2: 0.11, co2_veb: 0.14, veb_gini: 0.09, veb_croiss: 0.12 },
      pond: { croiss: 0.18, gini: 0.28, co2: 0.17, veb: 0.17 }
    },
    geo: {
      init: { normandie: 70, vdem: 0.80, pib: 0.8, idh: 0.90 },
      sens: { norm_vdem: 0.09, vdem_norm: 0.09, norm_pib: 0.10, norm_idh: 0.10, pib_idh: 0.08 },
      pond: { normandie: 0.22, vdem: 0.19, pib: 0.19, idh: 0.20 }
    }
  },
  SE: {
    name: 'Suède',
    code: 'SE',
    population: 10.5,
    dev: {
      init: { croiss: 1.7, gini: 0.25, co2: 3.0, veb: 95 },
      sens: { croiss_co2: 0.07, co2_veb: 0.07, veb_gini: 0.05, veb_croiss: 0.06 },
      pond: { croiss: 0.15, gini: 0.30, co2: 0.15, veb: 0.25 }
    },
    geo: {
      init: { normandie: 90, vdem: 0.92, pib: 1.7, idh: 0.96 },
      sens: { norm_vdem: 0.12, vdem_norm: 0.13, norm_pib: 0.07, norm_idh: 0.10, pib_idh: 0.10 },
      pond: { normandie: 0.24, vdem: 0.27, pib: 0.13, idh: 0.22 }
    }
  },
  HU: {
    name: 'Hongrie',
    code: 'HU',
    population: 9.6,
    dev: {
      init: { croiss: 1.0, gini: 0.39, co2: 6.5, veb: 65 },
      sens: { croiss_co2: 0.19, co2_veb: 0.16, veb_gini: 0.11, veb_croiss: 0.13 },
      pond: { croiss: 0.28, gini: 0.15, co2: 0.13, veb: 0.13 }
    },
    geo: {
      init: { normandie: 60, vdem: 0.66, pib: 1.0, idh: 0.86 },
      sens: { norm_vdem: 0.15, vdem_norm: 0.15, norm_pib: 0.13, norm_idh: 0.13, pib_idh: 0.13 },
      pond: { normandie: 0.19, vdem: 0.22, pib: 0.22, idh: 0.13 }
    }
  }
};

/**
 * Poids démographiques relatifs des 6 États membres dans l'échantillon.
 */
export function getCountryDemographicWeights(): Record<CountryCode, number> {
  const total = Object.values(COUNTRIES_META).reduce((sum, c) => sum + c.population, 0);
  const weights = {} as Record<CountryCode, number>;
  for (const [code, meta] of Object.entries(COUNTRIES_META)) {
    weights[code as CountryCode] = meta.population / total;
  }
  return weights;
}
