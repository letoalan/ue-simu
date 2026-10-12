# Carte de l'Architecture — Projet 2 (TypeScript)

## 1. Vue d'Ensemble des Flux de Données

```mermaid
flowchart TD
    subgraph Data & Domain
        Scenarios["scenarios.json / Directives"] --> Store
        Profiles["countries / parties / lobbies"] --> Engine
    end

    subgraph State
        Store["AppStore (Store Réactif)"]
    end

    subgraph Simulation [Moteur Unifié]
        Engine["runSimulation(inputs)"]
        PRNG["Mulberry32 PRNG (Seed)"] --> Engine
        Engine --> Nations["6 États Membres (DE, FR, IT, PL, SE, HU)"]
        Nations --> Aggregation["Agrégation UE Pondérée (Population)"]
        Aggregation --> PartiesSim["simulateParties()"]
        Aggregation --> LobbiesSim["simulateLobbies()"]
        PartiesSim --> Res["SimulationResult (Immutable)"]
        LobbiesSim --> Res
    end

    Store -->|Trigger| Engine
    Engine -->|Update Result| Store

    subgraph UI Mobile-First
        Store --> UI_Landing["Vue Accueil, Parcours & Atelier Cartes"]
        Store --> UI_Directives["Vue Directives & Négociation"]
        Store --> UI_Simulateur["Vue Simulateur & Graphiques"]
        Store --> UI_Acteurs["Vue Fiches Acteurs"]
        Store --> UI_Pedagogie["Vue Décryptage & Schémas"]
        Store --> UI_Institutions["Vue Institutions"]
    end
```

## 2. Responsabilités des Modules

* **`src/domain/`** : Contrats de typage stricts et métadonnées des indicateurs sans logique d'interface.
* **`src/data/`** : Profils statiques immuables et chargeur de scénarios avec validation.
* **`src/simulation/`** : Fonctions pures de calcul de la simulation (aucune dépendance DOM/UI).
* **`src/state/`** : Gestionnaire d'état partagé (AppStore) avec modèle publication/souscription.
* **`src/ui/`** : Composants graphiques et formulaires ergonomiques, conçus en priorité pour les smartphones.
* **`src/pedagogy/`** : Schémas causaux SVG interactifs et textes d'explication par graphique.
