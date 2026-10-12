import type { GuideDefinition } from './guideTypes';

export const GUIDE_ANIMATEUR: GuideDefinition = {
  id: 'animateur',
  journey: 'animateur',
  title: 'Guide de Conduite de Séance',
  subtitle: 'Arbitrage, animation du trilogue, quorums et débriefing',
  badge: '🎙️ Animateur',
  version: '2.0.0-UX',
  revisionDate: '11 octobre 2026',
  model: 'Modèle UE-SIMU v2',
  shortDesc: '« Je conduis les échanges, les votes et le débriefing. »',
  actionPreparationText: 'Lire le guide animateur',
  actionLaunchText: 'Ouvrir la conduite de séance',
  essentials: [
    'Garantissez un débat équitable sans privilégier d’acteur ni manipuler les paramètres en secret.',
    'Distribuez le stock fixe de 89 cartes (3N et 2I par institution, 4I par lobby) et tenez le registre officiel.',
    'Vérifiez les quorums de vote au Conseil (55% États + 65% pop) et au Parlement (361 voix / 720).',
    'Distinguez clairement les votes humains des élèves de l’évaluation budgétaire algorithmique.',
    'Projetez les courbes comparatives sur 10 ans pour guider le grand débriefing institutionnel.'
  ],
  markdownContent: `# UE-SIMU — Guide de conduite de séance

## Conduite et posture
Organiser la discussion et les votes sans favoriser un acteur. Le maître du jeu garantit la configuration ; l'animateur anime la dynamique de groupe.

## Gestion des 89 cartes
Distribuer les cartes et tenir le registre des engagements.
Score cartes = 10 × N non dénoncées − 20 × N dénoncées + 5 × I valides.

## Déroulement en 3 temps
1. Négocier le texte : Directive, amendements et votes de co-législation.
2. Négocier les moyens : Enveloppe, contributions et redistribution financière.
3. Comprendre les conséquences : Projection sur 10 ans et grand débriefing.`,
  sections: [
    {
      id: 'posture-animateur',
      title: '1. Rôle et posture de l’animateur',
      level: 2,
      contentHtml: `
        <p>L’animateur est le <strong>gardien du temps et du cadre démocratique</strong>. Il distribue la parole, veille au respect des temps de négociation et s'assure que chaque catégorie d'acteur (États, Partis, Lobbies) puisse faire entendre ses arguments.</p>
      `
    },
    {
      id: 'arbitrage-cartes',
      title: '2. Distribution et tenue du Registre des Cartes',
      level: 2,
      contentHtml: `
        <p>Le jeu comprend un stock strict de <strong>89 cartes</strong> :</p>
        <ul>
          <li><strong>Institutions (Commission, 6 États, 6 Partis) :</strong> 3 cartes de Négociation (N1 à N3) et 2 cartes d'Influence (I1 à I2).</li>
          <li><strong>Lobbies (6 Lobbies) :</strong> 4 cartes d'Influence (I1 à I4), aucune carte de négociation.</li>
        </ul>
        <p>Notez chaque accord dans le Registre : Identifiant, Émetteur, Receveur, Action observable promise, Échéance et Statut.</p>
      `
    },
    {
      id: 'double-validation',
      title: '3. Deux validations à ne pas confondre',
      level: 2,
      contentHtml: `
        <div class="guide-callout warning">
          <strong>Distinction capitale :</strong>
          <ol>
            <li><strong>Validation humaine des élèves :</strong> Les votes exprimés et scellés par les promesses de cartes.</li>
            <li><strong>Validation financière logicielle :</strong> Le bouton d’accord financier calcule un soutien théorique selon le solde net et la couverture. Annoncez clairement le mode choisi avant la séance.</li>
          </ol>
        </div>
      `
    },
    {
      id: 'debriefing-anim',
      title: '4. Conduite du débriefing final',
      level: 2,
      contentHtml: `
        <p>Le débriefing articule trois dimensions :</p>
        <ol>
          <li>Ce que nous souhaitions politiquement au départ.</li>
          <li>Ce qui a été négocié et voté par compromis.</li>
          <li>Ce que la simulation systémique révèle sur les 10 ans à venir (climat, économie, inégalités).</li>
        </ol>
      `
    }
  ]
};
