import type { ActorCardDefinition } from './cardsTypes';

export type WorkshopMode = 'all' | 'single' | 'custom' | 'replacement';
export type PreviewTab = 'cards' | 'sheets';
export type PrintFilter = 'duplex' | 'recto-only' | 'verso-only' | 'test-sheet';

export interface WorkshopState {
  mode: WorkshopMode;
  singleActorCode: string;
  selectedActorCodes: string[];
  replacementCardId: string;
  previewTab: PreviewTab;
  currentCardIndex: number;
  currentCardFlipped: boolean;
  printFilter: PrintFilter;
}

export interface Sheet {
  recto: (ActorCardDefinition | null)[];
  verso: (ActorCardDefinition | null)[];
}
