# Matrice d'audit et de migration — UE-SIMU

Ce document détaille l'audit préalable de l'ancienne version (`projet1/`) et formalise le plan de migration vers la nouvelle architecture TypeScript (`projet2/`).

---

## 1. Cartographie de l'existant (`projet1/`)

| Composant existant | Fichier source | Problèmes identifiés | Traitement dans projet2 |
|---|---|---|---|
| **Moteur UE & États** | `script/chronology/3-main/simulator/engine/index.js` | • Décorrélation totale entre UE et États : l'UE effectuait une marche aléatoire libre (`Math.random()`), les États évoluaient séparément sans feed-back.<br>• Lecture directe du DOM (`document.getElementById`).<br>• Raccourci de cache bancal dans `index-bride.js` pour masquer la non-reproductibilité. | Moteur unifié pur (`src/simulation/engine.ts`). Aucun accès DOM. Pseudo-aléatoire à graine fixe (PRNG déterministe et reproductible). Agrégation causale explicite UE–États. |
| **Profils des États** | `script/state/index.js` (const `profiles`, `euStatesData`) | Données hardcodées dans un fichier d'état mixte avec mutations directes. | Types explicites stricts (`src/domain/actors.ts`), données isolées (`src/data/profiles.ts`). Données historiques 100% préservées. |
| **Partis Politiques** | `script/state/index.js` + `engine/index.js` (`simulerPolitique`) | Mutation d'objets partagés globaux (`parti.satisfactionArr`, etc.) lors des affichages. | Calcul pur : les résultats sont immutables dans l'état annuel (`SimulationResult`). |
| **Groupes d'Intérêt (Lobbies)** | `script/state/index.js` + `engine/index.js` (`simulerLobbies`) | Idem, écrasement en place des propriétés des lobbies à chaque clic de sélecteur. | Trajectoires calculées une seule fois lors de la simulation annuelle, résultats immutables. |
| **Scénarios & Directives** | `json/scenario1.json`, `json/scenario2.json` | Chargement asynchrone non typé, pas de validation schema. | Validation runtime et typage strict (`src/domain/scenario.ts`, `src/data/scenarios.ts`). |
| **Interface Graphique** | `components/*.html`, `script/chronology/*` | Manipulation dispersée du DOM, mise en page non optimisée pour smartphone (débordements, graphiques tronqués). | Interface réactive moderne et modulaire (`src/ui/`), mobile-first, navigation par onglets/tiroir sans rechargement. |
| **Explications Pédagogiques** | Inexistantes ou partielles | Manque d'explication des formules pour les apprenants. | Panneaux contextuels « Comprendre ce graphique », diagrammes visuels des flux de causalité, équations vulgarisées. |

---

## 2. Matrice de migration détaillée

| Élément | Source originale | Destination TypeScript | Traitement | Validation / Test |
|---|---|---|---|---|
| **Types de domaine** | Dispersés / implicites | `src/domain/` | Définition des interfaces : `Actor`, `Country`, `Party`, `Lobby`, `Indicator`, `YearState`, `SimulationResult` | `npm run typecheck` strict |
| **Profils des 6 pays** | `state/index.js` | `src/data/countries.ts` | 6 pays préservés (DE, FR, IT, HU, PL, SE) avec populations, sensibilités et valeurs initiales exactes | Test unitaire de conformité des profils |
| **Profils des 6 partis** | `state/index.js` | `src/data/parties.ts` | PPE, S&D, Renew, Verts/ALE, ECR, GUE avec poids et sièges initiaux | Test unitaire des pondérations |
| **Profils des 6 lobbies** | `state/index.js` | `src/data/lobbies.ts` | Big Tech, Fossiles, Banques, Agrochimie, Pharma, Auto avec facteurs de réputation/influence | Test unitaire des facteurs d'influence |
| **Données Scénarios 1 & 2** | `json/scenario*.json` | `public/json/` & `src/data/scenarios.ts` | Validation au chargement, restitution fidèle des amendements et impacts | Validation des structures JSON |
| **Générateur aléatoire** | `Math.random()` | `src/simulation/prng.ts` | Algorithme Mulberry32 à graine reproductible par défaut (seed: 42) avec support de graine personnalisée | Test de reproductibilité identique |
| **Calculateur UE & Pays** | `engine/index.js` | `src/simulation/engine.ts` | Couplage causal : les décisions impactent les pays selon leurs sensibilités, l'UE est la synthèse cohérente pondérée | Test unitaire des invariants |
| **Calculateur Partis** | `engine/index.js` | `src/simulation/partiesEngine.ts` | Calcul pur sans mutation | Test des scores |
| **Calculateur Lobbies** | `engine/index.js` | `src/simulation/lobbiesEngine.ts` | Calcul pur sans mutation | Test de dynamique concurrentielle |
| **Composant Graphique** | `charts/index.js` | `src/ui/charts.ts` | Graphiques Chart.js responsives, tooltips tactiles, options mobiles, alternative tabulaire | Rendu multi-écrans |
| **Documentation par fichier** | Absente | `docs/wiki/*.md` | Une page par fichier de source TypeScript expliquant rôle, entrées, sorties, dépendances | Vérification documentaire |
