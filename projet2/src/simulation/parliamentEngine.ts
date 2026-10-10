import type { PartyCode, PartyResult, ScenarioId } from '../domain/types';
import type { ParliamentGroupCode, ParliamentGroupData, ParliamentResult } from '../domain/parliamentTypes';
import {
  PARLIAMENT_BASE_GROUPS,
  TOTAL_PARLIAMENT_SEATS,
  MAJORITY_THRESHOLD,
  evaluateCoalitions
} from './parliamentCoalitions';

export function calculateParliamentDistribution(
  partiesResults: Record<PartyCode, PartyResult>,
  statsUE: {
    pibArr: number[];
    giniArr: number[];
    co2Arr: number[];
    vebArr: number[];
    stabArr: number[];
    demArr: number[];
    idhArr: number[];
  },
  scenarioId: ScenarioId
): ParliamentResult {
  const yearsCount = 10;
  const groupsData: Record<ParliamentGroupCode, ParliamentGroupData> = {} as any;

  // Calcul des satisfactions pour OTHERS
  const othersSatArr: number[] = [];
  for (let t = 0; t < yearsCount; t++) {
    let satOthers = 50;
    if (scenarioId === 1) {
      const gini = statsUE.giniArr[t] ?? 0.35;
      const pib = statsUE.pibArr[t] ?? 1.5;
      satOthers = 50 + (gini - 0.33) * 120 - (pib - 1.5) * 8;
    } else {
      const vdem = statsUE.demArr[t] ?? 0.85;
      const stab = statsUE.stabArr[t] ?? 80;
      satOthers = 50 + (0.85 - vdem) * 100 + (80 - stab) * 0.4;
    }
    othersSatArr.push(Math.max(15, Math.min(85, satOthers)));
  }

  // Calcul des sièges alloués année par année garantissant exactement 720 sièges
  const allocatedSeatsByYear: Record<ParliamentGroupCode, number[]> = {
    GUE: [], SDE: [], VERT: [], RENEW: [], PPE: [], ECR: [], OTHERS: []
  };

  for (let t = 0; t < yearsCount; t++) {
    if (t < 5) {
      // Mandat législatif initial 2024-2029 (sièges constants de départ)
      for (const group of PARLIAMENT_BASE_GROUPS) {
        allocatedSeatsByYear[group.code].push(group.baseSeats);
      }
    } else {
      // Élections 2029 : bascule électorale selon la satisfaction cumulée
      const weights: Record<ParliamentGroupCode, number> = {} as any;
      let totalWeight = 0;

      for (const group of PARLIAMENT_BASE_GROUPS) {
        let sat = 50;
        if (group.code === 'OTHERS') {
          sat = othersSatArr.slice(0, t + 1).reduce((a, b) => a + b, 0) / (t + 1);
        } else {
          const pRes = partiesResults[group.code as PartyCode];
          if (pRes) {
            sat = pRes.satisfactionArr.slice(0, t + 1).reduce((a, b) => a + b, 0) / (t + 1);
          }
        }
        // Facteur de transmission d'opinion : 50% = ratio 1.0
        const factor = Math.max(0.65, Math.min(1.45, 0.70 + 0.60 * (sat / 100)));
        const w = group.baseSeats * factor;
        weights[group.code] = w;
        totalWeight += w;
      }

      // Méthode de Hamilton / plus forts restes pour 720 sièges entiers exacts
      const groupAllocations: { code: ParliamentGroupCode; seats: number; remainder: number }[] = [];
      let sumBaseAlloc = 0;

      for (const group of PARLIAMENT_BASE_GROUPS) {
        const exact = (weights[group.code] / totalWeight) * TOTAL_PARLIAMENT_SEATS;
        const baseAlloc = Math.floor(exact);
        sumBaseAlloc += baseAlloc;
        groupAllocations.push({
          code: group.code,
          seats: baseAlloc,
          remainder: exact - baseAlloc
        });
      }

      let remainingSeats = TOTAL_PARLIAMENT_SEATS - sumBaseAlloc;
      groupAllocations.sort((a, b) => b.remainder - a.remainder);
      for (let i = 0; i < remainingSeats; i++) {
        groupAllocations[i].seats += 1;
      }

      for (const alloc of groupAllocations) {
        allocatedSeatsByYear[alloc.code].push(alloc.seats);
      }
    }
  }

  // Construction de l'objet final ordonné dans l'hémicycle (Gauche -> Droite)
  const groupList: ParliamentGroupData[] = [];
  for (const group of PARLIAMENT_BASE_GROUPS) {
    const seatsArr = allocatedSeatsByYear[group.code];
    const currentSeats = seatsArr[9];
    const delta = currentSeats - group.baseSeats;
    const percent = Math.round((currentSeats / TOTAL_PARLIAMENT_SEATS) * 1000) / 10;
    const sat = group.code === 'OTHERS'
      ? Math.round(othersSatArr[9])
      : Math.round(partiesResults[group.code as PartyCode]?.satisfactionMoyenne ?? 50);

    const data: ParliamentGroupData = {
      code: group.code,
      nom: group.nom,
      nomCourt: group.nomCourt,
      couleur: group.couleur,
      baseSeats: group.baseSeats,
      currentSeats,
      delta,
      percent,
      seatsArr,
      satisfaction: sat
    };

    groupsData[group.code] = data;
    groupList.push(data);
  }

  const coalitions = evaluateCoalitions(groupsData);

  return {
    totalSeats: TOTAL_PARLIAMENT_SEATS,
    majorityThreshold: MAJORITY_THRESHOLD,
    groups: groupsData,
    groupList,
    coalitions
  };
}
