import type { PartyCode, PartyProfile } from '../domain/types';

export const PARTIES_PROFILES: Record<PartyCode, PartyProfile> = {
  PPE: {
    code: 'PPE',
    nom: 'Parti Populaire Européen',
    couleur: '#3399FF',
    logoUrl: './medias/images/logo-partis/ppe.png',
    base: { meps: 182, conseil: 35, commissaires: 9, influence: 0.35 },
    impact: { eco: 0.6, social: 0.3, env: 0.1, geo: 0.4 },
    pond: { pib: 0.35, gini: 0.05, co2: 0.00, veb: 0.05, stab: 0.30, dem: 0.10, idh: 0.15 }
  },
  SDE: {
    code: 'SDE',
    nom: 'Socialistes & Démocrates (S&D)',
    couleur: '#FF0000',
    logoUrl: './medias/images/logo-partis/sd.png',
    base: { meps: 154, conseil: 28, commissaires: 7, influence: 0.25 },
    impact: { eco: 0.4, social: 0.7, env: 0.5, geo: 0.3 },
    pond: { pib: 0.15, gini: 0.25, co2: 0.10, veb: 0.10, stab: 0.15, dem: 0.15, idh: 0.10 }
  },
  RENEW: {
    code: 'RENEW',
    nom: 'Renouveau Européen (Renew)',
    couleur: '#FFD700',
    logoUrl: './medias/images/logo-partis/Renew.png',
    base: { meps: 102, conseil: 17, commissaires: 5, influence: 0.15 },
    impact: { eco: 0.5, social: 0.5, env: 0.3, geo: 0.6 },
    pond: { pib: 0.25, gini: 0.10, co2: 0.10, veb: 0.10, stab: 0.15, dem: 0.15, idh: 0.15 }
  },
  VERT: {
    code: 'VERT',
    nom: 'Verts / Alliance Libre Européenne',
    couleur: '#00AA00',
    logoUrl: './medias/images/logo-partis/verts.png',
    base: { meps: 72, conseil: 12, commissaires: 3, influence: 0.10 },
    impact: { eco: 0.2, social: 0.4, env: 0.9, geo: 0.2 },
    pond: { pib: 0.05, gini: 0.15, co2: 0.35, veb: 0.25, stab: 0.05, dem: 0.10, idh: 0.10 }
  },
  ECR: {
    code: 'ECR',
    nom: 'Conservateurs et Réformistes Européens',
    couleur: '#0055A5',
    logoUrl: './medias/images/logo-partis/ecr.png',
    base: { meps: 62, conseil: 9, commissaires: 2, influence: 0.08 },
    impact: { eco: 0.7, social: 0.1, env: 0.1, geo: 0.5 },
    pond: { pib: 0.30, gini: 0.05, co2: 0.00, veb: 0.05, stab: 0.35, dem: 0.05, idh: 0.10 }
  },
  GUE: {
    code: 'GUE',
    nom: 'La Gauche au Parlement Européen (GUE/NGL)',
    couleur: '#B71C1C',
    logoUrl: './medias/images/logo-partis/gue.png',
    base: { meps: 39, conseil: 5, commissaires: 1, influence: 0.07 },
    impact: { eco: 0.3, social: 0.8, env: 0.4, geo: 0.3 },
    pond: { pib: 0.05, gini: 0.35, co2: 0.10, veb: 0.10, stab: 0.05, dem: 0.20, idh: 0.15 }
  }
};
