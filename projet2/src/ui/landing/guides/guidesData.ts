import type { GuideSection, GuideDefinition } from './guideTypes';
import { GUIDE_JOUEUR } from './guideJoueurData';
import { GUIDE_ANIMATEUR } from './guideAnimateurData';
import { GUIDE_MASTER } from './guideMasterData';

export type { GuideSection, GuideDefinition };

export const GUIDES_DATA: Record<'joueur' | 'animateur' | 'master', GuideDefinition> = {
  joueur: GUIDE_JOUEUR,
  animateur: GUIDE_ANIMATEUR,
  master: GUIDE_MASTER
};
