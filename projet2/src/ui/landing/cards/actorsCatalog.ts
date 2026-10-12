import type { ActorDefinition } from './cardsTypes';

export const ACTORS_CATALOG: ActorDefinition[] = [
  // 1. Commission européenne
  {
    code: 'COM',
    name: 'Commission européenne',
    category: 'commission',
    categoryLabel: 'Initiative législative',
    image: './medias/images/flags/ue.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  // 2. États membres (Conseil de l'UE)
  {
    code: 'DE',
    name: 'Allemagne',
    category: 'states',
    categoryLabel: 'Conseil de l’UE (État)',
    image: './medias/images/flags/allemagne.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'FR',
    name: 'France',
    category: 'states',
    categoryLabel: 'Conseil de l’UE (État)',
    image: './medias/images/flags/france.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'IT',
    name: 'Italie',
    category: 'states',
    categoryLabel: 'Conseil de l’UE (État)',
    image: './medias/images/flags/italie.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'PL',
    name: 'Pologne',
    category: 'states',
    categoryLabel: 'Conseil de l’UE (État)',
    image: './medias/images/flags/pologne.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'HU',
    name: 'Hongrie',
    category: 'states',
    categoryLabel: 'Conseil de l’UE (État)',
    image: './medias/images/flags/hongrie.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'SE',
    name: 'Suède',
    category: 'states',
    categoryLabel: 'Conseil de l’UE (État)',
    image: './medias/images/flags/suede.jpg',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  // 3. Partis politiques (Parlement européen)
  {
    code: 'PPE',
    name: 'Parti Populaire Européen (PPE)',
    category: 'parties',
    categoryLabel: 'Parlement européen (Groupe)',
    image: './medias/images/logo-partis/ppe.png',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'SD',
    name: 'Socialistes & Démocrates (S&D)',
    category: 'parties',
    categoryLabel: 'Parlement européen (Groupe)',
    image: './medias/images/logo-partis/sd.png',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'RENEW',
    name: 'Renew Europe',
    category: 'parties',
    categoryLabel: 'Parlement européen (Groupe)',
    image: './medias/images/logo-partis/Renew.png',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'VERTS',
    name: 'Verts / ALE',
    category: 'parties',
    categoryLabel: 'Parlement européen (Groupe)',
    image: './medias/images/logo-partis/verts.png',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'ECR',
    name: 'Conservateurs & Réformistes (ECR)',
    category: 'parties',
    categoryLabel: 'Parlement européen (Groupe)',
    image: './medias/images/logo-partis/ecr.png',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  {
    code: 'GUE',
    name: 'La Gauche (GUE/NGL)',
    category: 'parties',
    categoryLabel: 'Parlement européen (Groupe)',
    image: './medias/images/logo-partis/gue.png',
    negCount: 3,
    infCount: 2,
    totalCards: 5
  },
  // 4. Lobbies & Société civile
  {
    code: 'TECH',
    name: 'Big Tech & IA',
    category: 'lobbies',
    categoryLabel: 'Lobby & Société civile',
    image: './medias/images/logo-lobbies/tech.png',
    negCount: 0,
    infCount: 4,
    totalCards: 4
  },
  {
    code: 'FOSS',
    name: 'Énergies fossiles & Transition',
    category: 'lobbies',
    categoryLabel: 'Lobby & Société civile',
    image: './medias/images/logo-lobbies/fossiles.png',
    negCount: 0,
    infCount: 4,
    totalCards: 4
  },
  {
    code: 'FINA',
    name: 'Finance verte & Banques',
    category: 'lobbies',
    categoryLabel: 'Lobby & Société civile',
    image: './medias/images/logo-lobbies/finance.png',
    negCount: 0,
    infCount: 4,
    totalCards: 4
  },
  {
    code: 'AGRO',
    name: 'Agrochimie & Bio-agriculture',
    category: 'lobbies',
    categoryLabel: 'Lobby & Société civile',
    image: './medias/images/logo-lobbies/agrochimie.png',
    negCount: 0,
    infCount: 4,
    totalCards: 4
  },
  {
    code: 'PHAR',
    name: 'Industrie Pharmaceutique & Santé',
    category: 'lobbies',
    categoryLabel: 'Lobby & Société civile',
    image: './medias/images/logo-lobbies/pharma.png',
    negCount: 0,
    infCount: 4,
    totalCards: 4
  },
  {
    code: 'AUTO',
    name: 'Industrie Automobile & Transports',
    category: 'lobbies',
    categoryLabel: 'Lobby & Société civile',
    image: './medias/images/logo-lobbies/auto.png',
    negCount: 0,
    infCount: 4,
    totalCards: 4
  }
];
