# 🇪🇺 UE-SIMU — Simulateur & Jeu de Rôle Parlementaire Européen

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-105%20tests%20passés-brightgreen?logo=vitest)](https://vitest.dev/)
[![Mode Clair / Sombre](https://img.shields.io/badge/Thème-Clair%20%7C%20Sombre-purple)](#)
[![Mobile Ready](https://img.shields.io/badge/Ergonomie-Smartphone%20%26%20Desktop-orange)](#)

> **UE-SIMU** est une plateforme web pédagogique et interactive de simulation institutionnelle conçue pour l'enseignement supérieur, le secondaire et les formations aux affaires européennes. Elle permet d'incarner 19 acteurs décisionnels (États, partis politiques, lobbies, Commission), de négocier des amendements et de simuler en temps réel les trajectoires socio-économiques et environnementales de l'Union européenne sur 10 ans (2025–2034).

---

## 🎯 Objectifs Pédagogiques

- **Comprendre la procédure législative ordinaire (co-législation)** : négociation trilogue, quorums au Conseil (majorité qualifiée : 55% des États et 65% de la population) et seuil de majorité au Parlement européen (361 sièges sur 720).
- **Expérimenter les compromis politiques transnationaux** : balance d'intérêts entre sensibilités partisanes, priorités nationales des États membres et pressions sectorielles de la société civile.
- **Visualiser l'impact systémique** : mesurer les retombées directes de chaque directive et amendement sur le PIB, les émissions de CO₂, les inégalités (Gini), le bien-être (VEB) et la satisfaction démocratique.

---

## 🧭 3 Parcours Utilisateurs Dédiés (UX)

L'interface s'adapte dynamiquement selon le rôle choisi via un sélecteur fluide dans l'en-tête :

| Parcours | Public cible | Fonctionnalités clés |
| :--- | :--- | :--- |
| 🎓 **Participant** | Élève / Délégué | Fiche de rôle secrète, préparation des arguments, dépôt d'amendements, suivi de la satisfaction de son entité. |
| 🎙️ **Animateur** | Enseignant / Présidence | Conduite de séance en direct, vérification des quorums, centralisation des votes officiels et projection grand écran. |
| ⚙️ **Maître du Jeu** | Superviseur / Organisateur | Attribution automatique des 19 rôles aux élèves, contrôle du générateur d'aléas (PRNG), gestion des sauvegardes locales. |

---

## 🏛️ Les 19 Rôles Incarnables

```
                                 🇪🇺 Commission Européenne
                                   (Initiative législative)
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
       🏛️ Conseil de l'UE (6 États)                       🇪🇺 Parlement Européen (6 Groupes)
   • 🇫🇷 France         • 🇩🇪 Allemagne                 • 🔵 PPE (Chrétiens-démocrates - 182s)
   • 🇮🇹 Italie         • 🇵🇱 Pologne                   • 🔴 S&D (Socialistes & Démocrates - 154s)
   • 🇸🇪 Suède          • 🇭🇺 Hongrie                   • 🟡 Renew (Centristes / Libéraux - 102s)
                                                      • 🟢 Verts/ALE (Écologistes - 53s)
                                                      • 🟤 ECR (Conservateurs - 78s)
                                                      • 🟣 GUE/NGL (Gauche radicale - 46s)
                                             ▲
                                             │ Influence & Plaidoyer
                              💼 Lobbies & Société Civile (6 Acteurs)
              • 🌱 Agrochimie & Bio-agriculture       • 🚗 Industrie Automobile
              • 💶 Finance Verte & Banques            • 🛢️ Énergies Fossiles & Transition
              • 💊 Industrie Pharmaceutique           • 💻 Géants de la Tech & IA
```

---

## ⚡ Fonctionnalités Clés

- **🔬 Bac à Sable Prévisionnel (Sandbox)** :
  - Simulation instantanée de l'effet des amendements négociés avant le vote définitif.
  - **Vue dédoublée (split-view) spécifique aux partis** : projection en temps réel de l'hémicycle (720 sièges) avec progression électorale d'un côté, et graphique d'évolution de la satisfaction des députés de l'autre.
- **📊 Moteur Graphique Chart.js Comparatif** : double courbe (pointillés = référence initiale sans amendement, trait plein = projection modifiée).
- **🗺️ Cartographie Vectorielle Européenne** : carte géographique interactive mettant en valeur les États membres et leurs indicateurs.
- **🎧 Dock Audio Persistant** : écoute des podcasts immersifs et synthèses audio de chaque directive avec contrôle de vitesse, saut temporel et volume.
- **🌓 Ergonomie Moderne & Thème Sombre** : design tokens HSL, mode sombre complet, adaptation fluide aux écrans smartphones (testé notamment sur 476×861 et petits viewports).
- **💾 Sauvegarde Locale Hors-Ligne** : export/import de session JSON sans dépendance à un serveur externe.

---

## 🛠️ Stack Technique & Architecture

- **Langages** : TypeScript strict, HTML5 sémantique, CSS3 Vanilla modulaire.
- **Outillage** : [Vite](https://vitejs.dev/) (bundler ultra-rapide), [Chart.js](https://www.chartjs.org/) (dataviz), [Vitest](https://vitest.dev/) (tests unitaires).
- **Règle de modularité stricte** : Chaque fichier source sous `projet2/src/` respecte une limite rigoureuse de **$\le 200$ lignes** pour garantir maintenabilité et lisibilité.

### Structure du Code (`projet2/src/`)

```text
projet2/
├── src/
│   ├── data/            # Fiches acteurs, scénarios, partis, directives
│   ├── domain/          # Types métier, règles de vote et de co-législation
│   ├── simulation/      # Moteur mathématique, calcul des 10 ans, PRNG, Sandbox
│   ├── state/           # Store réactif applicatif, gestion du thème, audio
│   ├── styles/          # 20 feuilles CSS modulaires (< 200 lignes, mode clair/sombre)
│   ├── ui/              # Vues et composants (Intro, Scénarios, Sandbox, Votes, Cartes)
│   └── main.ts          # Point d'entrée de l'application
├── tests/               # 21 suites de tests automatisés (105 tests Vitest)
└── dist/                # Bundle de production compilé
```

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) version 20 ou supérieure (v22 recommandée)
- `npm`

### Installation & Lancement Local

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/letoalan/ue-simu.git
   cd ue-simu/projet2
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application est accessible sur `http://localhost:3000`.

---

## 🧪 Tests & Qualité du Code

```bash
# Vérification stricte des types TypeScript
npm run typecheck

# Exécution des 105 tests unitaires et d'intégration
npm test

# Compilation du bundle de production
npm run build
```

---

## 🌐 Déploiement

Le projet est configuré pour se déployer automatiquement sur **GitHub Pages** via GitHub Actions à chaque mise à jour de la branche principale (`master` ou `main`).

---

## 📖 Documentation Détaillée

Pour consulter l'inventaire exhaustif de tous les modules, leurs responsabilités et leur nombre de lignes, reportez-vous au wiki interne :
👉 **[`projet2/docs/wiki/files_documentation.md`](projet2/docs/wiki/files_documentation.md)**

---

## 📄 Licence

Ce projet est sous licence MIT — libre d'utilisation et d'adaptation dans un cadre éducatif et institutionnel.
