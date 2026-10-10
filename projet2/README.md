# UE-SIMU — Simulateur de Décision & Négociation Européenne (Projet 2)

Refonte complète en **TypeScript strict**, intégrant un moteur de simulation unifié et déterministe, une interface réactive conçue en priorité pour les smartphones (**mobile-first**), des schémas d'explication des mécanismes de calcul et une documentation technique exhaustive par fichier.

---

## 🌟 Points Forts de la Refonte

1. **Moteur unifié & Couplage Causal Strict** :
   - Fin de la décorrélation entre l'Union européenne et les États membres.
   - Les directives et compromis négociés impactent les 6 pays selon leurs matrices de sensibilité sectorielles.
   - Les indicateurs européens annuels résultent de la synthèse pondérée par la population réelle des États membres.
2. **Reproductibilité Numérique** :
   - Générateur pseudo-aléatoire déterministe (Mulberry32) à graine contrôlée (`seed: 42`).
   - Deux apprenants soumettant les mêmes choix obtiennent strictement les mêmes projections.
3. **Ergonomie Mobile-First** :
   - Interface réactive sans débordement horizontal, avec barre de navigation inférieure tactile sur smartphone.
   - Graphiques Chart.js optimisés avec info-bulles tactiles et alternative tabulaire accessible.
   - Boutons contextuels « Comprendre ce graphique » avec tiroirs pédagogiques explicatifs.
4. **Schémas de Transparence Pédagogique** :
   - Diagrammes vectoriels SVG explicitant la causalité et les boucles de rétroaction pour chaque grand enjeu.
5. **Déploiement Statique Garanti** :
   - Compatible avec GitHub Pages sans nécessiter de serveur applicatif.

---

## 🚀 Commandes Utiles

Toutes les commandes s'exécutent depuis le dossier `projet2/` :

```bash
# Installation des dépendances
npm install

# Démarrer le serveur de développement (Vite)
npm run dev

# Vérification stricte des types TypeScript
npm run typecheck

# Exécution des tests unitaires automatisés (Vitest)
npm test

# Compilation du livrable statique pour la production
npm run build

# Prévisualiser le livrable statique localement
npm run preview
```

---

## 📁 Architecture du Dossier `projet2/`

```text
projet2/
├── src/
│   ├── domain/        # Types, contrats et dictionnaires des indicateurs
│   ├── data/          # Profils des États, partis, lobbies et chargeur de scénarios
│   ├── simulation/    # Moteur unifié, PRNG déterministe, calculs purs
│   ├── state/         # Store réactif partagé (AppStore)
│   ├── ui/            # Composants d'interface (directives, simulateur, graphiques, acteurs)
│   ├── pedagogy/      # Schémas causaux vectoriels SVG et textes d'explication
│   ├── styles/        # Feuille de styles CSS mobile-first
│   └── main.ts        # Point d'entrée de l'application
├── public/            # Ressources statiques (images, drapeaux, scénarios JSON)
├── tests/             # Tests unitaires automatisés (Vitest)
├── docs/
│   ├── wiki/          # Documentation par fichier, glossaire et guides
│   ├── model/         # Matrice d'audit et registre mathématique des équations
│   └── decisions/     # Registre des décisions d'architecture (ADR)
├── dist/              # Livrable statique prêt pour GitHub Pages
├── index.html         # Point d'entrée HTML
├── package.json       # Dépendances et scripts de développement
├── tsconfig.json      # Configuration TypeScript stricte
└── vite.config.ts     # Configuration Vite (base relative './')
```

---

## 📚 Documentation Technique

* [Matrice d'audit et de migration](docs/model/audit_matrix.md)
* [Registre des équations](docs/model/equations.md)
* [Architecture et flux de données](docs/wiki/architecture_map.md)
* [Documentation détaillée par fichier](docs/wiki/files_documentation.md)
* [Guide de déploiement GitHub Pages](docs/wiki/deployment_guide.md)
* [Glossaire](docs/wiki/glossary.md)
