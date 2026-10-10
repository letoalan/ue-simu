import type { LobbyCode, LobbyProfile } from '../domain/types';

export const LOBBIES_PROFILES: Record<LobbyCode, LobbyProfile> = {
  BIG_TECH: {
    code: 'BIG_TECH',
    nom: 'Géants du Numérique (Big Tech)',
    couleur: '#00AEEF',
    logoUrl: './medias/images/logo-lobbies/tech.png',
    base: { reputation: 80, infEtats: 40, infParlement: 70, infCommission: 60 },
    facteurs: {
      rep: { croissance: 0.2, democratie: -0.4, sante: 0.1 },
      inf: { croissance: 0.3, securite: 0.2, democratie: -0.2 }
    },
    ennemis: ['democratie']
  },
  ENERGIES_FOSSILES: {
    code: 'ENERGIES_FOSSILES',
    nom: 'Industrie des Énergies Fossiles',
    couleur: '#424242',
    logoUrl: './medias/images/logo-lobbies/fossiles.png',
    base: { reputation: 40, infEtats: 70, infParlement: 50, infCommission: 50 },
    facteurs: {
      rep: { croissance: 0.2, ecologie: -0.5, securite: 0.2 },
      inf: { croissance: 0.1, securite: 0.3, ecologie: -0.4 }
    },
    ennemis: ['ecologie']
  },
  BANQUES_FINANCE: {
    code: 'BANQUES_FINANCE',
    nom: 'Secteur Bancaire & Marchés Financiers',
    couleur: '#F57F17',
    logoUrl: './medias/images/logo-lobbies/finance.png',
    base: { reputation: 60, infEtats: 60, infParlement: 65, infCommission: 65 },
    facteurs: {
      rep: { croissance: 0.3, securite: -0.2, stabilite: 0.3 },
      inf: { croissance: 0.4, stabilite: 0.4, democratie: 0.1 }
    },
    ennemis: []
  },
  AGROCHIMIE: {
    code: 'AGROCHIMIE',
    nom: 'Agrochimie & Semences Industrielles',
    couleur: '#558B2F',
    logoUrl: './medias/images/logo-lobbies/agrochimie.png',
    base: { reputation: 50, infEtats: 65, infParlement: 60, infCommission: 55 },
    facteurs: {
      rep: { croissance: 0.1, ecologie: -0.4, sante: -0.2 },
      inf: { croissance: 0.1, securite: 0.2, ecologie: -0.3 }
    },
    ennemis: ['ecologie', 'sante']
  },
  PHARMA: {
    code: 'PHARMA',
    nom: 'Industrie Pharmaceutique & Biotechnologies',
    couleur: '#C2185B',
    logoUrl: './medias/images/logo-lobbies/pharma.png',
    base: { reputation: 75, infEtats: 55, infParlement: 60, infCommission: 70 },
    facteurs: {
      rep: { sante: 0.5, croissance: 0.1, democratie: -0.1 },
      inf: { sante: 0.4, croissance: 0.2, stabilite: 0.2 }
    },
    ennemis: []
  },
  AUTOMOBILE: {
    code: 'AUTOMOBILE',
    nom: 'Constructeurs Automobiles Européens',
    couleur: '#455A64',
    logoUrl: './medias/images/logo-lobbies/auto.png',
    base: { reputation: 65, infEtats: 75, infParlement: 60, infCommission: 50 },
    facteurs: {
      rep: { croissance: 0.3, ecologie: -0.3 },
      inf: { croissance: 0.3, ecologie: -0.2, stabilite: 0.1 }
    },
    ennemis: ['ecologie']
  }
};
