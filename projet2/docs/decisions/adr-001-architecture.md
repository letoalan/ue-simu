# ADR-001 : Choix d'Architecture et Principes Fondateurs — Projet 2

## Statut
Accepté et validé avec le propriétaire du projet.

## Contexte
L'ancienne version présentait une décorrélation entre les projections de l'Union européenne et celles des États membres, utilisait un générateur aléatoire non déterministe (`Math.random()`), accédait directement au DOM pour extraire des valeurs lors des calculs, et mutait des variables globales en cours d'exécution.

## Décisions Clés

### 1. Moteur unifié et calcul pur
* Tous les calculs de simulation sont des fonctions pures ne dépendant d'aucun élément du DOM ni d'aucun graphique.
* Une simulation produit un résultat complet (`SimulationResult`) contenant les trajectoires de l'UE, des 6 pays, des 6 partis et des 6 lobbies sur 10 ans (2025–2034).
* Tous les composants d'interface (graphiques, tableaux, fiches) consomment ce même résultat sans jamais recalculer.

### 2. Reproductibilité par PRNG à graine
* Utilisation d'un générateur pseudo-aléatoire déterministe (Mulberry32).
* Par défaut, une graine fixe (seed: 42) assure que deux utilisateurs exécutant la même proposition obtiennent au millième près les mêmes résultats.
* Possibilité pour les enseignants de configurer une graine spécifique si souhaité.

### 3. Couplage causal explicite UE – États
* Les décisions politiques agissent sur les trajectoires nationales selon leurs matrices de sensibilité.
* Les indicateurs européens sont agrégés par moyenne pondérée par la population des 6 États membres représentatifs.

### 4. Interface mobile-first sans framework lourd
* Utilisation de TypeScript strict avec manipulation ciblée et réactive du DOM, pour éviter l'alourdissement par un framework externe (React/Angular/Vue), conformément au besoin de simplicité et de pérennité.
* Interface optimisée en priorité pour les smartphones : navigation fluide par onglets/tiroir, graphiques Chart.js tactiles avec tooltips adaptés, boutons contextuels « Comprendre ce graphique ».

### 5. Compatibilité GitHub Pages
* Compilation statique via Vite (`base: './'`).
* Déploiement sans serveur applicatif.
