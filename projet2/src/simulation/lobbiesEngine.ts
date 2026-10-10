import type { LobbyCode, LobbyProfile, LobbyResult, ScenarioId } from '../domain/types';
import { normalizeValue } from '../domain/indicators';
import type { PRNG } from './prng';

export function simulateLobbies(
  statsUE: {
    pibArr: number[];
    giniArr: number[];
    co2Arr: number[];
    vebArr: number[];
    stabArr: number[];
    demArr: number[];
    idhArr: number[];
  },
  lobbiesProfiles: Record<LobbyCode, LobbyProfile>,
  scenarioId: ScenarioId,
  prng: PRNG
): Record<LobbyCode, LobbyResult> {
  const results = {} as Record<LobbyCode, LobbyResult>;

  // Initialisation des séries
  const state: Record<LobbyCode, {
    reputationArr: number[];
    infEtatsArr: number[];
    infParlementArr: number[];
    infCommissionArr: number[];
  }> = {} as any;

  for (const [codeStr, lobby] of Object.entries(lobbiesProfiles)) {
    const code = codeStr as LobbyCode;
    state[code] = {
      reputationArr: [lobby.base.reputation ?? 50],
      infEtatsArr: [lobby.base.infEtats ?? 30],
      infParlementArr: [lobby.base.infParlement ?? 30],
      infCommissionArr: [lobby.base.infCommission ?? 30]
    };
  }

  // Simulation sur les 9 années suivantes
  for (let i = 0; i < 9; i++) {
    const norm = {
      pib: normalizeValue(statsUE.pibArr[i] ?? 0, -2, 4),
      gini: normalizeValue(statsUE.giniArr[i] ?? 0.3, 0.2, 0.6),
      co2: normalizeValue(statsUE.co2Arr[i] ?? 4, 2, 10),
      veb: normalizeValue(statsUE.vebArr[i] ?? 80, 0, 100),
      stab: normalizeValue(statsUE.stabArr[i] ?? 80, 0, 100),
      dem: normalizeValue(statsUE.demArr[i] ?? 0.85, 0, 1),
      idh: normalizeValue(statsUE.idhArr[i] ?? 0.92, 0, 1)
    };

    const impacts: Record<string, number> = {
      croissance: norm.pib,
      securite: norm.stab,
      stabilite: norm.stab,
      sante: norm.idh,
      ecologie: (norm.veb + (1 - norm.co2)) / 2,
      democratie: norm.dem
    };

    // 1. Mise à jour de la réputation
    for (const [codeStr, lobby] of Object.entries(lobbiesProfiles)) {
      const code = codeStr as LobbyCode;
      const currentRep = state[code].reputationArr[i] ?? 50;
      let changementR = 0;

      if (lobby.facteurs?.rep) {
        for (const [facteur, ponderation] of Object.entries(lobby.facteurs.rep)) {
          if (impacts[facteur] !== undefined) {
            changementR += impacts[facteur] * ponderation * 10;
          }
        }
      }

      // Micro-scandale aléatoire reproductible via PRNG
      if (prng.next() < 0.04) {
        changementR -= 25;
      }

      const nextRep = Math.max(0, Math.min(100, currentRep + changementR));
      state[code].reputationArr.push(nextRep);
    }

    // 2. Mise à jour de l'influence
    for (const [codeStr, lobby] of Object.entries(lobbiesProfiles)) {
      const code = codeStr as LobbyCode;
      if (!lobby.facteurs?.inf) continue;

      const repMultiplier = (state[code].reputationArr[i + 1] ?? 50) / 100;
      let changementInfBase = 0;

      for (const [facteur, ponderation] of Object.entries(lobby.facteurs.inf)) {
        if (impacts[facteur] !== undefined) {
          changementInfBase += impacts[facteur] * ponderation * 8;
        }
      }

      const changementInfReel = changementInfBase * repMultiplier;

      let nouvelleIE = (state[code].infEtatsArr[i] ?? 30) + changementInfReel;
      let nouvelleIP = (state[code].infParlementArr[i] ?? 30) + changementInfReel;
      let nouvelleIC = (state[code].infCommissionArr[i] ?? 30) + changementInfReel;

      // Bonus institutionnel selon la nature du dossier
      if (scenarioId === 1) {
        nouvelleIC += changementInfReel > 0 ? 2 : 0;
      } else {
        nouvelleIE += changementInfReel > 0 ? 2 : 0;
      }

      state[code].infEtatsArr.push(Math.max(0, Math.min(100, nouvelleIE)));
      state[code].infParlementArr.push(Math.max(0, Math.min(100, nouvelleIP)));
      state[code].infCommissionArr.push(Math.max(0, Math.min(100, nouvelleIC)));
    }

    // 3. Dynamique de rivalité sectorielle
    for (const [codeStr, lobby] of Object.entries(lobbiesProfiles)) {
      const code = codeStr as LobbyCode;
      if (!lobby.ennemis || lobby.ennemis.length === 0) continue;

      let malusEnnemi = 0;
      for (const ennemi of lobby.ennemis) {
        if ((impacts[ennemi] ?? 0) > 0.6) {
          malusEnnemi -= (impacts[ennemi] ?? 0) * 3;
        }
      }

      const lastIdx = state[code].infEtatsArr.length - 1;
      state[code].infEtatsArr[lastIdx] = Math.max(0, Math.min(100, state[code].infEtatsArr[lastIdx] + malusEnnemi));
      state[code].infParlementArr[lastIdx] = Math.max(0, Math.min(100, state[code].infParlementArr[lastIdx] + malusEnnemi));
      state[code].infCommissionArr[lastIdx] = Math.max(0, Math.min(100, state[code].infCommissionArr[lastIdx] + malusEnnemi));
    }
  }

  // Calcul du score final de réussite
  for (const [codeStr, lobby] of Object.entries(lobbiesProfiles)) {
    const code = codeStr as LobbyCode;
    const ie = state[code].infEtatsArr[9] ?? 0;
    const ip = state[code].infParlementArr[9] ?? 0;
    const ic = state[code].infCommissionArr[9] ?? 0;
    const scoreDeReussite = Math.round((ie + ip + ic) / 3 * 10) / 10;

    results[code] = {
      code,
      nom: lobby.nom,
      couleur: lobby.couleur,
      reputationArr: state[code].reputationArr,
      infEtatsArr: state[code].infEtatsArr,
      infParlementArr: state[code].infParlementArr,
      infCommissionArr: state[code].infCommissionArr,
      scoreDeReussite
    };
  }

  return results;
}
