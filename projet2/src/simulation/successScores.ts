import type { PartyCode, PartyResult } from '../domain/types';

/**
 * Calcule le score de réussite synthétique à partir de la satisfaction initiale et finale.
 * Par défaut, le score est strictement borné dans [0, 100] pour éviter toute valeur négative aberrante (-12).
 */
export function computeSuccessScore(s0: number, sf: number, clamp = true): number {
  const raw = 100 * (0.4 * sf + 0.4 * (1 - Math.abs(0.8 - sf)) + 0.2 * (sf - s0));
  const rounded = Math.round(raw * 10) / 10;
  if (!clamp) return rounded;
  return Math.max(0, Math.min(100, rounded));
}

/**
 * Évaluation triadique recommandée par new.md (Section 3.6) :
 * 1. Satisfaction finale
 * 2. Progression temporelle (sf - s0)
 * 3. Gain net face à la référence contrefactuelle (sf - sRef)
 */
export interface TriadEvaluation {
  finalSatisfaction: number;
  progression: number;
  netGainVsReference: number;
  syntheticScore: number;
}

export function evaluateTriad(s0: number, sf: number, sRef: number): TriadEvaluation {
  const finalSatisfaction = Math.round(sf * 1000) / 1000;
  const progression = Math.round((sf - s0) * 1000) / 1000;
  const netGainVsReference = Math.round((sf - sRef) * 1000) / 1000;
  const syntheticScore = computeSuccessScore(s0, sf, true);

  return {
    finalSatisfaction,
    progression,
    netGainVsReference,
    syntheticScore
  };
}

/**
 * Répartition déterministe proportionnelle à somme constante (720 sièges au Parlement).
 * Conserve la stricte proportionnalité des indices électoraux des 6 groupes.
 */
export function projectConservedSeats(
  partiesResults: Record<PartyCode, PartyResult>,
  totalSeats = 720
): Record<PartyCode, number> {
  const codes = Object.keys(partiesResults) as PartyCode[];
  const rawWeights: Record<PartyCode, number> = {} as any;
  let totalWeight = 0;

  for (const code of codes) {
    const sMoy = partiesResults[code].satisfactionMoyenne;
    const baseMeps = partiesResults[code].mepsArr[0] || 100;
    const weight = baseMeps * (0.8 + 0.8 * (sMoy / 100));
    rawWeights[code] = weight;
    totalWeight += weight;
  }

  const allocated: Record<PartyCode, number> = {} as any;
  let sumAllocated = 0;

  for (const code of codes) {
    const share = totalWeight > 0 ? (rawWeights[code] / totalWeight) * totalSeats : totalSeats / codes.length;
    const seats = Math.floor(share);
    allocated[code] = seats;
    sumAllocated += seats;
  }

  // Distribution déterministe des restes selon les plus forts restes
  let remainder = totalSeats - sumAllocated;
  const remainders = codes
    .map(code => ({
      code,
      rest: totalWeight > 0 ? ((rawWeights[code] / totalWeight) * totalSeats) - allocated[code] : 0
    }))
    .sort((a, b) => b.rest - a.rest || a.code.localeCompare(b.code));

  for (let i = 0; i < remainder; i++) {
    allocated[remainders[i].code]++;
  }

  return allocated;
}
