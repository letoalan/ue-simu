export interface GuideSection {
  id: string;
  title: string;
  level: number;
  contentHtml: string;
}

export interface GuideDefinition {
  id: 'joueur' | 'animateur' | 'master';
  journey: 'participant' | 'animateur' | 'maitre_du_jeu';
  title: string;
  subtitle: string;
  badge: string;
  version: string;
  revisionDate: string;
  model: string;
  shortDesc: string;
  actionLaunchText: string;
  actionPreparationText: string;
  essentials: string[];
  markdownContent: string;
  sections: GuideSection[];
}
