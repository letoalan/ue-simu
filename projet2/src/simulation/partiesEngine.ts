import type { PartyCode, PartyProfile, PartyResult, ScenarioId } from '../domain/types';
import { normalizeValue } from '../domain/indicators';

export function simulateParties(
  statsUE: {
    pibArr: number[];
    giniArr: number[];
    co2Arr: number[];
    vebArr: number[];
    stabArr: number[];
    demArr: number[];
    idhArr: number[];
  },
  partiesProfiles: Record<PartyCode, PartyProfile>,
  scenarioId: ScenarioId
): Record<PartyCode, PartyResult> {
  const results = {} as Record<PartyCode, PartyResult>;

  for (const [codeStr, party] of Object.entries(partiesProfiles)) {
    const code = codeStr as PartyCode;
    const pond = party.pond;
    const satisfactionArr: number[] = [];

    for (let i = 0; i < 10; i++) {
      const norm = {
        pib: normalizeValue(statsUE.pibArr[i] ?? 0, -2, 4),
        gini: normalizeValue(statsUE.giniArr[i] ?? 0.3, 0.2, 0.6),
        co2: normalizeValue(statsUE.co2Arr[i] ?? 4, 2, 10),
        veb: normalizeValue(statsUE.vebArr[i] ?? 80, 0, 100),
        stab: normalizeValue(statsUE.stabArr[i] ?? 80, 0, 100),
        dem: normalizeValue(statsUE.demArr[i] ?? 0.85, 0, 1),
        idh: normalizeValue(statsUE.idhArr[i] ?? 0.92, 0, 1)
      };

      let s = 0;
      let totalPoids = 0;

      if (scenarioId === 1) {
        s = pond.pib * norm.pib +
            pond.gini * (1 - norm.gini) +
            pond.co2 * (1 - norm.co2) +
            pond.veb * norm.veb;
        totalPoids = pond.pib + pond.gini + pond.co2 + pond.veb;
      } else {
        s = pond.pib * norm.pib +
            pond.stab * norm.stab +
            pond.dem * norm.dem +
            pond.idh * norm.idh;
        totalPoids = pond.pib + pond.stab + pond.dem + pond.idh;
      }

      s = totalPoids > 0 ? s / totalPoids : 0.5;

      // Spécificités doctrinales par groupe politique
      switch (code) {
        case 'VERT': {
          const ecoMultiplier = norm.veb * (1 - norm.co2);
          s *= ecoMultiplier;
          if (norm.veb > 0.8 && norm.co2 < 0.2) s += 0.2;
          break;
        }
        case 'SDE':
        case 'GUE': {
          if (norm.gini > 0.6) s -= (norm.gini - 0.6) * 1.5;
          if (code === 'GUE') s = Math.min(s, 0.80);
          break;
        }
        case 'PPE': {
          if (norm.pib < 0.4) s -= 0.2;
          if (norm.pib > 0.7 && norm.stab > 0.7) s += 0.15;
          break;
        }
        case 'ECR': {
          s -= norm.dem * pond.dem * 1.2;
          s = Math.min(s, 0.85);
          break;
        }
        case 'RENEW': {
          if (norm.stab < 0.5 || norm.dem < 0.5) s -= 0.3;
          break;
        }
      }

      const clampedSat = Math.max(0, Math.min(1, s)) * 100;
      satisfactionArr.push(clampedSat);
    }

    const sMoy5 = satisfactionArr.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const sMoy10 = satisfactionArr.reduce((a, b) => a + b, 0) / 10;

    const mepsArr = Array(5).fill(party.base.meps)
      .concat(Array(4).fill(Math.round(party.base.meps * (0.8 + 0.8 * sMoy5 / 100))))
      .concat([Math.round(party.base.meps * (0.8 + 0.8 * sMoy10 / 100))]);

    const commissairesArr = Array(5).fill(party.base.commissaires)
      .concat(Array(4).fill(Math.max(1, Math.round(party.base.commissaires * (0.8 + 0.8 * sMoy5 / 100)))))
      .concat([Math.max(1, Math.round(party.base.commissaires * (0.8 + 0.8 * sMoy10 / 100)))]);

    const conseilArr = Array(5).fill(party.base.conseil)
      .concat(Array(4).fill(Math.min(100, Math.round(party.base.conseil * (1 + 0.3 * (sMoy5 / 100 - 0.5))))))
      .concat([Math.min(100, Math.round(party.base.conseil * (1 + 0.3 * (sMoy10 / 100 - 0.5))))]);

    const presArr = Array(5).fill(Math.round(party.base.influence * 100))
      .concat(Array(4).fill(Math.round(party.base.influence * 100 * (0.9 + 0.2 * sMoy5 / 100))))
      .concat([Math.round(party.base.influence * 100 * (0.9 + 0.2 * sMoy10 / 100))]);

    const scoreVictoire = Math.round(100 * (
      0.6 * (sMoy10 / 100) +
      0.2 * (mepsArr[9] / 200) +
      0.2 * (commissairesArr[9] / 10)
    ));

    results[code] = {
      code,
      nom: party.nom,
      couleur: party.couleur,
      satisfactionArr,
      mepsArr,
      commissairesArr,
      conseilArr,
      presArr,
      scoreVictoire,
      satisfactionMoyenne: sMoy10
    };
  }

  return results;
}
