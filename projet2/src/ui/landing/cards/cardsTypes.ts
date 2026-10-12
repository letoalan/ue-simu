export type CardType = 'neg' | 'inf';

export interface ActorCardDefinition {
  id: string; // e.g. COM-N1, FR-I2, TECH-I4
  actorCode: string;
  actorName: string;
  category: 'commission' | 'states' | 'parties' | 'lobbies';
  type: CardType;
  typeLabel: string;
  image: string;
  authorizedRecipient: string;
  transferRule: string;
  scoreText: string;
  scoreSubtext: string;
  isReplacement?: boolean;
}

export interface ActorDefinition {
  code: string;
  name: string;
  category: 'commission' | 'states' | 'parties' | 'lobbies';
  categoryLabel: string;
  image: string;
  negCount: number;
  infCount: number;
  totalCards: number;
}
