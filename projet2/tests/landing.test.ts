import { describe, it, expect } from 'vitest';
import { ACTORS_CATALOG, ALL_89_CARDS, filterCardsByActors, generateReplacementCard } from '../src/ui/landing/cardsData';
import { GUIDES_DATA } from '../src/ui/landing/guidesData';
import { store } from '../src/state/store';

describe('Landing Page & Atelier des Cartes (Conformité implem.md)', () => {
  it('définit exactement 19 acteurs décisionnels répartis en 4 catégories', () => {
    expect(ACTORS_CATALOG).toHaveLength(19);

    const commission = ACTORS_CATALOG.filter(a => a.category === 'commission');
    const states = ACTORS_CATALOG.filter(a => a.category === 'states');
    const parties = ACTORS_CATALOG.filter(a => a.category === 'parties');
    const lobbies = ACTORS_CATALOG.filter(a => a.category === 'lobbies');

    expect(commission).toHaveLength(1);
    expect(states).toHaveLength(6);
    expect(parties).toHaveLength(6);
    expect(lobbies).toHaveLength(6);
  });

  it('génère le stock exact de 89 cartes : 39 négociations et 50 influences', () => {
    expect(ALL_89_CARDS).toHaveLength(89);

    const negCards = ALL_89_CARDS.filter(c => c.type === 'neg');
    const infCards = ALL_89_CARDS.filter(c => c.type === 'inf');

    expect(negCards).toHaveLength(39);
    expect(infCards).toHaveLength(50);

    // Chaque institution a 3N et 2I
    for (const actor of ACTORS_CATALOG.filter(a => a.category !== 'lobbies')) {
      const actorNeg = negCards.filter(c => c.actorCode === actor.code);
      const actorInf = infCards.filter(c => c.actorCode === actor.code);
      expect(actorNeg).toHaveLength(3);
      expect(actorInf).toHaveLength(2);
    }

    // Chaque lobby a 0N et 4I
    for (const lobby of ACTORS_CATALOG.filter(a => a.category === 'lobbies')) {
      const lobbyNeg = negCards.filter(c => c.actorCode === lobby.code);
      const lobbyInf = infCards.filter(c => c.actorCode === lobby.code);
      expect(lobbyNeg).toHaveLength(0);
      expect(lobbyInf).toHaveLength(4);
    }
  });

  it('permet de filtrer les cartes par acteurs sélectionnés sans altérer les identifiants', () => {
    const subset = filterCardsByActors(['FR', 'PPE', 'TECH']);
    expect(subset).toHaveLength(5 + 5 + 4); // 14 cartes
    expect(subset.every(c => ['FR', 'PPE', 'TECH'].includes(c.actorCode))).toBe(true);
  });

  it('génère une carte de remplacement avec identifiant préservé et mention isReplacement', () => {
    const rep = generateReplacementCard('COM-N1');
    expect(rep).not.toBeNull();
    expect(rep?.id).toBe('COM-N1');
    expect(rep?.isReplacement).toBe(true);
  });

  it('contient les 3 guides intégrés avec l’essentiel, le texte complet et la révision', () => {
    expect(GUIDES_DATA.joueur).toBeDefined();
    expect(GUIDES_DATA.animateur).toBeDefined();
    expect(GUIDES_DATA.master).toBeDefined();

    expect(GUIDES_DATA.joueur.essentials.length).toBeGreaterThanOrEqual(4);
    expect(GUIDES_DATA.animateur.essentials.length).toBeGreaterThanOrEqual(4);
    expect(GUIDES_DATA.master.essentials.length).toBeGreaterThanOrEqual(4);

    expect(GUIDES_DATA.joueur.revisionDate).toContain('2026');
    expect(GUIDES_DATA.joueur.sections.length).toBeGreaterThanOrEqual(3);
  });

  it('conserve la session et les votes lors des allers-retours vers la landing page', () => {
    store.setActiveTab('landing');
    expect(store.getState().activeTab).toBe('landing');

    // Simuler une sélection d'amendement
    store.toggleAmendment('amd_test');
    expect(store.getState().selectedAmendments.has('amd_test')).toBe(true);

    // Naviguer vers Mon Rôle puis retour à Landing
    store.setActiveTab('actors');
    expect(store.getState().activeTab).toBe('actors');

    store.setActiveTab('landing');
    expect(store.getState().activeTab).toBe('landing');
    // L'amendement n'a PAS été réinitialisé !
    expect(store.getState().selectedAmendments.has('amd_test')).toBe(true);
  });
});
