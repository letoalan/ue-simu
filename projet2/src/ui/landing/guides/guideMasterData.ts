import type { GuideDefinition } from './guideTypes';

export const GUIDE_MASTER: GuideDefinition = {
  id: 'master',
  journey: 'maitre_du_jeu',
  title: 'Guide du Maître du Jeu',
  subtitle: 'Configuration technique, intégrité des modèles et sauvegardes',
  badge: '⚙️ Maître du Jeu',
  version: '2.0.0-UX',
  revisionDate: '11 octobre 2026',
  model: 'Modèle UE-SIMU v2',
  shortDesc: '« Je prépare la session, les règles et le matériel. »',
  actionPreparationText: 'Lire le guide maître du jeu',
  actionLaunchText: 'Ouvrir la configuration',
  essentials: [
    'Configurez le scénario (S1 Climat ou S2 Géopolitique), la directive et le générateur de nombres aléatoires (graine).',
    'Assurez l’attribution des 19 rôles à l’effectif de la classe via l’algorithme d’équilibrage.',
    'Veillez à l’indépendance stricte entre le score des cartes et les équations mathématiques de simulation.',
    'Contrôlez les sauvegardes JSON locales pour exporter ou reprendre une session sans perte.',
    'Supervisez la conformité des données et tranchez les éventuels litiges d’arbitrage.'
  ],
  markdownContent: `# UE-SIMU — Guide du maître du jeu

## Mission et contrôle
Préparer le scénario, les versions, les données, les règles et les sauvegardes ; garantir un arbitrage transparent.

## Invariants et architecture
- Les 19 acteurs produisent 89 cartes (39 N et 50 I).
- Indépendance stricte : 10N − 20N dénoncées + 5I. Aucune altération mathématique des équations.
- Export et reprise de session : exportSessionToJson sérialise version 2.0.0-UX, scénario, directive, inputs, seed et accord politique.`,
  sections: [
    {
      id: 'configuration-seance',
      title: '1. Paramétrage technique de la session',
      level: 2,
      contentHtml: `
        <p>Le Maître du Jeu configure la session en amont :</p>
        <ul>
          <li><strong>Choix du Scénario :</strong> Scénario 1 (Pacte vert & Climat) ou Scénario 2 (Sécurité énergétique & Géopolitique).</li>
          <li><strong>Graine aléatoire (Seed) :</strong> Garantit la reproductibilité scientifique et comparative des simulations.</li>
          <li><strong>Répartition des élèves :</strong> Attribution automatique des 19 rôles selon la taille du groupe (de 10 à 45 participants).</li>
        </ul>
      `
    },
    {
      id: 'invariants-master',
      title: '2. Invariants et contrôle de conformité',
      level: 2,
      contentHtml: `
        <p>Le superviseur veille aux invariants fondamentaux du jeu :</p>
        <ul>
          <li>Refuser l’auto-attribution ou le transfert non autorisé d’une carte reçue.</li>
          <li>Ne jamais délivrer de nouvelle carte sans contrôle formel du registre.</li>
          <li>Les notes du simulateur et les points de cartes doivent rester distincts.</li>
        </ul>
      `
    },
    {
      id: 'sauvegarde-session',
      title: '3. Sauvegarde et reprise de session',
      level: 2,
      contentHtml: `
        <p>L’application fonctionne 100% hors-ligne grâce à l’export/import JSON :</p>
        <div class="guide-callout info">
          <strong>Périmètre de sauvegarde :</strong> Scénario, directive, inputs, seed, parcours actif, amendements sélectionnés, état complet des votes de co-législation et accord financier.
        </div>
      `
    }
  ]
};
