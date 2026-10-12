import type { CardType, ActorCardDefinition, ActorDefinition } from './cardsTypes';
import { ACTORS_CATALOG } from './actorsCatalog';

export type { CardType, ActorCardDefinition, ActorDefinition };
export { ACTORS_CATALOG };

export function generateAllCards(): ActorCardDefinition[] {
  const cards: ActorCardDefinition[] = [];

  for (const actor of ACTORS_CATALOG) {
    // Cartes de négociation (uniquement institutions : Commission, États, Partis)
    for (let i = 1; i <= actor.negCount; i++) {
      cards.push({
        id: `${actor.code}-N${i}`,
        actorCode: actor.code,
        actorName: actor.name,
        category: actor.category,
        type: 'neg',
        typeLabel: 'NÉGOCIATION · ENGAGEMENT',
        image: actor.image,
        authorizedRecipient: 'Un autre État, parti ou la Commission.',
        transferRule: 'Le receveur prend un engagement envers l’émetteur.',
        scoreText: '+10 non dénoncée',
        scoreSubtext: '−20 dénonciation recevable'
      });
    }

    // Cartes d'influence
    for (let i = 1; i <= actor.infCount; i++) {
      const isLobby = actor.category === 'lobbies';
      cards.push({
        id: `${actor.code}-I${i}`,
        actorCode: actor.code,
        actorName: actor.name,
        category: actor.category,
        type: 'inf',
        typeLabel: 'INFLUENCE',
        image: actor.image,
        authorizedRecipient: isLobby ? 'Une institution uniquement (État, parti ou Commission).' : 'Un lobby uniquement.',
        transferRule: 'Une relation d’information, d’expertise ou de soutien. Aucun vote imposé.',
        scoreText: '+5 au receveur extérieur',
        scoreSubtext: 'Une seule utilisation · pas d’auto-attribution'
      });
    }
  }

  return cards;
}

export const ALL_89_CARDS = generateAllCards();

export function filterCardsByActors(actorCodes: string[]): ActorCardDefinition[] {
  const set = new Set(actorCodes);
  return ALL_89_CARDS.filter(c => set.has(c.actorCode));
}

export function generateReplacementCard(cardId: string): ActorCardDefinition | null {
  const card = ALL_89_CARDS.find(c => c.id === cardId);
  if (!card) return null;
  return {
    ...card,
    isReplacement: true
  };
}
