# Documentation Technique par Fichier — Wiki des Sources (UE-SIMU)

Ce document constitue la référence exhaustive de l'architecture modulaire de `projet2/src/`.  
**Règle stricte d'ingénierie logicielle appliquée : aucun fichier ne dépasse 200 lignes.**  
Tous les modules sont strictement typés en TypeScript, testés avec Vitest (105 tests unitaires et d'intégration validés), et garantissent une expérience responsive fluide (bureau et smartphones tactiles).

---

## Sommaire de l'Architecture

1. [Couche Métier & Types (`src/domain/`)](#1-couche-métier--types-srcdomain)
2. [Couche Données & Profils (`src/data/`)](#2-couche-données--profils-srcdata)
3. [Moteur Mathématique & Simulation (`src/simulation/`)](#3-moteur-mathématique--simulation-srcsimulation)
4. [Gestionnaire d'État Réactif, Audio & Thème (`src/state/`)](#4-gestionnaire-détat-réactif-audio--thème-srcstate)
5. [Pédagogie & Modélisation Causale (`src/pedagogy/`)](#5-pédagogie--modélisation-causale-srcpedagogy)
6. [Composants d'Interface Utilisateur Modulaires (`src/ui/`)](#6-composants-dinterface-utilisateur-modulaires-srcui)
   * 6.1. Navigation & Point d'entrée
   * 6.2. Immersion & Rôles
   * 6.3. Scénarios, Directives & Sandbox
   * 6.4. Fiches Acteurs & Cartographie
   * 6.5. Séance de Vote & Codécision
   * 6.6. Simulateur & Trajectoires
   * 6.7. Moteur Graphique Chart.js
   * 6.8. Pédagogie & Institutions
   * 6.9. Composants Flottants & Accessibilité
7. [Feuilles de Styles Modulaires & Ergonomie Mobile (`src/styles/`)](#7-feuilles-de-styles-modulaires--ergonomie-mobile-srcstyles)

---

## 1. Couche Métier & Types (`src/domain/`)

### `src/domain/types.ts`
* **Rôle** : Répertoire central des contrats d'interfaces, types discriminés et structures de données de la simulation.
* **Taille** : 193 lignes ($\le 200$).
* **Entrées / Sorties** : Déclarations de types purs (`ScenarioId`, `CountryCode`, `PartyCode`, `LobbyCode`, `CountryProfile`, `PartyProfile`, `LobbyProfile`, `YearState`, `SimulationInputs`, `SimulationResult`, `Directive`, `Amendment`).
* **Dépendances** : Aucune dépendance externe.
* **Tests** : Validé implicitement par `tsc --noEmit` et par l'ensemble des 105 tests Vitest.

### `src/domain/indicators.ts`
* **Rôle** : Formalise le dictionnaire d'indicateurs macroéconomiques et sociopolitiques, leurs bornes [min, max], leurs unités et les utilitaires de normalisation.
* **Taille** : 120 lignes ($\le 200$).
* **Fonctions exportées** : `INDICATORS_META`, `normalizeValue(val, min, max)`, `clamp(val, min, max)`.
* **Tests** : `tests/data.test.ts`.

### `src/domain/financeTypes.ts`
* **Rôle** : Définition des structures financières pour le pacte budgétaire et d'investissement.
* **Taille** : 69 lignes ($\le 200$).

### `src/domain/parliamentTypes.ts` & `src/domain/realizationTypes.ts`
* **Rôle** : Typage de la composition parlementaire et des contrats de réalisation.
* **Taille** : 28 lignes et 24 lignes ($\le 200$).

---

## 2. Couche Données & Profils (`src/data/`)

### `src/data/countries.ts`
* **Rôle** : Profils initiaux des 6 États membres du Conseil (DE, FR, IT, PL, SE, HU), populations et matrices de pondération démographique.
* **Taille** : 146 lignes ($\le 200$).
* **Fonctions / Objets exportés** : `COUNTRIES_META`, `COUNTRIES_PROFILES`.
* **Tests** : `tests/data.test.ts`, `tests/institutionalTotals.test.ts`.

### `src/data/parties.ts`
* **Rôle** : Profils des 6 familles politiques du Parlement européen (PPE, S&D, Renew, Verts/ALE, ECR, GUE), effectifs de sièges initiaux et matrices de sensibilités doctrinales.
* **Taille** : 59 lignes ($\le 200$).
* **Objets exportés** : `PARTIES_PROFILES`.
* **Tests** : `tests/data.test.ts`.

### `src/data/lobbies.ts`
* **Rôle** : Profils des 6 groupes d'intérêt sectoriels (Big Tech, Énergies Fossiles, Banques, Agrochimie, Pharma, Automobile), scores de réputation et coefficients d'influence institutionnelle.
* **Taille** : 77 lignes ($\le 200$).
* **Objets exportés** : `LOBBIES_PROFILES`.
* **Tests** : `tests/data.test.ts`.

### `src/data/scenarios.ts`
* **Rôle** : Chargeur asynchrone des scénarios et des directives associées.
* **Taille** : 139 lignes ($\le 200$).
* **Fonctions exportées** : `loadScenario(id)`, `loadDirectiveDetails(sId, dId)`.

### `src/data/actorSheetsTypes.ts`, `actorSheetsFallbacks.ts` & `actorSheets.ts`
* **Rôle** : Typage, fallbacks déterministes et orchestrateur de chargement asynchrone des fiches de négociation d'acteurs.
* **Tailles** : 77, 117 et 192 lignes ($\le 200$).
* **Tests** : `tests/actorSheets.test.ts`.

---

## 3. Moteur Mathématique & Simulation (`src/simulation/`)

### `src/simulation/prng.ts`
* **Rôle** : Générateur pseudo-aléatoire déterministe fondé sur Mulberry32.
* **Taille** : 31 lignes ($\le 200$).
* **Fonctions exportées** : `createPRNG(seed)`.
* **Tests** : `tests/prng.test.ts`, `tests/reproducibility.test.ts`.

### `src/simulation/countryTrajectories.ts`
* **Rôle** : Trajectoires nationales des États membres (PIB, CO₂, Gini, VEB, Normandie, V-Dem) et score de succès national.
* **Taille** : 128 lignes ($\le 200$).
* **Tests** : `tests/simulation.test.ts`, `tests/politicalSensitivity.test.ts`.

### `src/simulation/partiesEngine.ts`
* **Rôle** : Dynamique des 6 groupes politiques au Parlement : satisfaction, score doctrinal et redistribution des 720 sièges.
* **Taille** : 112 lignes ($\le 200$).
* **Tests** : `tests/simulation.test.ts`, `tests/dynamics.test.ts`.

### `src/simulation/lobbiesEngine.ts`
* **Rôle** : Dynamique d'influence des 6 lobbies sectoriels (Conseil, Parlement, Commission, réputation publique).
* **Taille** : 133 lignes ($\le 200$).
* **Tests** : `tests/simulation.test.ts`, `tests/successScores.test.ts`.

### `src/simulation/engine.ts`
* **Rôle** : Moteur unifié de simulation temporelle (2025-2034) et agrégation macroéconomique globale.
* **Taille** : 161 lignes ($\le 200$).
* **Tests** : `tests/simulation.test.ts`, `tests/aggregation.test.ts`.

### `src/simulation/sandboxTypes.ts`
* **Rôle** : Contrats d'interfaces et types discriminés pour la simulation différentielle Sandbox (`SandboxActorType`, `SandboxScope`, `KPIDelta`, `ActorKPISummary`, `SandboxComparisonResult`).
* **Taille** : 44 lignes ($\le 200$).

### `src/simulation/sandboxActorDeltas.ts`
* **Rôle** : Calcul des deltas différentiels actoriels (Conseil, Parlement, Lobbies) entre la proposition initiale et la proposition amendée.
* **Taille** : 159 lignes ($\le 200$).
* **Fonction exportée** : `computeActorKPIDeltas(comparison, scope)`.
* **Tests** : `tests/sandboxEngine.test.ts`.

### `src/simulation/sandboxEngine.ts`
* **Rôle** : Façade et moteur comparatif ceteris paribus (Baseline vs Sandbox) calculant l'impact cumulé des amendements adoptés sur 10 ans.
* **Taille** : 105 lignes ($\le 200$).
* **Fonctions exportées** : `computeSandboxComparison()`, ré-exporte `sandboxTypes` et `sandboxActorDeltas`.
* **Tests** : `tests/sandboxEngine.test.ts`.

---

## 4. Gestionnaire d'État Réactif, Audio & Thème (`src/state/`)

### `src/state/storeTypes.ts`
* **Rôle** : Typage centralisé du store et des actions législatives.
* **Taille** : 82 lignes ($\le 200$).

### `src/state/store.ts`
* **Rôle** : Singleton central réactif `store` orchestrant l'état applicatif.
* **Taille** : 180 lignes ($\le 200$).

### `src/state/theme.ts`
* **Rôle** : Gestionnaire de thème Clair / Sombre avec persistance localStorage et synchronisation DOM `data-theme`.
* **Taille** : 79 lignes ($\le 200$).
* **Tests** : `tests/theme.test.ts`.

### `src/state/audioPlayerTypes.ts`
* **Rôle** : Types discriminés du lecteur audio (`AudioType`, `ActiveTrack`, `AudioPlayerState`, `AudioListener`) et résolveur d'URL candidates (m4a/mp3).
* **Taille** : 34 lignes ($\le 200$).

### `src/state/audioPlayer.ts`
* **Rôle** : Service audio singleton gérant la lecture, pause, reprise, scrubber, vitesses variables (1x, 1.25x, 1.5x, 2x) et fallback automatique en environnement Node/navigateur.
* **Taille** : 188 lignes ($\le 200$).
* **Tests** : `tests/audioPlayer.test.ts`.

---

## 5. Pédagogie & Modélisation Causale (`src/pedagogy/`)

* **`src/pedagogy/schemas/`** : Schémas causaux vectoriels modulaires (`schemaMacroEU.ts`, `schemaCountry.ts`, `schemaParliament.ts`, `schemaLobbies.ts`).
* **`src/pedagogy/chartAnalyzer.ts`** (105 lignes) : Moteur d'analyse pédagogique des inflexions de courbes.
* **`src/pedagogy/pedagogyConcepts.ts`** (86 lignes) : Dictionnaire didactique des institutions européennes.

---

## 6. Composants d'Interface Utilisateur Modulaires (`src/ui/`)

### 6.1. Navigation & Point d'entrée
* **`src/main.ts`** (77 lignes) : Montage de l'application et abonnement au cycle de vie du store.
* **`src/ui/layout/navigation.ts`** (157 lignes) : Barre d'en-tête responsive smartphone à deux niveaux (`app-header`), marque UE, badge de scénario/directive compact, sélecteur de parcours UX et barre tactile basse smartphone (`mobile-nav`).

### 6.2. Immersion & Rôles (`src/ui/intro/`)
* **`src/ui/intro/introCarouselView.ts`**, **`introImmersionView.ts`**, **`introGroupsView.ts`**, **`introRolesView.ts`**, **`groupAllocator.ts`** : Tous $\le 180$ lignes.

### 6.3. Scénarios, Directives & Sandbox (`src/ui/scenario/`)
* **`src/ui/scenario/scenarioDetailView.ts`** (159 lignes) : Carte détaillée de la proposition actuelle, boutons d'écoute audio (podcast & synthèse) et liste interactive des amendements.
* **`src/ui/scenario/scenarioView.ts`** (120 lignes) : Vue maîtresse des 8 directives par scénario et sélecteur de grand enjeu.
* **`src/ui/scenario/amendmentSandboxSelectorsHtml.ts`** (118 lignes) : Rendu HTML du sélecteur contextuel d'acteurs et des boutons de filtrage d'indicateurs.
* **`src/ui/scenario/amendmentSandboxPartySplitHtml.ts`** (60 lignes) : Vue dédoublée spécifique aux partis dans la Sandbox (hémicycle des 720 sièges avec progression d'un côté, graphique de satisfaction de l'autre).
* **`src/ui/scenario/amendmentSandboxModalHtml.ts`** (165 lignes) : Gabarit HTML complet de la modale Bac à Sable (en-tête, grille KPI delta, split view ou graphique standard, amendements et pied de page).
* **`src/ui/scenario/amendmentSandboxModal.ts`** (163 lignes) : Contrôleur modal interactif, réactivité en direct aux coches d'amendements, bascule d'échelle (UE, États, Partis, Lobbies), pilotage de l'hémicycle interactif et routage.

### 6.4. Fiches Acteurs & Cartographie (`src/ui/actors/`)
* **`src/ui/actors/countryMap.ts`** (126 lignes) : Carte géographique vectorielle de l'Europe mettant en valeur les coordonnées des États membres.
* **`src/ui/actors/actorsSheetCard.ts`** (171 lignes), **`actorsDashboard.ts`** (113 lignes), **`actorsView.ts`** (163 lignes).

### 6.5. Séance de Vote & Codécision (`src/ui/vote/`)
* **`src/ui/vote/voteView.ts`**, **`voteCouncilView.ts`**, **`voteParliamentView.ts`**, **`voteSummaryView.ts`** : Tous $\le 160$ lignes.

### 6.6. Simulateur & Trajectoires (`src/ui/simulator/`)
* **`src/ui/simulator/simulatorControls.ts`** (110 lignes), **`simulatorView.ts`** (158 lignes), **`chartZoomModal.ts`**, **`presentationMode.ts`**.

### 6.7. Moteur Graphique Chart.js (`src/ui/charts/`)
* **`src/ui/charts/chartsSandboxDatasets.ts`** (97 lignes) : Extraction et construction des séries temporelles comparatives pour UE, Pays, Partis et Lobbies.
* **`src/ui/charts/chartsSandboxParty.ts`** (98 lignes) : Moteur Chart.js dédié à la trajectoire temporelle de satisfaction d'un groupe politique sous amendements.
* **`src/ui/charts/chartsSandbox.ts`** (110 lignes) : Rendu Chart.js comparatif à double courbe (pointillés = référence, plein = sandbox) avec focus métrique.
* **`src/ui/charts/hemicycleChart.ts`** (131 lignes) : Rendu SVG de l'hémicycle (720 sièges, seuil 361), calcul angulaire, sélection interactive et delta vs référence.
* **`src/ui/charts/chartsEU.ts`**, **`chartsCountry.ts`**, **`chartsNonState.ts`**, **`chartBase.ts`**, **`chartTable.ts`**.

### 6.8. Pédagogie & Institutions (`src/ui/pedagogy/`)
* **`src/ui/pedagogy/pedagogyView.ts`**, **`pedagogyModal.ts`**, **`pedagogyQuiz.ts`**, **`institutionsView.ts`**.

### 6.9. Composants Flottants & Accessibilité (`src/ui/components/`)
* **`src/ui/components/audioDock.ts`** (198 lignes) : Lecteur audio dockable persistant en bas d'écran avec barre de progression temporelle, sauts $\pm 15$s, vitesse de lecture et volume.

---

## 7. Feuilles de Styles Modulaires & Ergonomie Mobile (`src/styles/`)

Chaque feuille de style respecte rigoureusement la limite des 200 lignes et assure un rendu optimal en mode clair et sombre :

1. **`src/styles/tokens.css`** (125 lignes) : Tokens CSS, palette chromatique UE, variables HSL clair/sombre, élévations et typographies.
2. **`src/styles/layout.css`** (85 lignes) : Structure principale `#app`, conteneur `.main-layout`, cartes de gestion de session locale et grille responsive (`.grid-2`, `.grid-3`).
3. **`src/styles/header.css`** (110 lignes) : En-tête applicative ergonomique mobile-first (`.app-header`), répartition sur 2 niveaux sur smartphone (`header-top-row` avec brand + scenario-badge + theme-toggle, et `journey-switcher` en pleine largeur), et intégration continue fluide sur desktop via `display: contents`.
4. **`src/styles/nav.css`** (168 lignes) : Navigation desktop et barre inférieure mobile `mobile-nav` adaptée aux hauteurs d'écran de smartphones.
5. **`src/styles/journey.css`** (66 lignes) : Sélecteur segmenté de parcours UX (Participant, Animateur, Maître du Jeu) fluide sur smartphone avec répartition égale des onglets.
6. **`src/styles/components.css`** (128 lignes) : Composants de base, cartes, boutons tactiles ($\ge 44$px de hauteur minimale), formulaires.
7. **`src/styles/schemas.css`** (37 lignes) : Diagrammes vectoriels SVG.
8. **`src/styles/directives.css`** (132 lignes) : Cartes de directives et badges institutionnels.
9. **`src/styles/media.css`** (152 lignes) : Conteneurs vidéo et médias.
10. **`src/styles/subnav.css`** (73 lignes) : Sous-onglets horizontaux défilants au doigt.
11. **`src/styles/voteStepper.css`** (133 lignes) : Stepper de vote en 10 étapes.
12. **`src/styles/vote.css`** (126 lignes) : Écrans de co-législation et jauges de majorité.
13. **`src/styles/presentation.css`** (103 lignes) : Mode vidéoprojection haute lisibilité.
14. **`src/styles/pedagogy.css`** (53 lignes) : Tiroirs d'explications pédagogiques.
15. **`src/styles/audioPlayer.css`** (107 lignes) : Boutons d'écoute podcast & synthèse et ondes animées.
16. **`src/styles/audioDock.css`** (178 lignes) : Dock audio flottant avec positionnement au-dessus de la barre mobile sur smartphone.
17. **`src/styles/sandbox.css`** (182 lignes) : Modale de bac à sable prévisionnel, grille de cartes delta et zone de graphique Chart.js.
18. **`src/styles/sandboxActors.css`** (159 lignes) : Onglets acteurs scrollables, sélecteur d'entité et grille KPI compacte sur petit écran.
19. **`src/styles/sandboxAmendments.css`** (75 lignes) : Liste des amendements avec bascule en direct et bouton déclencheur dégradé.
20. **`src/styles/sandboxPartySplit.css`** (65 lignes) : Vue dédoublée spécifique aux partis politiques (hémicycle interactif et graphique de satisfaction côte à côte).
21. **`src/styles/main.css`** (25 lignes) : Point d'entrée CSS intégrant les 20 modules par `@import`.
