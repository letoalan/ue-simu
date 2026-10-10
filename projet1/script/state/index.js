/**
 * Contient les références aux éléments du DOM collectées au démarrage.
 */
export const DOMRefs = {};

/**
 * Contient les instances des graphiques Chart.js pour un accès global.
 */
export const ChartInstances = {};

/**
 * Cache pour les résultats de simulation pour stabiliser les projections.
 * La clé est une combinaison unique représentant les entrées d'une simulation.
 * La valeur est le résultat de la simulation.
 */
export const SimulationCache = new Map();

/**
 * Stocke les données des scénarios chargées au démarrage de l'application.
 */
export const ScenariosData = {
    1: null,
    2: null
};

/**
 * Centralise l'état partagé de l'application pour éviter les variables globales.
 * Chaque module lit et écrit dans cet objet.
 */
export const AppState = {
    // --- État privé ---
    _currentScenarioId: null,
    _currentScenarioName: '',
    _selectedDirectiveId: null,
    _selectedDirectiveDescription: '',
    _currentCountryId: 'DE',
    _currentPartyId: 'PPE',
    _currentLobbyId: 'BIG_TECH',
    _currentScenarioData: null,

    // --- Getters (lecture de l'état) ---
    get currentScenarioId() { return this._currentScenarioId; },
    get currentScenarioName() { return this._currentScenarioName; },
    get selectedDirectiveId() { return this._selectedDirectiveId; },
    get selectedDirectiveDescription() { return this._selectedDirectiveDescription; },
    get currentCountryId() { return this._currentCountryId; },
    get currentPartyId() { return this._currentPartyId; },
    get currentLobbyId() { return this._currentLobbyId; },
    get currentScenarioData() { return this._currentScenarioData; },

    // --- Setters (modification de l'état) ---
    setScenario(id, name, data) {
        this._currentScenarioId = id;
        this._currentScenarioName = name;
        this._currentScenarioData = data;
        console.log(`State Change: Scénario -> ${id} (${name})`);
    },
    selectDirective(id, description) {
        this._selectedDirectiveId = id;
        this._selectedDirectiveDescription = description;
        console.log(`State Change: Directive -> ${id}`);
    },
    selectCountry: (id) => { AppState._currentCountryId = id; },
    selectParty: (id) => { AppState._currentPartyId = id; },
    selectLobby: (id) => { AppState._currentLobbyId = id; },
};

/**
 * Vide le cache de simulation. Doit être appelé lors d'un changement de contexte majeur
 * (ex: sélection d'une nouvelle directive).
 */
export function clearSimulationCache() {
    SimulationCache.clear();
    console.log("Cache de simulation vidé.");
}
// ----------------------------------------------------------------
// 2. Simulation-wide constants
// ----------------------------------------------------------------
export const simulationYears = Array.from({ length: 10 }, (_, i) => 2025 + i);
export const chartIdsToClone = ['euChart', 'countryChart', 'politiqueChart', 'lobbyChart'];

// ----------------------------------------------------------------
// 3. Static data sets
// ----------------------------------------------------------------

