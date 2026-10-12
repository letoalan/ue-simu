# Documentation Technique par Fichier — Wiki des Sources (UE-SIMU)

Ce document constitue la référence exhaustive de l'architecture modulaire de `projet2/src/`.  
**Règle stricte d'ingénierie logicielle appliquée : aucun fichier ne dépasse 200 lignes.**  
Tous les modules sont strictement typés en TypeScript, testés avec Vitest (111 tests unitaires et d'intégration validés), et garantissent une expérience responsive fluide (bureau et smartphones tactiles).

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
   * 6.10. Page d'Accueil & Négociation Institutionnelle
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

### 6.10. Page d'Accueil & Négociation Institutionnelle (`src/ui/landing/`)
Ce module regroupe la landing page d'accueil, le sélecteur de parcours UX, l'atelier d'impression des 89 cartes de négociation/influence (format A7 sur planches A4), la vidéo de fond immersive et le lecteur complet de guides. Il est structuré en **3 sous-dossiers thématiques** et respecte rigoureusement la règle d'aucun fichier > 200 lignes :

#### 6.10.1. Sous-dossier Cartes (`src/ui/landing/cards/`)
* **`cardsTypes.ts`** (28 lignes) : Contrats d'interfaces des cartes de jeu (`ActorCardDefinition`, `ActorDefinition`, `CardType`).
* **`actorsCatalog.ts`** (199 lignes) : Catalogue officiel des 19 acteurs décisionnels (Commission, 6 États, 6 Partis, 6 Lobbies) et métadonnées associées.
* **`cardsData.ts`** (65 lignes) : Générateur du stock strict des 89 cartes (`generateAllCards()`, `filterCardsByActors()`, `generateReplacementCard()`).
* **`cardsWorkshopTypes.ts`** (22 lignes) : Types pour l'atelier des cartes (`WorkshopMode`, `PreviewTab`, `PrintFilter`, `WorkshopState`, `Sheet`).
* **`cardsWorkshopCardRenderers.ts`** (83 lignes) : Gabarits HTML stricts pour les faces Recto et Verso des cartes A7 (format 74mm × 105mm).
* **`cardsWorkshopSheets.ts`** (82 lignes) : Découpage en planches 2×2 (miroir horizontal au verso), calcul des métriques et visionneuse de planches A4.
* **`cardsWorkshopSubPanels.ts`** (115 lignes) : Sélecteurs de mode de tirage (acteur unique, sur-mesure, réimpression) et lecteur 3D unitaire avec retournement interactif.
* **`cardsWorkshopPrint.ts`** (121 lignes) : Moteur d'impression papier/PDF isolé (`@media print`) et exportateur de document HTML autonome (`ue-simu-cartes-89.html`).
* **`cardsWorkshopEvents.ts`** (134 lignes) : Gestionnaires d'événements de l'atelier (modes, filtres, sélection d'acteurs, impression, export).
* **`cardsWorkshopView.ts`** (197 lignes) : Contrôleur orchestrateur principal de l'Atelier des 89 cartes et état local.

#### 6.10.2. Sous-dossier Guides Référentiels (`src/ui/landing/guides/`)
* **`guideTypes.ts`** (24 lignes) : Structures des guides pédagogiques (`GuideDefinition`, `GuideSection`).
* **`guideJoueurData.ts`** (114 lignes) : Référentiel complet du Guide du Participant (règles, rôles, codécision, débriefing).
* **`guideAnimateurData.ts`** (86 lignes) : Guide de Conduite de Séance (animation du trilogue, quorums, arbitrage des cartes).
* **`guideMasterData.ts`** (71 lignes) : Guide du Maître du Jeu (graine PRNG, configuration, équilibrage des 19 rôles, sauvegardes).
* **`guidesData.ts`** (13 lignes) : Dictionnaire réactif agrégeant les 3 guides (`GUIDES_DATA`).
* **`guideReaderRenderers.ts`** (109 lignes) : Rendu des 3 niveaux de lecture (Essentiel en 2 min, Guide complet avec sommaire latéral, Ressources).
* **`guideReaderExport.ts`** (41 lignes) : Utilitaires de téléchargement du fichier Markdown source et du modèle de Registre officiel en CSV.
* **`guideReaderView.ts`** (177 lignes) : Contrôleur du lecteur de guides, bascule d'onglets, navigation fluide et déclenchement de parcours.

#### 6.10.3. Sous-dossier Composants (`src/ui/landing/components/`)
* **`landingHero.ts`** (79 lignes) : En-tête Hero immersive avec **vidéo de background YouTube intégrée** (`_k5MnY859Wo`), calque transparent adapté clair/sombre, statut de session active et boutons d'appel à l'action.
* **`landingJourneys.ts`** (92 lignes) : Grille comparative des 3 parcours (Participant, Animateur, Maître du Jeu).
* **`landingResources.ts`** (88 lignes) : Bloc podcasts audio immersifs et modèle de registre de cartes CSV à télécharger.
* **`landingFooter.ts`** (39 lignes) : Pied de page officiel avec liens rapides et crédits d'adaptation.
* **`workflowView.ts`** (99 lignes) : Présentation des 3 temps pédagogiques de la séance (Négocier le texte, Négocier les moyens, Comprendre les conséquences).

#### 6.10.4. Racine du Module (`src/ui/landing/`)
* **`landingView.ts`** (146 lignes) : Orchestrateur maître de la page d'accueil assemblant l'ensemble des blocs avec écouteurs d'événements.
* **`index.ts`** (14 lignes) : Barrel file réexportant l'ensemble des modules du dossier `landing/`.
* Forwarders de compatibilité ascendante (`cardsData.ts`, `guidesData.ts`, `cardsWorkshopView.ts`, etc.).

---

## 7. Feuilles de Styles Modulaires & Ergonomie Mobile (`src/styles/`)

Chaque feuille de style respecte rigoureusement la limite des 200 lignes et assure un rendu optimal en mode clair et sombre :

1. **`src/styles/tokens.css`** (125 lignes) : Tokens CSS, palette chromatique UE, variables HSL clair/sombre, élévations et typographies.
2. **`src/styles/layout.css`** (85 lignes) : Structure principale `#app`, conteneur `.main-layout`, cartes de gestion de session locale et grille responsive (`.grid-2`, `.grid-3`).
3. **`src/styles/header.css`** (190 lignes) : En-tête applicative ergonomique compacte sur 2 niveaux : Ligne 1 (Logo UE-SIMU, navigation desktop centrée, sélecteur clair/sombre) et Ligne 2 (Sélecteur de parcours UX et **cartouche de rappel de contexte actif** `.active-context-cartouche` côte à côte, équilibrés et harmonieux).
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
21. **`src/styles/landing.css`** (19 lignes) : Agrégateur modulaire important l'ensemble des 14 feuilles de styles du sous-dossier `src/styles/landing/`.
22. **Sous-dossier `src/styles/landing/`** (14 feuilles thématiques) :
    * `landingLayout.css` (57 lignes) : Conteneur racine de la page d'accueil et grille de section.
    * `landingHero.css` (176 lignes) : Bannière héroïque avec **vidéo de background YouTube**, iframe non bloquant, calque semi-transparent clair/sombre et actions principales.
    * `landingJourneys.css` (108 lignes) : Grille comparative et cartes des 3 parcours UX.
    * `landingWorkshop.css` (198 lignes) : Conteneurs des étapes de l'atelier, sélecteurs radio et barre d'onglets.
    * `landingCustomActors.css` (71 lignes) : Grille de sélection tactile des 19 acteurs et badges d'entités.
    * `landingCards.css` (173 lignes) : Rendu dimensionnel strict des cartes A7 (74mm × 105mm, repères de coupe en pointillés).
    * `landingFlipCard.css` (60 lignes) : Scène 3D avec retournement interactif de carte au clic.
    * `landingSheets.css` (71 lignes) : Rendu des planches réelles 2×2 pour impression A4 portrait et guide d'impression.
    * `landingWorkflow.css` (194 lignes) : Cartes de déroulement en 3 temps et flèches directionnelles.
    * `landingGuideReader.css` (197 lignes) : Lecteur d'articles avec sommaire sticky et navigation par niveau.
    * `landingCallouts.css` (52 lignes) : Blocs d'alerte pédagogiques (info, avertissement) et tableaux stylisés.
    * `landingResources.css` (160 lignes) : Fiches de ressources téléchargeables, carrousel audio podcast et boîte CSV.
    * `landingFooter.css` (78 lignes) : Pied de page officiel avec mentions légales et partenaires.
    * `landingPrint.css` (79 lignes) : Règles d'isolation de l'impression `@media print` avec gestion des sauts de page A4.
23. **`src/styles/main.css`** (26 lignes) : Point d'entrée CSS principal intégrant tous les modules applicatifs.

