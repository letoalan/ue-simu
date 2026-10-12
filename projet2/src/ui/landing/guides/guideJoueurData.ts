import type { GuideDefinition } from './guideTypes';

export const GUIDE_JOUEUR: GuideDefinition = {
  id: 'joueur',
  journey: 'participant',
  title: 'Guide du Participant',
  subtitle: 'Préparer son mandat, négocier et sceller des engagements',
  badge: '🎓 Participant',
  version: '2.0.0-UX',
  revisionDate: '11 octobre 2026',
  model: 'Modèle UE-SIMU v2',
  shortDesc: '« Je prépare mon rôle, mes arguments et mes engagements. »',
  actionPreparationText: 'Lire le guide joueur',
  actionLaunchText: 'Commencer comme participant',
  essentials: [
    'Incarnez un mandat d’acteur officiel (fiche de rôle, objectifs, lignes rouges), pas votre opinion personnelle.',
    'Utilisez vos cartes pour sceller des promesses humaines : Négociation (+10 ou −20 si dénoncée), Influence (+5 au receveur).',
    'Les points de cartes récompensent la fidélité aux promesses ; ils n’altèrent aucune formule mathématique du simulateur.',
    'Prenez part au vote de codécision : Conseil des États (majorité qualifiée) et Parlement (majorité absolue).',
    'L’accord financier est évalué de manière algorithmique ; discutez les paramètres et le compromis avec votre animateur.'
  ],
  markdownContent: `# UE-SIMU — Guide du participant

## Vérification du dépôt et statut de ce guide
Révision du 11 octobre 2026. Libre adaptation de *Panique à la Commission !* (Électeurs en herbe). 19 acteurs décisionnels, 89 cartes réparties entre institutions et société civile.

## Conventions des cartes
- Commission, États et Partis : 3 cartes de négociation et 2 d'influence.
- Lobbies : 4 cartes d'influence, aucune carte de négociation.
- Négociation entre institutions différentes ; Influence uniquement institution ↔ lobby.
- Une carte reçue ne peut jamais être redistribuée ni auto-attribuée.
- Score : +10 points sans dénonciation ; −20 points si dénonciation recevable ; +5 points pour une influence valide.

## Mission et préparation
Vous représentez un acteur avec un mandat précis. Lisez votre fiche secrète, analysez vos lignes rouges et déterminez vos amendements prioritaires. Préparez un argument, une concession envisageable et vos conditions d'accord.

## Lire les effets et indicateurs
Décision → Actions → Mise en œuvre → Résultats → Évaluation.
Suivez 4 indicateurs macroéconomiques :
1. PIB UE (croissance et prospérité)
2. Émissions de CO₂ (transition écologique)
3. Indice de Gini (équité sociale)
4. Bien-être VEB (qualité de vie et services publics)

## Débriefing de séance
Expliquer les concessions consenties, les promesses scellées par les cartes et les limites des modèles théoriques. Évaluer séparément les engagements tenus et les résultats produits par le simulateur.`,
  sections: [
    {
      id: 'mission-role',
      title: '1. Mission et incarnation du rôle',
      level: 2,
      contentHtml: `
        <p>Vous représentez un <strong>acteur décisionnel</strong> (un État membre, un groupe politique du Parlement européen, un lobby de la société civile ou la Commission européenne). Vous ne défendez pas votre opinion personnelle mais le <strong>mandat stratégique</strong> consigné sur votre fiche.</p>
        <div class="guide-callout info">
          <strong>Règle d'or :</strong> Lisez attentivement votre fiche, vos lignes rouges, vos priorités sectorielles et préparez vos arguments, concessions et conditions d'accord.
        </div>
      `
    },
    {
      id: 'regles-cartes-joueur',
      title: '2. Règles des cartes — Référentiel de la séance',
      level: 2,
      contentHtml: `
        <p>Les cartes matérialisent des accords fermes et observables pris entre protagonistes :</p>
        <table class="guide-table">
          <thead><tr><th>Type de carte</th><th>Émetteur → Receveur</th><th>Règle de score au receveur</th></tr></thead>
          <tbody>
            <tr><td><strong>Négociation (Bleu)</strong></td><td>Institution → Autre institution</td><td><strong>+10 pts</strong> si tenue / <strong>−20 pts</strong> si dénoncée</td></tr>
            <tr><td><strong>Influence (Violet)</strong></td><td>Institution ↔ Lobby</td><td><strong>+5 pts</strong> au receveur extérieur valide</td></tr>
            <tr><td><strong>Carte conservée</strong></td><td>Non distribuée</td><td><strong>0 pt</strong> (non comptabilisée)</td></tr>
          </tbody>
        </table>
        <p><strong>Important :</strong> La carte de négociation reconnaît une promesse du receveur envers l’émetteur. Les points de cartes ne modifient pas les équations du simulateur.</p>
      `
    },
    {
      id: 'codecison-vote',
      title: '3. Négociation du texte & Co-législation',
      level: 2,
      contentHtml: `
        <p>Le trilogue législatif s'organise autour d'une directive et de ses amendements :</p>
        <ul>
          <li><strong>Conseil de l’UE :</strong> Majorité qualifiée requise (au moins 55% des États et 65% de la population représentée).</li>
          <li><strong>Parlement européen :</strong> Majorité absolue requise (au moins 361 voix sur 720).</li>
        </ul>
      `
    },
    {
      id: 'finances-joueur',
      title: '4. Comprendre la négociation financière',
      level: 2,
      contentHtml: `
        <p>Dès que le compromis politique est validé, l’accès aux <strong>Finances</strong> est déverrouillé. Vous y négociez l'enveloppe budgétaire, les clés de contribution et de redistribution.</p>
        <div class="guide-callout warning">
          <strong>Attention :</strong> Le bouton « Mettre aux Voix l'Accord Financier » calcule un soutien théorique algorithmique. Les engagements humains promis sur vos cartes doivent être vérifiés séparément avec l'animateur.
        </div>
      `
    },
    {
      id: 'debriefing-joueur',
      title: '5. Débriefing et évaluation collective',
      level: 2,
      contentHtml: `
        <p>En fin de séance, chaque groupe expose ses arbitrages :</p>
        <ul>
          <li>Quelles concessions ont été indispensables pour forger une coalition ?</li>
          <li>Les promesses des cartes ont-elles toutes été respectées ? Y a-t-il eu dénonciation ?</li>
          <li>Quel est le résultat produit par le simulateur sur les 10 ans de projection ?</li>
        </ul>
      `
    }
  ]
};