// EU member states
export const euStatesData = [
    { name: "Allemagne", code: "DE", population: 84.3, icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" },
    { name: "France", code: "FR", population: 64.7, icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" },
    { name: "Italie", code: "IT", population: 58.9, icon: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg" },
    { name: "Hongrie", code: "HU", population: 9.6, icon: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg" },
    { name: "Pologne", code: "PL", population: 38.0, icon: "https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg" },
    { name: "Suède", code: "SE", population: 10.5, icon: "https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg" }
];

// Political parties
export const politicalPartiesData = [
    { name: "Parti Vert", code: "Verts/ALE", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fc/EGP-Logo_2017.svg" },
    { name: "Parti Socialiste et démocrate", code: "S&D", icon: "https://upload.wikimedia.org/wikipedia/en/b/b8/Logo_of_the_European_Social_Democratic_Party.svg" },
    { name: "Parti Conservateur", code: "PPE", icon: "https://upload.wikimedia.org/wikipedia/en/a/a3/European_People%27s_Party_logo.svg" },
    { name: "Parti Libéral", code: "Renew", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Logo_of_Renew_Europe.svg" },
    { name: "Parti de Gauche", code: "GUE/NGL", icon: "https://upload.wikimedia.org/wikipedia/commons/0/01/Logo_of_The_Left_in_the_European_Parliament.svg" },
    { name: "Parti d'extrême droite (ECR)", code: "ECR", icon: "https://upload.wikimedia.org/wikipedia/en/1/15/Logo_of_the_European_Conservatives_and_Reformists_Party.svg" }
];

// Lobby groups
export const lobbyGroupsData = [
    { name: "Tech Géants", code: "TG", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Agrochimie", code: "AC", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Logo_Bayer.svg" },
    { name: "Énergies fossiles", code: "EF", icon: "https://upload.wikimedia.org/wikipedia/fr/f/f7/Logo_TotalEnergies.svg" },
    { name: "Banque et Finance", code: "BF", icon: "https://upload.wikimedia.org/wikipedia/fr/d/d9/BNP_Paribas_2009.svg" },
    { name: "Big Pharma", code: "BP", icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Astrazeneca_text_logo.svg" },
    { name: "Automobile", code: "Auto", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Volkswagen_Group_Logo_2023.svg" }
];

// ----------------------------------------------------------------
// 4. Weighting matrices and profiles
// ----------------------------------------------------------------

// Party weightings
export const pondPartis = {
    PPE: { pib: 0.35, gini: 0.05, co2: 0.00, veb: 0.05, stab: 0.30, dem: 0.10, idh: 0.15 },
    SDE: { pib: 0.15, gini: 0.25, co2: 0.10, veb: 0.10, stab: 0.15, dem: 0.15, idh: 0.10 },
    RENEW: { pib: 0.25, gini: 0.10, co2: 0.10, veb: 0.10, stab: 0.15, dem: 0.15, idh: 0.15 },
    VERT: { pib: 0.05, gini: 0.15, co2: 0.35, veb: 0.25, stab: 0.05, dem: 0.10, idh: 0.10 },
    ECR: { pib: 0.30, gini: 0.05, co2: 0.00, veb: 0.05, stab: 0.35, dem: 0.05, idh: 0.10 },
    GUE: { pib: 0.05, gini: 0.35, co2: 0.10, veb: 0.10, stab: 0.05, dem: 0.20, idh: 0.15 }
};

// Country profiles (development & geopolitics)
export const profiles = {
    DE: {
        name: "Allemagne",
        dev: {
            init: { croiss: 1.5, gini: 0.29, co2: 7, veb: 85 },
            sens: { croiss_co2: 0.13, co2_veb: 0.10, veb_gini: 0.06, veb_croiss: 0.07 },
            pond: { croiss: 0.21, gini: 0.25, co2: 0.18, veb: 0.18 }
        },
        geo: {
            init: { normandie: 85, vdem: 0.88, pib: 1.5, idh: 0.94 },
            sens: { norm_vdem: 0.10, vdem_norm: 0.10, norm_pib: 0.09, norm_idh: 0.08, pib_idh: 0.07 },
            pond: { normandie: 0.28, vdem: 0.21, pib: 0.19, idh: 0.18 }
        }
    },
    FR: {
        name: "France",
        dev: {
            init: { croiss: 1.2, gini: 0.32, co2: 5, veb: 80 },
            sens: { croiss_co2: 0.12, co2_veb: 0.11, veb_gini: 0.07, veb_croiss: 0.09 },
            pond: { croiss: 0.20, gini: 0.27, co2: 0.18, veb: 0.17 }
        },
        geo: {
            init: { normandie: 80, vdem: 0.85, pib: 1.2, idh: 0.92 },
            sens: { norm_vdem: 0.10, vdem_norm: 0.10, norm_pib: 0.08, norm_idh: 0.09, pib_idh: 0.07 },
            pond: { normandie: 0.26, vdem: 0.22, pib: 0.18, idh: 0.18 }
        }
    },
    PL: {
        name: "Pologne",
        dev: {
            init: { croiss: 2.8, gini: 0.31, co2: 8, veb: 70 },
            sens: { croiss_co2: 0.18, co2_veb: 0.13, veb_gini: 0.08, veb_croiss: 0.10 },
            pond: { croiss: 0.28, gini: 0.20, co2: 0.16, veb: 0.14 }
        },
        geo: {
            init: { normandie: 75, vdem: 0.77, pib: 2.8, idh: 0.89 },
            sens: { norm_vdem: 0.08, vdem_norm: 0.08, norm_pib: 0.11, norm_idh: 0.09, pib_idh: 0.09 },
            pond: { normandie: 0.30, vdem: 0.18, pib: 0.22, idh: 0.12 }
        }
    },
    IT: {
        name: "Italie",
        dev: {
            init: { croiss: 0.8, gini: 0.35, co2: 6, veb: 75 },
            sens: { croiss_co2: 0.11, co2_veb: 0.14, veb_gini: 0.09, veb_croiss: 0.12 },
            pond: { croiss: 0.18, gini: 0.28, co2: 0.17, veb: 0.17 }
        },
        geo: {
            init: { normandie: 70, vdem: 0.80, pib: 0.8, idh: 0.90 },
            sens: { norm_vdem: 0.09, vdem_norm: 0.09, norm_pib: 0.10, norm_idh: 0.10, pib_idh: 0.08 },
            pond: { normandie: 0.22, vdem: 0.19, pib: 0.19, idh: 0.20 }
        }
    },
    SE: {
        name: "Suède",
        dev: {
            init: { croiss: 1.7, gini: 0.25, co2: 3, veb: 95 },
            sens: { croiss_co2: 0.07, co2_veb: 0.07, veb_gini: 0.05, veb_croiss: 0.06 },
            pond: { croiss: 0.15, gini: 0.30, co2: 0.15, veb: 0.25 }
        },
        geo: {
            init: { normandie: 90, vdem: 0.92, pib: 1.7, idh: 0.96 },
            sens: { norm_vdem: 0.12, vdem_norm: 0.13, norm_pib: 0.07, norm_idh: 0.10, pib_idh: 0.10 },
            pond: { normandie: 0.24, vdem: 0.27, pib: 0.13, idh: 0.22 }
        }
    },
    HU: {
        name: "Hongrie",
        dev: {
            init: { croiss: 1.0, gini: 0.39, co2: 6.5, veb: 65 },
            sens: { croiss_co2: 0.19, co2_veb: 0.16, veb_gini: 0.11, veb_croiss: 0.13 },
            pond: { croiss: 0.28, gini: 0.15, co2: 0.13, veb: 0.13 }
        },
        geo: {
            init: { normandie: 60, vdem: 0.66, pib: 1.0, idh: 0.86 },
            sens: { norm_vdem: 0.15, vdem_norm: 0.15, norm_pib: 0.13, norm_idh: 0.13, pib_idh: 0.13 },
            pond: { normandie: 0.19, vdem: 0.22, pib: 0.22, idh: 0.13 }
        }
    }
};

// ----------------------------------------------------------------
// 5. Parties & Lobbies – base definitions
// ----------------------------------------------------------------

export const partis = {
    PPE: {
        nom: "Parti Populaire Européen",
        couleur: "#3399FF",
        base: { meps: 182, conseil: 35, commissaires: 9, influence: 0.35 },
        impact: { eco: 0.6, social: 0.3, env: 0.1, geo: 0.4 }
    },
    SDE: {
        nom: "Socialistes & Démocrates",
        couleur: "#FF0000",
        base: { meps: 154, conseil: 28, commissaires: 7, influence: 0.25 },
        impact: { eco: 0.4, social: 0.7, env: 0.5, geo: 0.3 }
    },
    RENEW: {
        nom: "Renouveau Européen",
        couleur: "#FFD700",
        base: { meps: 102, conseil: 17, commissaires: 5, influence: 0.15 },
        impact: { eco: 0.5, social: 0.5, env: 0.3, geo: 0.6 }
    },
    VERT: {
        nom: "Verts/ALE",
        couleur: "#00FF00",
        base: { meps: 72, conseil: 12, commissaires: 3, influence: 0.10 },
        impact: { eco: 0.2, social: 0.4, env: 0.9, geo: 0.2 }
    },
    ECR: {
        nom: "Conservateurs & Réformistes",
        couleur: "#0000FF",
        base: { meps: 62, conseil: 9, commissaires: 2, influence: 0.08 },
        impact: { eco: 0.7, social: 0.1, env: 0.1, geo: 0.5 }
    },
    GUE: {
        nom: "Gauche Unitaire",
        couleur: "#FF00FF",
        base: { meps: 39, conseil: 5, commissaires: 1, influence: 0.07 },
        impact: { eco: 0.3, social: 0.8, env: 0.4, geo: 0.3 }
    }
};

// Lobby definitions
export const lobbies = {
    BIG_TECH: {
        nom: "Big Tech",
        couleur: "#00AEEF",
        base: { reputation: 80, infEtats: 40, infParlement: 70, infCommission: 60 },
        facteurs: {
            rep: { croissance: 0.2, democratie: -0.4, sante: 0.1 },
            inf: { croissance: 0.3, securite: 0.2, democratie: -0.2 }
        },
        ennemis: ['democratie']
    },
    ENERGIES_FOSSILES: {
        nom: "Énergies Fossiles",
        couleur: "#424242",
        base: { reputation: 40, infEtats: 70, infParlement: 50, infCommission: 50 },
        facteurs: {
            rep: { croissance: 0.2, ecologie: -0.5, securite: 0.2 },
            inf: { croissance: 0.1, securite: 0.3, ecologie: -0.4 }
        },
        ennemis: ['ecologie']
    },
    BANQUES_FINANCE: {
        nom: "Banques & Finance",
        couleur: "#FBC02D",
        base: { reputation: 60, infEtats: 60, infParlement: 65, infCommission: 65 },
        facteurs: {
            rep: { croissance: 0.3, securite: -0.2, stabilite: 0.3 },
            inf: { croissance: 0.4, stabilite: 0.4, democratie: 0.1 }
        },
        ennemis: []
    },
    AGROCHIMIE: {
        nom: "Agrochimie",
        couleur: "#689F38",
        base: { reputation: 50, infEtats: 65, infParlement: 60, infCommission: 55 },
        facteurs: {
            rep: { croissance: 0.1, ecologie: -0.4, sante: -0.2 },
            inf: { croissance: 0.1, securite: 0.2, ecologie: -0.3 }
        },
        ennemis: ['ecologie', 'sante']
    },
    PHARMA: {
        nom: "Industrie Pharmaceutique",
        couleur: "#D32F2F",
        base: { reputation: 75, infEtats: 55, infParlement: 60, infCommission: 70 },
        facteurs: {
            rep: { sante: 0.5, croissance: 0.1, democratie: -0.1 },
            inf: { sante: 0.4, croissance: 0.2, stabilite: 0.2 }
        },
        ennemis: []
    },
    AUTOMOBILE: {
        nom: "Industrie Automobile",
        couleur: "#616161",
        base: { reputation: 65, infEtats: 75, infParlement: 60, infCommission: 50 },
        facteurs: {
            rep: { croissance: 0.3, ecologie: -0.3 },
            inf: { croissance: 0.3, ecologie: -0.2, stabilite: 0.1 }
        },
        ennemis: ['ecologie']
    }
};