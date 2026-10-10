import type { CountryCode, ScenarioId } from '../domain/types';
import type { ImplementationProvider } from '../domain/realizationTypes';
import { defaultImplementationProvider } from './realizationContract';
import { COUNTRIES_PROFILES } from '../data/countries';
import { normalizeValue } from '../domain/indicators';
import type { PRNG } from './prng';

export interface CountryTrajectoryData {
  values: Record<string, number[]>;
  satisfaction: number[];
}

/**
 * Calcule la projection temporelle sur 10 ans des indicateurs et de la satisfaction
 * pour l'ensemble des 6 États membres modélisés.
 * Intègre la dynamique annuelle explicable et l'interface de réalisation (Phase A).
 */
export function simulateCountryTrajectories(
  scenarioId: ScenarioId,
  inputs: Record<string, number>,
  prng: PRNG,
  codes: CountryCode[],
  provider: ImplementationProvider = defaultImplementationProvider
): Record<CountryCode, CountryTrajectoryData> {
  const countryResults: Record<CountryCode, CountryTrajectoryData> = {
    DE: { values: {}, satisfaction: [] },
    FR: { values: {}, satisfaction: [] },
    IT: { values: {}, satisfaction: [] },
    PL: { values: {}, satisfaction: [] },
    SE: { values: {}, satisfaction: [] },
    HU: { values: {}, satisfaction: [] }
  };

  if (scenarioId === 1) {
    codes.forEach(c => {
      countryResults[c].values = { croiss: [], gini: [], co2: [], veb: [] };
    });
  } else {
    codes.forEach(c => {
      countryResults[c].values = { normandie: [], vdem: [], pib: [], idh: [] };
    });
  }

  for (const c of codes) {
    const profile = COUNTRIES_PROFILES[c];

    if (scenarioId === 1) {
      const targetPib = inputs.pib_eu ?? profile.dev.init.croiss;
      const targetGini = inputs.gini_eu ?? profile.dev.init.gini;
      const targetCo2 = inputs.co2_eu ?? profile.dev.init.co2;
      const targetVeb = inputs.veb_eu ?? profile.dev.init.veb;

      // Impulsion initiale contractuelle à l'an 0 (2025)
      let croiss = profile.dev.init.croiss + 0.4 * (targetPib - profile.dev.init.croiss);
      let gini = profile.dev.init.gini + 0.3 * (targetGini - profile.dev.init.gini);
      let co2 = profile.dev.init.co2 + 0.3 * (targetCo2 - profile.dev.init.co2);
      let veb = profile.dev.init.veb + 0.3 * (targetVeb - profile.dev.init.veb);

      for (let t = 0; t < 10; t++) {
        if (t > 0) {
          const noise = prng.fluctuation(0.04);
          const rCo2 = provider.getRealization(c, 'co2', t).realizationRate;
          const rVeb = provider.getRealization(c, 'veb', t).realizationRate;
          const rGini = provider.getRealization(c, 'gini', t).realizationRate;
          const rPib = provider.getRealization(c, 'croiss', t).realizationRate;

          // Actions pérennes : investissements et décarbonation
          const actCo2 = targetCo2 < profile.dev.init.co2 ? -0.10 * (profile.dev.init.co2 - targetCo2) * rCo2 : 0;
          const actVeb = targetVeb > profile.dev.init.veb ? 0.08 * (targetVeb - profile.dev.init.veb) * rVeb : 0;
          const actGini = targetGini < profile.dev.init.gini ? -0.03 * (profile.dev.init.gini - targetGini) * rGini : 0;
          const actPib = targetPib > profile.dev.init.croiss ? 0.04 * (targetPib - profile.dev.init.croiss) * rPib : 0;

          // Dynamique annuelle explicable : contexte + action + perturbation
          co2 += profile.dev.sens.croiss_co2 * croiss + actCo2;
          veb += -profile.dev.sens.co2_veb * co2 + actVeb;
          gini += profile.dev.sens.veb_gini * ((100 - veb) / 100) + actGini;
          croiss += -profile.dev.sens.veb_croiss * (10 - veb / 10) + actPib + noise;
        }

        croiss = Math.max(0, Math.min(4, croiss));
        gini = Math.max(0.2, Math.min(0.6, gini));
        co2 = Math.max(2, Math.min(10, co2));
        veb = Math.max(0, Math.min(100, veb));

        countryResults[c].values.croiss.push(croiss);
        countryResults[c].values.gini.push(gini);
        countryResults[c].values.co2.push(co2);
        countryResults[c].values.veb.push(veb);

        const sat = profile.dev.pond.croiss * normalizeValue(croiss, 0, 4) +
                    profile.dev.pond.gini * (1 - normalizeValue(gini, 0.2, 0.6)) +
                    profile.dev.pond.co2 * (1 - normalizeValue(co2, 2, 10)) +
                    profile.dev.pond.veb * normalizeValue(veb, 0, 100);

        countryResults[c].satisfaction.push(Math.max(0, Math.min(1, sat)));
      }
    } else {
      const targetNorm = inputs.normandie_eu ?? profile.geo.init.normandie;
      const targetVdem = inputs.vdem_eu ?? profile.geo.init.vdem;
      const targetPib = inputs.pib_growth_eu ?? profile.geo.init.pib;
      const targetIdh = inputs.idh_eu ?? profile.geo.init.idh;

      // Impulsion initiale contractuelle à l'an 0 (2025)
      let normandie = profile.geo.init.normandie + 0.4 * (targetNorm - profile.geo.init.normandie);
      let vdem = profile.geo.init.vdem + 0.4 * (targetVdem - profile.geo.init.vdem);
      let pib = profile.geo.init.pib + 0.4 * (targetPib - profile.geo.init.pib);
      let idh = profile.geo.init.idh + 0.4 * (targetIdh - profile.geo.init.idh);

      for (let t = 0; t < 10; t++) {
        if (t > 0) {
          const noise = prng.fluctuation(0.04);
          const rNorm = provider.getRealization(c, 'normandie', t).realizationRate;
          const rVdem = provider.getRealization(c, 'vdem', t).realizationRate;
          const rPib = provider.getRealization(c, 'pib', t).realizationRate;
          const rIdh = provider.getRealization(c, 'idh', t).realizationRate;

          const actNorm = targetNorm > profile.geo.init.normandie ? 0.05 * (targetNorm - profile.geo.init.normandie) * rNorm : 0;
          const actVdem = targetVdem > profile.geo.init.vdem ? 0.04 * (targetVdem - profile.geo.init.vdem) * rVdem : 0;
          const actPib = targetPib > profile.geo.init.pib ? 0.03 * (targetPib - profile.geo.init.pib) * rPib : 0;
          const actIdh = targetIdh > profile.geo.init.idh ? 0.02 * (targetIdh - profile.geo.init.idh) * rIdh : 0;

          normandie += profile.geo.sens.norm_vdem * (vdem - 0.5) * 10 + actNorm;
          vdem += profile.geo.sens.vdem_norm * (normandie / 100 - 0.5) + actVdem;
          pib += profile.geo.sens.norm_pib * (normandie / 100 - 0.5) + actPib + noise;
          idh += profile.geo.sens.norm_idh * (normandie / 100 - 0.5) +
                 profile.geo.sens.pib_idh * (pib / 4 - 0.25) + actIdh;
        }

        normandie = Math.max(0, Math.min(100, normandie));
        vdem = Math.max(0, Math.min(1, vdem));
        pib = Math.max(-2, Math.min(4, pib));
        idh = Math.max(0, Math.min(1, idh));

        countryResults[c].values.normandie.push(normandie);
        countryResults[c].values.vdem.push(vdem);
        countryResults[c].values.pib.push(pib);
        countryResults[c].values.idh.push(idh);

        const sat = profile.geo.pond.normandie * normalizeValue(normandie, 0, 100) +
                    profile.geo.pond.vdem * normalizeValue(vdem, 0, 1) +
                    profile.geo.pond.pib * normalizeValue(pib, -2, 4) +
                    profile.geo.pond.idh * normalizeValue(idh, 0, 1);

        countryResults[c].satisfaction.push(Math.max(0, Math.min(1, sat)));
      }
    }
  }

  return countryResults;
}
