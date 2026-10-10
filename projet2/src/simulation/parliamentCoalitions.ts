import type { ParliamentGroupCode, ParliamentCoalition, ParliamentGroupData } from '../domain/parliamentTypes';

export interface GroupBaseConfig {
  code: ParliamentGroupCode;
  nom: string;
  nomCourt: string;
  couleur: string;
  baseSeats: number;
}

export const PARLIAMENT_BASE_GROUPS: GroupBaseConfig[] = [
  { code: 'GUE', nom: 'La Gauche (The Left / GUE-NGL)', nomCourt: 'GUE', couleur: '#B71C1C', baseSeats: 39 },
  { code: 'SDE', nom: 'Socialistes & Démocrates (S&D)', nomCourt: 'S&D', couleur: '#EF4444', baseSeats: 154 },
  { code: 'VERT', nom: 'Verts / Alliance Libre Européenne', nomCourt: 'Verts', couleur: '#10B981', baseSeats: 72 },
  { code: 'RENEW', nom: 'Renouveau Européen (Renew Europe)', nomCourt: 'Renew', couleur: '#F59E0B', baseSeats: 102 },
  { code: 'PPE', nom: 'Parti Populaire Européen (PPE)', nomCourt: 'PPE', couleur: '#2563EB', baseSeats: 182 },
  { code: 'ECR', nom: 'Conservateurs et Réformistes (ECR)', nomCourt: 'ECR', couleur: '#1E3A8A', baseSeats: 62 },
  { code: 'OTHERS', nom: 'Patriotes, Souverainistes & Non-inscrits', nomCourt: 'Autres / NI', couleur: '#64748B', baseSeats: 109 }
];

export const TOTAL_PARLIAMENT_SEATS = 720;
export const MAJORITY_THRESHOLD = 361;

export function evaluateCoalitions(groups: Record<ParliamentGroupCode, ParliamentGroupData>): ParliamentCoalition[] {
  const definitions: { nom: string; codes: ParliamentGroupCode[] }[] = [
    { nom: 'Majorité Pro-Européenne (PPE + S&D + Renew)', codes: ['PPE', 'SDE', 'RENEW'] },
    { nom: 'Arc Progressiste (S&D + Renew + Verts + Gauche)', codes: ['SDE', 'RENEW', 'VERT', 'GUE'] },
    { nom: 'Alliance Centre-Droit (PPE + Renew + ECR)', codes: ['PPE', 'RENEW', 'ECR'] },
    { nom: 'Bloc Conservateur & Souverainiste (PPE + ECR + NI)', codes: ['PPE', 'ECR', 'OTHERS'] }
  ];

  return definitions.map(def => {
    const seats = def.codes.reduce((sum, c) => sum + (groups[c]?.currentSeats ?? 0), 0);
    return {
      nom: def.nom,
      groupCodes: def.codes,
      seats,
      hasMajority: seats >= MAJORITY_THRESHOLD,
      percent: Math.round((seats / TOTAL_PARLIAMENT_SEATS) * 1000) / 10
    };
  });
}
