let charts = {};
let lobbyChart = null; // Déjà présent dans le fichier mais souvent géré à part.
const simulationYears = Array.from({length: 10}, (_, i) => 2025 + i);
let currentScenario = 1; // <--- C'est ici que 'currentScenario' est déclarée
let currentScenarioData = null;
let globalLobbySelectElement = null;
let globalLobbyChartCanvas = null;
let globalLobbyScoreDiv = null;
let currentParti = 'PPE';
let scenario1ParamsDiv;
let scenario2ParamsDiv;
let scenarioDisplayDiv;

// --- Déclarations des variables globales ---
let scenario1Data = null; // Stockera les données complètes de scenario1.json
let scenario2Data = null; // Stockera les données complètes de scenario2.json

// S'assurer que ces variables sont accessibles globalement via 'window'
window.selectedScenarioId = null; // MODIFIÉ: Utilisation cohérente de window.
window.selectedScenarioName = ''; // MODIFIÉ: Utilisation cohérente de window.
window.selectedScenarioOverview = ''; // MODIFIÉ: Utilisation cohérente de window.
window.selectedDirectiveId = null; // MODIFIÉ: Utilisation cohérente de window.
window.selectedDirectiveDescription = ''; // MODIFIÉ: Utilisation cohérente de window.

// Références aux éléments HTML (déclarées globalement, initialisées dans DOMContentLoaded)
let selectScenarioBtns;
let drawScenarioBtn;
let drawDirectiveBtn;
let launchSimulationBtn;
let scenario1TableBody;
let scenario2TableBody;
let scenarioColumns;
let carousel; // Rendre la variable du carrousel accessible globalement si nécessaire, ou la passer en paramètre
let slides;
let totalSlides;
let currentSlide = 0; // Position actuelle de la slide du carrousel

// Déclarations pour le carrousel
let dots;
let prevBtn;
let nextBtn;
let tabContents;
let tabButtons;

let fullscreenChartModal;
let closeFullscreenModalBtn;
let fullscreenChartContainer;
let currentZoomedChartId = null; //


// Global variables for student allocation (from previous steps)
let groups = {};
let groupedDataForCsv = {
    commission: [],
    states: [],
    parties: [],
    lobbies: []
};
let dataSource = 'manual'; // Peut être 'manual' ou 'excel'
let downloadCsvBtn; // Déclarée ici, initialisée dans DOMContentLoaded
let students = [];

//let euChart = null, countryChart = null,
let politiqueChart = null;
let currentCountryId = 'DE'; // Pays par défaut (Allemagne)
let statsUE = null; // Pour stocker les résultats de la simulation UE globalement
let dashboardCountrySelect = null; // NOUVEAU: Référence au sélecteur de pays

// Définir chartIdsToClone comme constante globale
const chartIdsToClone = ['euChart', 'countryChart', 'politiqueChart', 'lobbyChart'];
const dashboardCharts = {}; // Pour stocker les graphiques du tableau de bord

// Data for group display (ensure these are available globally or within this scope)
const euStatesData = [
    { name: "Allemagne", code: "DE", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" },
    { name: "France", code: "FR", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" },
    { name: "Italie", code: "IT", icon: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg" },
    { name: "Hongrie", code: "HU", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg" },
    { name: "Pologne", code: "PL", icon: "https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg" },
    { name: "Suède", code: "SE", icon: "https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg" }
];

const politicalPartiesData = [
    { name: "Parti Vert", code: "Verts/ALE", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fc/EGP-Logo_2017.svg" },
    { name: "Parti Socialiste et démocrate", code: "S&D", icon: "https://upload.wikimedia.org/wikipedia/en/b/b8/Logo_of_the_European_Social_Democratic_Party.svg" },
    { name: "Parti Conservateur", code: "PPE", icon: "https://upload.wikimedia.org/wikipedia/en/a/a3/European_People%27s_Party_logo.svg" },
    { name: "Parti Libéral", code: "Renew", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Logo_of_Renew_Europe.svg" },
    { name: "Parti de Gauche", code: "GUE/NGL", icon: "https://upload.wikimedia.org/wikipedia/commons/0/01/Logo_of_The_Left_in_the_European_Parliament.svg" },
    { name: "Parti d'extrême droite (ECR)", code: "ECR", icon: "https://upload.wikimedia.org/wikipedia/en/1/15/Logo_of_the_European_Conservatives_and_Reformists_Party.svg" }
];

const lobbyGroupsData = [
    { name: "Tech Géants", code: "TG", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Agrochimie", code: "AC", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Logo_Bayer.svg" },
    { name: "Énergies fossiles", code: "EF", icon: "https://upload.wikimedia.org/wikipedia/fr/f/f7/Logo_TotalEnergies.svg" },
    { name: "Banque et Finance", code: "BF", icon: "https://upload.wikimedia.org/wikipedia/fr/d/d9/BNP_Paribas_2009.svg" },
    { name: "Big Pharma", code: "BP", icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Astrazeneca_text_logo.svg" },
    { name: "Automobile", code: "Auto", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Volkswagen_Group_Logo_2023.svg" }
];
const pondPartis = {
    PPE: {pib: 0.35, gini: 0.05, co2: 0.00, veb: 0.05, stab: 0.30, dem: 0.10, idh: 0.15},
    SDE: {pib: 0.15, gini: 0.25, co2: 0.10, veb: 0.10, stab: 0.15, dem: 0.15, idh: 0.10},
    RENEW: {pib: 0.25, gini: 0.10, co2: 0.10, veb: 0.10, stab: 0.15, dem: 0.15, idh: 0.15},
    VERT: {pib: 0.05, gini: 0.15, co2: 0.35, veb: 0.25, stab: 0.05, dem: 0.10, idh: 0.10},
    ECR: {pib: 0.30, gini: 0.05, co2: 0.00, veb: 0.05, stab: 0.35, dem: 0.05, idh: 0.10},
    GUE: {pib: 0.05, gini: 0.35, co2: 0.10, veb: 0.10, stab: 0.05, dem: 0.20, idh: 0.15}
};
console.log("LOG 2: Valeur de 'pondPartis' juste après la déclaration globale :", pondPartis);

// --- Profils pays (reprends ici tes profils précédents, exemple simplifié) ---
const profiles = {
    DE: {
        name: "Allemagne",
        dev: {
            init: {croiss: 1.5, gini: 0.29, co2: 7, veb: 85},
            sens: {croiss_co2: 0.13, co2_veb: 0.10, veb_gini: 0.06, veb_croiss: 0.07},
            pond: {croiss: 0.21, gini: 0.25, co2: 0.18, veb: 0.18}
        },
        geo: {
            init: {normandie: 85, vdem: 0.88, pib: 1.5, idh: 0.94},
            sens: {norm_vdem: 0.10, vdem_norm: 0.10, norm_pib: 0.09, norm_idh: 0.08, pib_idh: 0.07},
            pond: {normandie: 0.28, vdem: 0.21, pib: 0.19, idh: 0.18}
        }
    },
    FR: {
        name: "France",
        dev: {
            init: {croiss: 1.2, gini: 0.32, co2: 5, veb: 80},
            sens: {croiss_co2: 0.12, co2_veb: 0.11, veb_gini: 0.07, veb_croiss: 0.09},
            pond: {croiss: 0.20, gini: 0.27, co2: 0.18, veb: 0.17}
        },
        geo: {
            init: {normandie: 80, vdem: 0.85, pib: 1.2, idh: 0.92},
            sens: {norm_vdem: 0.10, vdem_norm: 0.10, norm_pib: 0.08, norm_idh: 0.09, pib_idh: 0.07},
            pond: {normandie: 0.26, vdem: 0.22, pib: 0.18, idh: 0.18}
        }
    },
    PL: {
        name: "Pologne",
        dev: {
            init: {croiss: 2.8, gini: 0.31, co2: 8, veb: 70},
            sens: {croiss_co2: 0.18, co2_veb: 0.13, veb_gini: 0.08, veb_croiss: 0.10},
            pond: {croiss: 0.28, gini: 0.20, co2: 0.16, veb: 0.14}
        },
        geo: {
            init: {normandie: 75, vdem: 0.77, pib: 2.8, idh: 0.89},
            sens: {norm_vdem: 0.08, vdem_norm: 0.08, norm_pib: 0.11, norm_idh: 0.09, pib_idh: 0.09},
            pond: {normandie: 0.30, vdem: 0.18, pib: 0.22, idh: 0.12}
        }
    },
    IT: {
        name: "Italie",
        dev: {
            init: {croiss: 0.8, gini: 0.35, co2: 6, veb: 75},
            sens: {croiss_co2: 0.11, co2_veb: 0.14, veb_gini: 0.09, veb_croiss: 0.12},
            pond: {croiss: 0.18, gini: 0.28, co2: 0.17, veb: 0.17}
        },
        geo: {
            init: {normandie: 70, vdem: 0.80, pib: 0.8, idh: 0.90},
            sens: {norm_vdem: 0.09, vdem_norm: 0.09, norm_pib: 0.10, norm_idh: 0.10, pib_idh: 0.08},
            pond: {normandie: 0.22, vdem: 0.19, pib: 0.19, idh: 0.20}
        }
    },
    SE: {
        name: "Suède",
        dev: {
            init: {croiss: 1.7, gini: 0.25, co2: 3, veb: 95},
            sens: {croiss_co2: 0.07, co2_veb: 0.07, veb_gini: 0.05, veb_croiss: 0.06},
            pond: {croiss: 0.15, gini: 0.30, co2: 0.15, veb: 0.25}
        },
        geo: {
            init: {normandie: 90, vdem: 0.92, pib: 1.7, idh: 0.96},
            sens: {norm_vdem: 0.12, vdem_norm: 0.13, norm_pib: 0.07, norm_idh: 0.10, pib_idh: 0.10},
            pond: {normandie: 0.24, vdem: 0.27, pib: 0.13, idh: 0.22}
        }
    },
    HU: {
        name: "Hongrie",
        dev: {
            init: {croiss: 1.0, gini: 0.39, co2: 6.5, veb: 65},
            sens: {croiss_co2: 0.19, co2_veb: 0.16, veb_gini: 0.11, veb_croiss: 0.13},
            pond: {croiss: 0.28, gini: 0.15, co2: 0.13, veb: 0.13}
        },
        geo: {
            init: {normandie: 60, vdem: 0.66, pib: 1.0, idh: 0.86},
            sens: {norm_vdem: 0.15, vdem_norm: 0.15, norm_pib: 0.13, norm_idh: 0.13, pib_idh: 0.13},
            pond: {normandie: 0.19, vdem: 0.22, pib: 0.22, idh: 0.13}
        }
    }
};

// --- Profils partis ---
const partis = {
    PPE: {
        nom: "Parti Populaire Européen",
        couleur: "#3399FF",
        base: {meps: 182, conseil: 35, commissaires: 9, influence: 0.35},
        impact: {eco: 0.6, social: 0.3, env: 0.1, geo: 0.4}
    },
    SDE: {
        nom: "Socialistes & Démocrates",
        couleur: "#FF0000",
        base: {meps: 154, conseil: 28, commissaires: 7, influence: 0.25},
        impact: {eco: 0.4, social: 0.7, env: 0.5, geo: 0.3}
    },
    RENEW: {
        nom: "Renouveau Européen",
        couleur: "#FFD700",
        base: {meps: 102, conseil: 17, commissaires: 5, influence: 0.15},
        impact: {eco: 0.5, social: 0.5, env: 0.3, geo: 0.6}
    },
    VERT: {
        nom: "Verts/ALE",
        couleur: "#00FF00",
        base: {meps: 72, conseil: 12, commissaires: 3, influence: 0.10},
        impact: {eco: 0.2, social: 0.4, env: 0.9, geo: 0.2}
    },
    ECR: {
        nom: "Conservateurs & Réformistes",
        couleur: "#0000FF",
        base: {meps: 62, conseil: 9, commissaires: 2, influence: 0.08},
        impact: {eco: 0.7, social: 0.1, env: 0.1, geo: 0.5}
    },
    GUE: {
        nom: "Gauche Unitaire",
        couleur: "#FF00FF",
        base: {meps: 39, conseil: 5, commissaires: 1, influence: 0.07},
        impact: {eco: 0.3, social: 0.8, env: 0.4, geo: 0.3}
    }
};
console.log("LOG 1: Valeur de 'partis' juste après la déclaration globale :", partis);

const lobbies = {
    BIG_TECH: {
        nom: "Big Tech",
        couleur: "#00AEEF",
        base: {reputation: 80, infEtats: 40, infParlement: 70, infCommission: 60},
        // Facteurs : Comment les méta-indicateurs de l'UE affectent ce lobby
        // Positif = alignement, Négatif = opposition/risque
        facteurs: {
            rep: {croissance: 0.2, democratie: -0.4, sante: 0.1}, // La réputation souffre de la régulation démocratique (scandales GAFAM)
            inf: {croissance: 0.3, securite: 0.2, democratie: -0.2}  // L'influence monte avec le PIB et les enjeux de cybersécurité
        },
        // Ennemis : quels impacts globaux nuisent à ce lobby ?
        ennemis: ['democratie'] // La régulation forte est leur principal ennemi
    },
    ENERGIES_FOSSILES: {
        nom: "Énergies Fossiles",
        couleur: "#424242",
        base: {reputation: 40, infEtats: 70, infParlement: 50, infCommission: 50},
        facteurs: {
            rep: {croissance: 0.2, ecologie: -0.5, securite: 0.2}, // Leur réputation est inversement liée à la politique écologique
            inf: {croissance: 0.1, securite: 0.3, ecologie: -0.4}  // L'influence monte avec les enjeux de sécurité d'approvisionnement
        },
        ennemis: ['ecologie']
    },
    BANQUES_FINANCE: {
        nom: "Banques & Finance",
        couleur: "#FBC02D",
        base: {reputation: 60, infEtats: 60, infParlement: 65, infCommission: 65},
        facteurs: {
            rep: {croissance: 0.3, securite: -0.2, stabilite: 0.3}, // Les crises (sécurité/instabilité) nuisent à leur réputation
            inf: {croissance: 0.4, stabilite: 0.4, democratie: 0.1}  // L'influence est maximale en période de croissance et de stabilité
        },
        ennemis: []
    },
    AGROCHIMIE: {
        nom: "Agrochimie",
        couleur: "#689F38",
        base: {reputation: 50, infEtats: 65, infParlement: 60, infCommission: 55},
        facteurs: {
            rep: {croissance: 0.1, ecologie: -0.4, sante: -0.2}, // Souffre des politiques écologiques et de santé publique
            inf: {croissance: 0.1, securite: 0.2, ecologie: -0.3}  // Gagne en influence sur les enjeux de souveraineté alimentaire (sécurité)
        },
        ennemis: ['ecologie', 'sante']
    },
    PHARMA: {
        nom: "Industrie Pharmaceutique",
        couleur: "#D32F2F",
        base: {reputation: 75, infEtats: 55, infParlement: 60, infCommission: 70},
        facteurs: {
            rep: {sante: 0.5, croissance: 0.1, democratie: -0.1}, // Réputation très liée aux enjeux de santé (crises, IDH)
            inf: {sante: 0.4, croissance: 0.2, stabilite: 0.2}     // Influence maximale en cas de crise sanitaire
        },
        ennemis: []
    },
    AUTOMOBILE: {
        nom: "Industrie Automobile",
        couleur: "#616161",
        base: {reputation: 65, infEtats: 75, infParlement: 60, infCommission: 50},
        facteurs: {
            rep: {croissance: 0.3, ecologie: -0.3},
            inf: {croissance: 0.3, ecologie: -0.2, stabilite: 0.1}
        },
        ennemis: ['ecologie']
    }
};

/**
 * Affiche le contenu d'un onglet spécifique et masque les autres.
 * Gère également l'état "active" des boutons d'onglet et la visibilité du bouton dashboard.
 * @param {string} tabId - L'ID de l'onglet à afficher (ex: 'simulator-tab', 'group-allocation-tab', etc.).
 */
function showTab(tabId) {
    const allSections = document.querySelectorAll(".tab-section"); // Prévois cette classe pour chaque section "onglet"
    // Masquer tous les contenus d'onglets
    if (tabContents) { // tabContents doit être une variable globale (NodeList)
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
    }

    // Désactiver tous les boutons d'onglet
    if (tabButtons) { // tabButtons doit être une variable globale (NodeList)
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
    }

    // Afficher le contenu de l'onglet sélectionné et activer son bouton
    const selectedTabContent = document.getElementById(`${tabId}-content`); // Assurez-vous que vos IDs de contenu sont suffixés par '-content'
    if (selectedTabContent) {
        selectedTabContent.style.display = 'block'; // Ou 'flex', selon votre CSS pour le contenu de l'onglet
        const correspondingButton = document.querySelector(`button[data-tab="${tabId}"]`);
        if (correspondingButton) {
            correspondingButton.classList.add('active');
        }
    }

    dashboardToggle = document.getElementById('dashboardToggle'); // Assurez-vous que cette ligne est présente

    allSections.forEach(section => {
        section.style.display = section.id === tabId ? "block" : "none";
    });



    // --- Gérer la visibilité du bouton dashboardToggle ---
    if (dashboardToggle) { // dashboardToggle doit être une variable globale
        if (tabId === 'simulator-tab') {
            dashboardToggle.style.display = 'block'; // Afficher si l'onglet simulateur est actif
            console.log("LOG: dashboardToggle affiché (onglet simulateur).");
        } else {
            dashboardToggle.style.display = 'none'; // Masquer sinon
            console.log("LOG: dashboardToggle masqué (pas onglet simulateur).");

            // --- IMPORTANT : Fermer le tableau de bord si on quitte l'onglet simulateur ---
            const dashboardPanel = document.getElementById('dashboardContainer'); // dashboardContainer doit être une variable globale ou une référence locale
            if (dashboardPanel && dashboardPanel.classList.contains('open')) {
                dashboardPanel.classList.remove('open');
                document.body.style.overflow = 'auto'; // Restaurer le défilement du body
                console.log("LOG: Tableau de bord fermé automatiquement.");
            }
        }
    } else {
        console.warn("WARN: 'dashboardToggle' n'a pas été trouvé. La visibilité du bouton dashboard ne peut pas être gérée.");
    }

    console.log(`LOG: Navigation vers l'onglet : ${tabId}`);
}


/**
 * Met à jour la position du carrousel et l'indicateur de slide.
 * @param {number} index - L'index de la slide à afficher.
 */
function updateCarousel(index) {
    const carouselContainer = document.querySelector('.carousel-container');
    const mainContent = document.querySelector('.main-content');
    const transitionContainer = document.querySelector('.transition-container');

    if (carouselContainer) {
        carouselContainer.style.display = 'block'; // Ou 'flex'
    }
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    if (transitionContainer) {
        transitionContainer.style.display = 'none';
    }
    // S'assure que l'index reste dans les limites valides
    index = Math.max(0, Math.min(index, totalSlides - 1));

    if (slides[index]) {
        if ('scrollBehavior' in document.documentElement.style) {
            // Utilise le défilement doux si supporté
            carousel.scrollTo({
                left: slides[index].offsetLeft,
                behavior: 'smooth'
            });
        } else {
            // Fallback pour les navigateurs ne supportant pas le défilement doux
            carousel.scrollLeft = slides[index].offsetLeft;
        }
    }

    if (currentSlide === 5) { // currentSlide est déjà mis à jour avant cette vérification
        updateSimulatorInputsDisplay();
    }

    // Met à jour les points indicateurs
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentSlide = index; // Met à jour la slide actuelle

    // Active/Désactive les boutons de navigation aux extrémités
    if (prevBtn) prevBtn.disabled = (currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides - 1);
}


function downloadCSV(data, filename) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fonction updateChartLabels
function updateChartLabels(scenarioId) {
    // Mappage des labels pour les inputs du simulateur principal
    const inputLabelsScenario1 = {
        'pib_eu': 'PIB UE (croissance % initiale):',
        'gini_eu': 'Indice de Gini UE (0.2-0.6):',
        'co2_eu': 'CO₂/hab UE (2-10 t):',
        'veb_eu': 'VEB UE (0-100):'
    };
    const inputLabelsScenario2 = {
        'normandie_eu': 'Stabilité UE (Normandie, 0-100):',
        'vdem_eu': 'Démocratie UE (V-Dem, 0-1):',
        'pib_growth_eu': 'Croissance UE (% initiale):',
        'idh_eu': 'IDH UE (0-1):'
    };

    const currentInputLabels = scenarioId === 1 ? inputLabelsScenario1 : inputLabelsScenario2;
    const currentScenarioDataRef = scenarioId === 1 ? scenario1Data : scenario2Data;

    // IDs des inputs dans la section du simulateur principal
    // Ces IDs doivent correspondre aux IDs des inputs dans votre index5.html
    const inputIdsScenario1 = ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu'];
    const inputIdsScenario2 = ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    // Fonction utilitaire pour mettre à jour un label et un input
    const updateInputAndLabel = (id, scenarioDivId) => {
        const labelElement = document.querySelector(`#${scenarioDivId} .param-block label[for="${id}"]`);
        const inputElement = document.getElementById(id);
        if (labelElement && inputElement) {
            // Conserver le tooltip existant si présent
            const tooltipSpan = labelElement.querySelector('.tooltiptext');
            const tooltipContent = tooltipSpan ? `<span class="tooltiptext">${tooltipSpan.innerHTML}</span>` : '';
            labelElement.innerHTML = `${currentInputLabels[id]}${tooltipContent}`;

            // Mettre à jour la valeur de l'input avec les statistiques de départ du scénario
            if (currentScenarioDataRef && currentScenarioDataRef.directive && currentScenarioDataRef.directive.statistiques_depart && currentScenarioDataRef.directive.statistiques_depart[id] !== undefined) {
                inputElement.value = currentScenarioDataRef.directive.statistiques_depart[id];
            }
        }
    };

    // Mise à jour des labels et des valeurs des inputs pour le scénario 1
    inputIdsScenario1.forEach(id => updateInputAndLabel(id, 'scenario1'));

    // Mise à jour des labels et des valeurs des inputs pour le scénario 2
    inputIdsScenario2.forEach(id => updateInputAndLabel(id, 'scenario2'));

    // IMPORTANT: Supprimer la logique de mise à jour des labels de datasets des graphiques principaux ici.
    // Cette fonction ne doit s'occuper que des inputs du simulateur.
    // Les labels des graphiques sont gérés dans plotEU, plotCountry, etc.
}

// --- Fonction utilitaire pour normaliser une valeur entre 0 et 1 ---
// Cette fonction est essentielle pour les calculs de scores.
function normalize(value, min, max) {
    if (max === min) {
        // Évite la division par zéro si min et max sont identiques, retourne une valeur neutre
        return 0.5;
    }
    // Normalise la valeur entre 0 et 1 par rapport à la plage [min, max]
    return (value - min) / (max - min);
}

// --- Fonction utilitaire robuste pour récupérer les valeurs numériques des inputs HTML ---
// Elle gère les cas où l'élément n'existe pas ou la valeur n'est pas un nombre.
function getNumericValue(id, defaultValue) {
    const element = document.getElementById(id);
    if (element) {
        const value = parseFloat(element.value);
        if (isNaN(value)) {
            console.warn(`WARN: La valeur de l'élément avec l'ID '${id}' n'est pas un nombre valide. Utilisation de la valeur par défaut: ${defaultValue}`);
            return defaultValue;
        }
        return value;
    }
    console.warn(`WARN: Élément input avec l'ID '${id}' non trouvé dans le DOM. Utilisation de la valeur par défaut: ${defaultValue}`);
    return defaultValue;
}

/**
 * Met en place une synchronisation bidirectionnelle entre les inputs du simulateur principal
 * et les inputs du dashboard.
 */
function setupInputSynchronization() {
    console.log("LOG-SYNC: Mise en place de la synchronisation des inputs.");

    // 1. Définir les correspondances entre les IDs des inputs
    const scenario = currentScenario; // Utiliser la variable globale 'currentScenario'
    const mainSimulatorKeys = scenario === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const dashboardInputIds = ['param1Input', 'param2Input', 'param3Input', 'param4Input'];

    // 2. Créer les écouteurs pour chaque paire d'inputs
    dashboardInputIds.forEach((dashboardId, index) => {
        const mainId = mainSimulatorKeys[index];
        const dashboardInput = document.getElementById(dashboardId);
        const mainInput = document.getElementById(mainId);

        if (!dashboardInput || !mainInput) {
            console.warn(`WARN-SYNC: Input manquant pour la paire ${dashboardId} / ${mainId}`);
            return;
        }

        // --- Lien A : Dashboard -> Simulateur Principal ---
        // Quand l'input du dashboard change, on met à jour le simulateur principal.
        dashboardInput.addEventListener('input', () => {
            mainInput.value = dashboardInput.value;
            console.log(`SYNC: Dashboard -> Main (${mainId} mis à jour avec ${mainInput.value})`);

            // On propage aussi au mode plein écran (si jamais il est ouvert)
            syncSingleKey(mainId, parseFloat(mainInput.value), 'dashboardControls');
        });

        // --- Lien B : Simulateur Principal -> Dashboard ---
        // Quand l'input du simulateur principal change, on met à jour le dashboard.
        mainInput.addEventListener('input', () => {
            dashboardInput.value = mainInput.value;
            console.log(`SYNC: Main -> Dashboard (${dashboardId} mis à jour avec ${dashboardInput.value})`);

            // On propage aussi au mode plein écran
            syncSingleKey(mainId, parseFloat(mainInput.value), ''); // Pas d'exclusion
        });
    });
}

// --- Fonction `simulate()` : Le cœur de la logique de simulation ---
// Cette fonction orchestre l'ensemble du processus de simulation,
// de la simulation des indicateurs européens à la mise à jour des graphiques
// pour les pays, les partis politiques et les lobbies.
// --- Fonction `simulate()` : Le cœur de la logique de simulation ---
// Cette fonction orchestre l'ensemble du processus de simulation,
// de la simulation des indicateurs européens à la mise à jour des graphiques
// pour les pays, les partis politiques et les lobbies.
//Function `simulate()` - MODIFIED TO ACCEPT AN OPTIONAL PARAMETER
/* -------------------------------------------------
   NOUVELLE VERSION de simulate()
   - sans paramètre
   - lit TOUJOURS la valeur la plus récente de chaque input
   (simulateur, dashboard ou zoom)
------------------------------------------------- */
function simulate() {
    console.log("LOG 5: Valeur de 'partis' au début de la fonction simulate :", partis);
    console.log("INFO X: Début de la simulation pour le scénario :", currentScenario);

    /* 1. Lecture unifiée des paramètres */
    const keys = currentScenario === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const euInputsForSimulation = {};
    keys.forEach(k => {
        /* on prend la valeur la plus récente : le simulateur principal
           est la source de vérité car tous les autres widgets
           écrivent dedans via syncSingleKey */
        const mainInput = document.getElementById(k);
        euInputsForSimulation[k] = mainInput ? parseFloat(mainInput.value) : 0;
    });

    console.log("DEBUG: Paramètres lus :", euInputsForSimulation);

    /* 2. Simulation EU */
    const euData = simulateEU(currentScenario, euInputsForSimulation);
    if (!euData || !euData.arr1 || euData.arr1.length === 0) {
        console.error("ERREUR: simulateEU n'a pas retourné de données valides ou complètes.");
        return;
    }

    /* 3. Mise à jour des graphiques (inchangées) */
    plotEU(simulationYears, euData, currentScenario);
    showScore(euData.satisArr, "succes");

    /* 4. Peuplement de statsUE */
    statsUE = { pibArr:[], giniArr:[], co2Arr:[], vebArr:[], stabArr:[], demArr:[], idhArr:[] };
    if (currentScenario === 1) {
        statsUE.pibArr   = euData.arr1;
        statsUE.giniArr  = euData.arr2;
        statsUE.co2Arr   = euData.arr3;
        statsUE.vebArr   = euData.arr4;
        statsUE.stabArr  = Array(10).fill(getNumericValue('normandie_eu', 80));
        statsUE.demArr   = Array(10).fill(getNumericValue('vdem_eu', 0.85));
        statsUE.idhArr   = Array(10).fill(getNumericValue('idh_eu', 0.92));
    } else {
        statsUE.pibArr   = euData.arr1;
        statsUE.stabArr  = euData.arr2;
        statsUE.demArr   = euData.arr3;
        statsUE.idhArr   = euData.arr4;
        statsUE.giniArr  = Array(10).fill(getNumericValue('gini_eu', 0.3));
        statsUE.co2Arr   = Array(10).fill(getNumericValue('co2_eu', 4));
        statsUE.vebArr   = Array(10).fill(getNumericValue('veb_eu', 80));
    }

    /* 5. Reste inchangé */
    simulerPolitique(statsUE, currentScenario);
    updatePolitiqueUI();
    simulerLobbies(statsUE, currentScenario);
    createLobbyChart();
    updateCountryChartForSelectedCountry();
    if (downloadCsvBtn) downloadCsvBtn.disabled = false;
    console.log("DEBUG: Fin de la simulation.");
}

function updateSimulatorInputsDisplay() {
    // Assurez-vous que les éléments DOM sont bien initialisés avant de les utiliser.
    // Cette partie devrait idéalement être appelée dans DOMContentLoaded.
    if (!scenario1ParamsDiv) scenario1ParamsDiv = document.getElementById('scenario1');
    if (!scenario2ParamsDiv) scenario2ParamsDiv = document.getElementById('scenario2');
    if (!scenarioDisplayDiv) scenarioDisplayDiv = document.getElementById('scenario-display');

    if (scenario1ParamsDiv && scenario2ParamsDiv && scenarioDisplayDiv) {
        if (currentScenario === 1) {
            scenario1ParamsDiv.style.display = 'block';
            scenario2ParamsDiv.style.display = 'none';
            // Utilisation de window.selectedScenarioName pour un nom plus descriptif
            scenarioDisplayDiv.textContent = `Scénario choisi : ${window.selectedScenarioName || 'Développement Durable et Cohésion Sociale'}`;
            updateChartLabels(1); // Met à jour les labels et les valeurs des inputs pour le scénario 1
        } else if (currentScenario === 2) {
            scenario1ParamsDiv.style.display = 'none';
            scenario2ParamsDiv.style.display = 'block';
            // Utilisation de window.selectedScenarioName pour un nom plus descriptif
            scenarioDisplayDiv.textContent = `Scénario choisi : ${window.selectedScenarioName || 'Stabilité Géopolitique et Croissance Économique'}`;
            updateChartLabels(2); // Met à jour les labels et les valeurs des inputs pour le scénario 2
        }
    } else {
        console.warn("WARN: Éléments des paramètres de scénario ou d'affichage du scénario non trouvés pour la mise à jour.");
    }
}

/**
 * Crée ou met à jour un graphique Chart.js sur un canvas donné.
 * Gère la destruction de l'instance précédente si elle existe.
 * @param {string} chartId L'ID du canvas HTML pour le graphique.
 * @param {string} type Le type de graphique (ex: 'line', 'bar').
 * @param {object} data Les données du graphique.
 * @param {object} options Les options de configuration du graphique.
 * @returns {Chart|null} La nouvelle instance du graphique Chart.js, ou null en cas d'erreur.
 */
function createOrUpdateChart(chartId, type, data, options) {
    const ctx = document.getElementById(chartId);
    if (!ctx) {
        console.error(`ERREUR: Canvas '${chartId}' non trouvé.`);
        return null;
    }

    const chartContext = ctx.getContext('2d');
    if (!chartContext) {
        console.error(`ERREUR: Impossible d'obtenir le contexte 2D pour '${chartId}'.`);
        return null;
    }

    if (charts[chartId]) {
        charts[chartId].destroy();
        console.log(`DEBUG: Graphique existant '${chartId}' détruit.`);
    }

    try {
        const config = { type, data, options: options || {} };
        const newChartInstance = new Chart(chartContext, config);
        charts[chartId] = newChartInstance;
        console.log(`DEBUG: Graphique '${chartId}' créé avec succès.`);
        return newChartInstance;
    } catch (error) {
        console.error(`ERREUR: Échec de la création du graphique '${chartId}':`, error);
        return null;
    }
}

// --- Specific plotting functions ---

/**
 * Trace ou met à jour le graphique des indicateurs européens.
 * @param {Array<number>} years Les années de simulation.
 * @param {object} euData Les données simulées pour l'UE (arr1, arr2, arr3, arr4, satisArr).
 * @param {number} scenario Le scénario actuel (1 ou 2).
 */
function plotEU(years, euData, scenario) {
    console.log("DEBUG: plotEU called with:", { years, euData, scenario });

    // Essential data validation
    if (!euData || !Array.isArray(euData.arr1) || euData.arr1.length === 0 ||
        !Array.isArray(euData.arr2) || euData.arr2.length === 0 ||
        !Array.isArray(euData.arr3) || euData.arr3.length === 0 ||
        !Array.isArray(euData.arr4) || euData.arr4.length === 0 ||
        !Array.isArray(euData.satisArr) || euData.satisArr.length === 0) {
        console.error("ERROR: Insufficient or invalid data to plot EU chart in plotEU.");
        return;
    }

    let d1 = euData.arr1;
    let d2 = euData.arr2;
    let d3 = euData.arr3;
    let d4 = euData.arr4;
    let datasets = [];
    let scales = {}; // Déclaration de l'objet scales ici

    // Définition des labels et des datasets en fonction du scénario
    if (scenario === 1) { // Scénario Développement Durable
        datasets = [
            { label: "Croissance (%)", data: d1, borderColor: "#1976d2", backgroundColor: "#1976d222", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y3' },
            { label: "Gini", data: d2, borderColor: "#ff9800", backgroundColor: "#ff980022", borderWidth: 2.5, fill: false, borderDash: [10,6], pointRadius: 3.2, tension: 0.44, yAxisID: 'y2' },
            { label: "CO₂/hab (t)", data: d3, borderColor: "#388e3c", backgroundColor: "#388e3c22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y3' },
            { label: "VEB", data: d4, borderColor: "#8e24aa", backgroundColor: "#8e24aa22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y' },
            { label: "Satisfaction (0-1)", data: euData.satisArr, borderColor: "#d32f2f", borderWidth: 4, fill: false, borderDash: [10,6], pointRadius: 5, tension: 0.44, yAxisID: 'y2' }
        ];
        scales = {
            x: { title: { display: true, text: 'Année', font: { size: 15 } }, ticks: { font: { size: 13 } } },
            y: { // Axe Y principal pour VEB
                beginAtZero: true,
                min: 0,
                max: 100,
                title: { display: true, text: 'VEB', font: { size: 14 } },
                ticks: { font: { size: 12 } }
            },
            y2: { // Axe Y secondaire pour Gini, Satisfaction (0-1)
                position: 'right',
                beginAtZero: true,
                min: 0,
                max: 1,
                title: { display: true, text: 'Gini et Satisfaction (0-1)', font: { size: 14 } },
                grid: { drawOnChartArea: false },
                ticks: { font: { size: 12 } }
            },
            y3: { // Axe Y tertiaire pour Croissance et CO2
                position: 'right',
                beginAtZero: true,
                min: 0,
                max: 20, // Max différent pour CO2/Croissance
                title: { display: true, text: 'Croissance (%) et CO₂/hab (t)', font: { size: 14 } },
                grid: { drawOnChartArea: false },
                ticks: { font: { size: 12 } }
            }
        };
    } else { // Scénario Géopolitique
        datasets = [
            { label: "Croissance (%)", data: d1, borderColor: "#1976d2", backgroundColor: "#1976d222", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y3' },
            { label: "Normandie", data: d2, borderColor: "#ff9800", backgroundColor: "#ff980022", borderWidth: 2.5, fill: false, borderDash: [10,6], pointRadius: 3.2, tension: 0.44, yAxisID: 'y' },
            { label: "V-Dem", data: d3, borderColor: "#388e3c", backgroundColor: "#388e3c22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y2' },
            { label: "IDH", data: d4, borderColor: "#8e24aa", backgroundColor: "#8e24aa22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y2' },
            { label: "Satisfaction (0-1)", data: euData.satisArr, borderColor: "#d32f2f", borderWidth: 4, fill: false, borderDash: [10,6], pointRadius: 5, tension: 0.44, yAxisID: 'y2' }
        ];
        scales = {
            x: { title: { display: true, text: 'Année', font: { size: 15 } }, ticks: { font: { size: 13 } } },
            y: { // Axe Y principal pour Normandie
                beginAtZero: true,
                min: 0,
                max: 100,
                title: { display: true, text: 'Normandie', font: { size: 14 } },
                ticks: { font: { size: 12 } }
            },
            y2: { // Axe Y secondaire pour V-Dem, IDH, Satisfaction (0-1)
                position: 'right',
                beginAtZero: true,
                min: 0,
                max: 1,
                title: { display: true, text: 'V-Dem, IDH, Satisfaction (0-1)', font: { size: 14 } },
                grid: { drawOnChartArea: false },
                ticks: { font: { size: 12 } }
            },
            y3: { // Axe Y tertiaire pour Croissance
                position: 'right',
                beginAtZero: true,
                min: 0,
                max: 10,
                title: { display: true, text: 'Croissance (%)', font: { size: 14 } },
                grid: { drawOnChartArea: false },
                ticks: { font: { size: 12 } }
            }
        };
    }

    const config = {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 15, weight: 'bold' }, color: '#263238', usePointStyle: true, padding: 16 }
                },
                title: {
                    display: true,
                    text: `Évolution des indicateurs européens`,
                    font: { size: 18, weight: 'bold' },
                    color: '#1a237e',
                    padding: { top: 10, bottom: 12 }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#fff',
                    titleColor: '#1a237e',
                    bodyColor: '#263238',
                    borderColor: '#1976d2',
                    borderWidth: 1.5,
                    titleFont: { weight: 'bold', size: 15 },
                    bodyFont: { size: 14 },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            if (label.includes("Croissance (%)")) return `${label}: ${value.toFixed(2)}%`;
                            if (label.includes("CO₂/hab (t)")) return `${label}: ${value.toFixed(2)} t`;
                            return `${label}: ${value.toFixed(2)}`;
                        }
                    }
                }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            scales: scales // Utilisation de l'objet scales défini dynamiquement
        }
    };
    charts.euChart = createOrUpdateChart('euChart', config.type, config.data, config.options);
    console.log("DEBUG: createOrUpdateChart called for 'euChart'.");
}


/**
 * Simule l'évolution des indicateurs pour un pays donné.
 * @param {object} profile Le profil du pays (dev ou geo).
 * @param {object} euInputs Les inputs européens (valeurs ponctuelles) pour la simulation du pays.
 * @param {number} scenario Le scénario actuel (1 ou 2).
 * @returns {object} Les données simulées (arr1, arr2, arr3, arr4, satisArr).
 */
function simulateCountry(profile, euInputs, scenario) {
    console.log("DEBUG: simulateCountry appelé avec profile:", profile, "euInputs:", euInputs, "scenario:", scenario);
    let arr1 = [], arr2 = [], arr3 = [], arr4 = [], satisArr = [];

    // Vérification des inputs pour éviter les erreurs "undefined"
    if (!profile || !euInputs || typeof scenario === 'undefined') {
        console.error("ERREUR: simulateCountry a reçu des paramètres invalides. Retourne des tableaux vides.");
        return { arr1: [], arr2: [], arr3: [], arr4: [], satisArr: [] }; // Retourne des tableaux vides pour éviter d'autres erreurs
    }

    if (scenario === 1) { // Scénario Développement Durable
        // Assurez-vous que euInputs contient les propriétés attendues pour le scénario 1
        let croiss = profile.dev.init.croiss + 0.4 * ((euInputs.pib !== undefined ? euInputs.pib : profile.dev.init.croiss) - profile.dev.init.croiss);
        let gini = profile.dev.init.gini + 0.3 * ((euInputs.gini !== undefined ? euInputs.gini : profile.dev.init.gini) - profile.dev.init.gini);
        let co2 = profile.dev.init.co2 + 0.3 * ((euInputs.co2 !== undefined ? euInputs.co2 : profile.dev.init.co2) - profile.dev.init.co2);
        let veb = profile.dev.init.veb + 0.3 * ((euInputs.veb !== undefined ? euInputs.veb : profile.dev.init.veb) - profile.dev.init.veb);

        for (let i = 0; i < 10; i++) {
            co2 += profile.dev.sens.croiss_co2 * croiss;
            veb -= profile.dev.sens.co2_veb * co2;
            gini += profile.dev.sens.veb_gini * (100 - veb) / 100;
            croiss -= profile.dev.sens.veb_croiss * (10 - veb/10);
            arr1.push(Math.max(0, Math.min(4, croiss)));
            arr2.push(Math.max(0.2, Math.min(0.6, gini)));
            arr3.push(Math.max(2, Math.min(10, co2)));
            arr4.push(Math.max(0, Math.min(100, veb)));
            let sat = profile.dev.pond.croiss * normalize(croiss, 0, 4) +
                profile.dev.pond.gini * (1 - normalize(gini, 0.2, 0.6)) +
                profile.dev.pond.co2 * (1 - normalize(co2, 2, 10)) +
                profile.dev.pond.veb * normalize(veb, 0, 100);
            satisArr.push(Math.max(0, Math.min(1, sat)));
        }
    } else { // Scénario Géopolitique
        // Assurez-vous que euInputs contient les propriétés attendues pour le scénario 2
        let normandie = profile.geo.init.normandie + 0.4 * ((euInputs.normandie !== undefined ? euInputs.normandie : profile.geo.init.normandie) - profile.geo.init.normandie);
        let vdem = profile.geo.init.vdem + 0.4 * ((euInputs.vdem !== undefined ? euInputs.vdem : profile.geo.init.vdem) - profile.geo.init.vdem);
        let pib = profile.geo.init.pib + 0.4 * ((euInputs.pib !== undefined ? euInputs.pib : profile.geo.init.pib) - profile.geo.init.pib);
        let idh = profile.geo.init.idh + 0.4 * ((euInputs.idh !== undefined ? euInputs.idh : profile.geo.init.idh) - profile.geo.init.idh);

        for (let i = 0; i < 10; i++) {
            normandie += profile.geo.sens.norm_vdem * (vdem - 0.5);
            vdem += profile.geo.sens.vdem_norm * (normandie / 100 - 0.5);
            pib += profile.geo.sens.norm_pib * (normandie / 100 - 0.5);
            idh += profile.geo.sens.norm_idh * (normandie / 100 - 0.5) + profile.geo.sens.pib_idh * (pib / 4 - 0.25);
            arr1.push(Math.max(-2, Math.min(4, pib)));
            arr2.push(Math.max(0, Math.min(100, normandie)));
            arr3.push(Math.max(0, Math.min(1, vdem)));
            arr4.push(Math.max(0, Math.min(1, idh)));
            let n_pib = normalize(pib, -2, 4);
            let n_normandie = normalize(normandie, 0, 100);
            let n_vdem = normalize(vdem, 0, 1);
            let n_idh = normalize(idh, 0, 1);
            let sat = profile.geo.pond.normandie * n_normandie +
                profile.geo.pond.vdem * n_vdem +
                profile.geo.pond.pib * n_pib +
                profile.geo.pond.idh * n_idh;
            satisArr.push(Math.max(0, Math.min(1, sat)));
        }
    }
    console.log("DEBUG: simulateCountry retourne:", {arr1, arr2, arr3, arr4, satisArr}); // Log le résultat final
    return {arr1, arr2, arr3, arr4, satisArr};
}


/**
 * Met à jour le graphique du pays sélectionné dans le tableau de bord.
 * Dépend des variables globales `profiles`, `currentCountryId`, `currentScenario`, `statsUE`, `simulationYears`, `charts`.
 */
function updateCountryChartForSelectedCountry() {
    console.log("DEBUG: Appel de updateCountryChartForSelectedCountry.");
    console.log("DEBUG: currentCountryId au début:", window.currentCountryId);

    // Vérification de la disponibilité des profils
    if (!profiles || Object.keys(profiles).length === 0) {
        console.error("ERREUR: Les profils des pays ne sont pas chargés. Impossible de mettre à jour le graphique pays.");
        return;
    }

    // Gestion d'un currentCountryId invalide ou non défini
    if (!window.currentCountryId || !profiles[window.currentCountryId]) {
        console.warn(`WARN: currentCountryId '${window.currentCountryId}' invalide ou non défini. Utilisation de 'DE' par défaut.`);
        window.currentCountryId = 'DE'; // Valeur par défaut (Allemagne)
    }

    const countryProfile = profiles[window.currentCountryId];
    if (!countryProfile) {
        console.error(`ERREUR: Profil du pays '${window.currentCountryId}' non trouvé dans 'profiles'. Clés disponibles:`, Object.keys(profiles));
        return;
    }
    console.log("DEBUG: countryProfile récupéré:", countryProfile);

    let simulatedData;
    let euInputsForCountrySimulation;

    // Vérification de statsUE pour la simulation
    if (statsUE && statsUE.pibArr && statsUE.pibArr.length > 0) {
        console.log("DEBUG: statsUE disponible, construction de euInputsForCountrySimulation.");
        if (currentScenario === 1) { // Scénario Développement Durable
            euInputsForCountrySimulation = {
                pib: statsUE.pibArr[0] || countryProfile.dev.init.croiss,
                gini: statsUE.giniArr[0] || countryProfile.dev.init.gini,
                co2: statsUE.co2Arr[0] || countryProfile.dev.init.co2,
                veb: statsUE.vebArr[0] || countryProfile.dev.init.veb
            };
        } else { // Scénario Géopolitique
            euInputsForCountrySimulation = {
                normandie: statsUE.stabArr[0] || countryProfile.geo.init.normandie,
                vdem: statsUE.demArr[0] || countryProfile.geo.init.vdem,
                pib: statsUE.pibArr[0] || countryProfile.geo.init.pib,
                idh: statsUE.idhArr[0] || countryProfile.geo.init.idh
            };
        }
        console.log("DEBUG: euInputsForCountrySimulation construit à partir de statsUE:", euInputsForCountrySimulation);
    } else {
        // Si statsUE n'est pas disponible, utiliser les valeurs initiales du profil du pays
        console.warn("WARN: statsUE non disponible. Simulation avec les valeurs initiales du pays.");
        if (currentScenario === 1) { // Scénario Développement Durable
            euInputsForCountrySimulation = {
                pib: countryProfile.dev.init.croiss,
                gini: countryProfile.dev.init.gini,
                co2: countryProfile.dev.init.co2,
                veb: countryProfile.dev.init.veb
            };
        } else { // Scénario Géopolitique
            euInputsForCountrySimulation = {
                normandie: countryProfile.geo.init.normandie,
                vdem: countryProfile.geo.init.vdem,
                pib: countryProfile.geo.init.pib,
                idh: countryProfile.geo.init.idh
            };
        }
        console.log("DEBUG: euInputsForCountrySimulation par défaut:", euInputsForCountrySimulation);
    }

    // Appel à simulateCountry
    simulatedData = simulateCountry(countryProfile, euInputsForCountrySimulation, currentScenario);
    console.log("DEBUG: simulatedData retourné par simulateCountry:", simulatedData);

    // Vérification des données simulées
    if (!simulatedData || !Array.isArray(simulatedData.arr1) || simulatedData.arr1.length === 0 ||
        !Array.isArray(simulatedData.satisArr) || simulatedData.satisArr.length === 0) {
        console.error("ERREUR: Les données simulées pour le pays sont invalides ou vides. Impossible de tracer le graphique.");
        return;
    }

    // Appel à plotCountry pour mettre à jour le graphique
    plotCountry(simulationYears, simulatedData, countryProfile, currentScenario);
    showScore(simulatedData.satisArr, "succesCountry");

    console.log(`DEBUG: Graphique du pays pour '${countryProfile.name}' mis à jour avec succès.`);
}

/**
 * Trace ou met à jour le graphique des indicateurs d'un pays.
 * @param {Array<number>} simulationYears Les années de simulation.
 * @param {object} data Les données simulées pour le pays (arr1, arr2, etc., satisArr).
 * @param {object} country Le profil du pays.
 * @param {number} scenario Le scénario actuel (1 ou 2).
 */
function plotCountry(simulationYears, data, country, scenario) {
    console.log("DEBUG: plotCountry appelé avec:");
    console.log("DEBUG:   - simulationYears:", simulationYears);
    console.log("DEBUG:   - data (simulatedData):", data);
    console.log("DEBUG:     - data.arr1 length:", data.arr1 ? data.arr1.length : 'N/A', "values:", data.arr1);
    console.log("DEBUG:     - data.arr2 length:", data.arr2 ? data.arr2.length : 'N/A', "values:", data.arr2);
    console.log("DEBUG:     - data.arr3 length:", data.arr3 ? data.arr3.length : 'N/A', "values:", data.arr3);
    console.log("DEBUG:     - data.arr4 length:", data.arr4 ? data.arr4.length : 'N/A', "values:", data.arr4);
    console.log("DEBUG:     - data.satisArr length:", data.satisArr ? data.satisArr.length : 'N/A', "values:", data.satisArr);
    console.log("DEBUG:   - country (profile):", country);
    console.log("DEBUG:   - scenario:", scenario);

    // Vérification des données critiques avant de construire le graphique
    // Assurez-vous que les tableaux de données sont des tableaux et qu'ils ne sont pas vides.
    if (!data || !Array.isArray(data.arr1) || data.arr1.length === 0 ||
        !Array.isArray(data.arr2) || data.arr2.length === 0 ||
        !Array.isArray(data.arr3) || data.arr3.length === 0 ||
        !Array.isArray(data.arr4) || data.arr4.length === 0 ||
        !Array.isArray(data.satisArr) || data.satisArr.length === 0) {
        console.error("ERREUR: Données insuffisantes ou invalides pour tracer le graphique pays dans plotCountry.");
        // Vous pouvez ajouter ici une logique pour afficher un message à l'utilisateur si le canvas est vide
        // Par exemple: document.getElementById('countryChart').parentNode.innerHTML = '<p>Données non disponibles pour ce graphique.</p>';
        return;
    }

    let d1 = data.arr1;
    let d2 = data.arr2;
    let d3 = data.arr3;
    let d4 = data.arr4;
    let l1, l2, l3, l4;
    let datasets = [];
    let scales = {
        x: {
            title: { display: true, text: 'Année', font: { size: 15 } },
            ticks: { font: { size: 13 } }
        },
        y: { // Axe Y principal pour VEB / Normandie
            beginAtZero: true,
            min: 0,
            max: 100,
            title: { display: true, text: scenario === 1 ? 'VEB' : 'Normandie', font: { size: 14 } },
            ticks: { font: { size: 12 } }
        },
        y2: { // Axe Y secondaire pour Gini, V-Dem, IDH, Satisfaction (0-1)
            position: 'right',
            beginAtZero: true,
            min: 0,
            max: 1, // Ces valeurs sont généralement entre 0 et 1
            title: { display: true, text: scenario === 1 ? 'Gini et Satisfaction (0-1)' : 'V-Dem, IDH, Satisfaction (0-1)', font: { size: 14 } },
            grid: { drawOnChartArea: false },
            ticks: { font: { size: 12 } }
        },
        y3: { // Axe Y tertiaire pour Croissance et CO2
            position: 'right',
            beginAtZero: true,
            min: 0,
            max: scenario === 1 ? 20 : 10, // Max différent selon le scénario pour CO2/Croissance
            title: { display: true, text: scenario === 1 ? 'Croissance (%) et CO₂/hab (t)' : 'Croissance (%)', font: { size: 14 } },
            grid: { drawOnChartArea: false },
            ticks: { font: { size: 12 } }
        }
    };

    if (scenario === 1) {
        l1 = "Croissance (%)";
        l2 = "Gini";
        l3 = "CO₂/hab (t)";
        l4 = "VEB";
        datasets = [
            { label: l1, data: d1, borderColor: "#1976d2", backgroundColor: "#1976d222", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y3' },
            { label: l2, data: d2, borderColor: "#ff9800", backgroundColor: "#ff980022", borderWidth: 2.5, fill: false, borderDash: [10,6], pointRadius: 3.2, tension: 0.44, yAxisID: 'y2' },
            { label: l3, data: d3, borderColor: "#388e3c", backgroundColor: "#388e3c22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y3' },
            { label: l4, data: d4, borderColor: "#8e24aa", backgroundColor: "#8e24aa22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y' },
            { label: "Satisfaction (0-1)", data: data.satisArr, borderColor: "#d32f2f", borderWidth: 4, fill: false, borderDash: [10,6], pointRadius: 5, tension: 0.44, yAxisID: 'y2' }
        ];
    } else { // Scenario 2
        l1 = "Croissance (%)";
        l2 = "Normandie"; // Remplace VEB
        l3 = "V-Dem";
        l4 = "IDH";
        datasets = [
            { label: l1, data: d1, borderColor: "#1976d2", backgroundColor: "#1976d222", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y3' },
            { label: l2, data: d2, borderColor: "#ff9800", backgroundColor: "#ff980022", borderWidth: 2.5, fill: false, borderDash: [10,6], pointRadius: 3.2, tension: 0.44, yAxisID: 'y' },
            { label: l3, data: d3, borderColor: "#388e3c", backgroundColor: "#388e3c22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y2' },
            { label: l4, data: d4, borderColor: "#8e24aa", backgroundColor: "#8e24aa22", borderWidth: 2.5, fill: false, pointRadius: 3.2, tension: 0.44, yAxisID: 'y2' },
            { label: "Satisfaction (0-1)", data: data.satisArr, borderColor: "#d32f2f", borderWidth: 4, fill: false, borderDash: [10,6], pointRadius: 5, tension: 0.44, yAxisID: 'y2' }
        ];
    }

    const config = {
        type: 'line',
        data: {
            labels: simulationYears,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 15, weight: 'bold' }, color: '#263238', usePointStyle: true, padding: 16 }
                },
                title: {
                    display: true,
                    text: `Évolution des indicateurs – ${country.name}`,
                    font: { size: 18, weight: 'bold' },
                    color: '#1a237e',
                    padding: { top: 10, bottom: 12 }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#fff',
                    titleColor: '#1a237e',
                    bodyColor: '#263238',
                    borderColor: '#1976d2',
                    borderWidth: 1.5,
                    titleFont: { weight: 'bold', size: 15 },
                    bodyFont: { size: 14 },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            if (label === "Croissance (%)") return `${label}: ${value.toFixed(2)}%`;
                            if (label === "CO₂/hab (t)") return `${label}: ${value.toFixed(2)} t`;
                            return `${label}: ${value.toFixed(2)}`;
                        }
                    }
                }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            scales: scales
        }
    };

    console.log("DEBUG: Datasets préparés pour Chart.js:", datasets); // Log le tableau de datasets final
    // Appel de la fonction utilitaire createOrUpdateChart
    charts.countryChart = createOrUpdateChart('countryChart', config.type, config.data, config.options);
    console.log("DEBUG: createOrUpdateChart appelé pour 'countryChart'.");
}

// --- Graphique politique (Fonction unifiée et corrigée, conservant les paramètres years et politiqueData) ---
// Cette fonction utilise les données complètes de 'parti' et les options détaillées.
function plotPolitique(years, politiqueData, parti) {
    console.log("DEBUG: plotPolitique appelé.");
    console.log("DEBUG: Paramètres reçus - years:", years, "politiqueData:", politiqueData, "parti:", parti);

    const ctx = document.getElementById('politiqueChart');
    if (!ctx) {
        console.error('Canvas element with ID "politiqueChart" not found.');
        return;
    }

    // Destruction du graphique existant si nécessaire, avant de créer ou mettre à jour via createOrUpdateChart
    // Note: La ligne ci-dessous est optionnelle si createOrUpdateChart gère déjà la destruction interne.
    // if (charts.politiqueChart) charts.politiqueChart.destroy(); // Décommenter si nécessaire

    const datasets = [
        {
            label: 'Satisfaction (%)',
            data: parti.satisfactionArr,
            borderColor: '#d32f2f',
            borderDash: [10, 5],
            backgroundColor: '#d32f2f22',
            borderWidth: 3,
            fill: false,
            tension: 0.35,
            yAxisID: 'y2',
            pointRadius: 4,
            pointHoverRadius: 7
        },
        {
            label: 'Députés',
            data: parti.mepsArr,
            borderColor: parti.couleur,
            backgroundColor: parti.couleur + '22',
            borderWidth: 3,
            fill: false,
            tension: 0,
            stepped: true,
            yAxisID: 'y',
            pointRadius: 4,
            pointHoverRadius: 7
        },
        {
            label: 'Commissaires',
            data: parti.commissairesArr,
            borderColor: '#888',
            backgroundColor: '#88888822',
            borderWidth: 2,
            fill: false,
            tension: 0,
            stepped: true,
            yAxisID: 'y',
            pointRadius: 4,
            pointHoverRadius: 7
        },
        {
            label: 'Conseil (% États)',
            data: parti.conseilArr,
            borderColor: '#1976d2',
            backgroundColor: '#1976d222',
            borderWidth: 2,
            fill: false,
            tension: 0,
            stepped: true,
            yAxisID: 'y2',
            pointRadius: 4,
            pointHoverRadius: 7
        },
        {
            label: 'Présidence (%)',
            data: parti.presArr,
            borderColor: '#FFD700',
            backgroundColor: '#FFD70022',
            borderWidth: 2,
            fill: false,
            tension: 0,
            stepped: true,
            yAxisID: 'y2',
            pointRadius: 4,
            pointHoverRadius: 7
        }
    ];

    console.log("DEBUG: Données des datasets passées à Chart.js (plotPolitique):", datasets);
    console.log("DEBUG: Longueurs des tableaux de données (satisfaction, meps, commissaires, conseil, pres):",
        parti.satisfactionArr ? parti.satisfactionArr.length : 'N/A',
        parti.mepsArr ? parti.mepsArr.length : 'N/A',
        parti.commissairesArr ? parti.commissairesArr.length : 'N/A',
        parti.conseilArr ? parti.conseilArr.length : 'N/A',
        parti.presArr ? parti.presArr.length : 'N/A'
    );

    const config = {
        type: 'line',
        data: {
            labels: years, // Utilise le paramètre 'years'
            datasets: datasets
        },
        options: {
            responsive: true,
            interaction: {mode: 'index', intersect: false},
            plugins: {
                legend: {position: 'top'},
                title: {display: true, text: `Projections politiques - ${parti.nom}`},
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            if (label.includes('Satisfaction')) return `${label}: ${Math.round(value)}%`;
                            if (label.includes('Députés')) return `${label}: ${value}`;
                            if (label.includes('Commissaires')) return `${label}: ${value}`;
                            if (label.includes('Conseil')) return `${label}: ${value}%`;
                            if (label.includes('Présidence')) return `${label}: ${value}%`;
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {display: true, text: 'Députés / Commissaires'}
                },
                y2: {
                    position: 'right',
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    title: {display: true, text: '% Satisfaction/Conseil/Présidence'},
                    grid: {drawOnChartArea: false}
                }
            }
        }
    };

    // Appel de la fonction utilitaire createOrUpdateChart
    // Assurez-vous que la variable 'charts' est bien déclarée globalement (ex: let charts = {};)
    charts.politiqueChart = createOrUpdateChart('politiqueChart', config.type, config.data, config.options);
}


// --- UI politique (Mise à jour pour appeler la fonction plotPolitique unifiée avec les bons paramètres) ---
function updatePolitiqueUI() {
    const parti = partis[currentParti];
    console.log("DEBUG: updatePolitiqueUI appelé. Objet parti sélectionné:", parti);
    // Vérification des données avant de tenter la mise à jour de l'UI et du graphique
    if (!parti || !parti.satisfactionArr || !parti.mepsArr || parti.mepsArr.length < 10) {
        console.warn("WARN: Données du parti insuffisantes pour updatePolitiqueUI. Impossible de mettre à jour l'UI ou le graphique.", parti);
        return;
    }

    document.getElementById('partiSatisfaction').textContent = `${Math.round(parti.satisfaction)}%`;
    document.getElementById('partiMEPs').textContent = `${parti.mepsArr[4]} → ${parti.mepsArr[9]}`;
    document.getElementById('partiConseil').textContent = `${parti.conseilArr[4]}% → ${parti.conseilArr[9]}%`;
    document.getElementById('partiCommissaires').textContent = `${parti.commissairesArr[4]} → ${parti.commissairesArr[9]}`;
    document.getElementById('partiPresidence').textContent = `${Math.round(parti.presArr[4])}% → ${Math.round(parti.presArr[9])}%`;

    // Appel de la fonction de tracé unifiée 'plotPolitique'
    // 'simulationYears' est utilisé comme premier paramètre 'years'.
    // 'null' est passé pour 'politiqueData' car son utilisation n'est pas claire dans les extraits fournis.
    plotPolitique(simulationYears, null, parti);

    document.getElementById('scoreVictoire').innerHTML = `<b>Score de victoire du parti :</b> ${parti.victoire} / 100`;

    showScore(parti.satisfactionArr.map(v => v / 100), "scoreVictoire");
}


/// --- Fonction `createLobbyChart` (maintenant avec toute la logique de plotLobbiesChart) ---
// Cette fonction ne prend plus de paramètres `years` ou `lobbyData`
// car elle récupère directement le lobby sélectionné du DOM et utilise les globales.
function createLobbyChart() {
    // Vérifications initiales des éléments HTML globaux
    if (!globalLobbySelectElement || !globalLobbyChartCanvas || !globalLobbyScoreDiv) {
        console.error("Erreur: Un ou plusieurs éléments DOM nécessaires (lobbySelect, lobbyChart, lobbyScore) sont manquants.");
        // On ne fait pas de setTimeout ici, car cela pourrait créer une boucle si les éléments sont vraiment absents.
        return;
    }

    const selectedLobbyKey = globalLobbySelectElement.value;
    const lobby = lobbies[selectedLobbyKey];

    if (!lobby) {
        console.error("Lobby non trouvé pour la clé :", selectedLobbyKey);
        return;
    }

    // MODIFIÉ: Vérification plus robuste des données avant de tenter de tracer le graphique
    if (!lobby.reputationArr || lobby.reputationArr.length < simulationYears.length ||
        !lobby.infEtatsArr || lobby.infEtatsArr.length < simulationYears.length ||
        !lobby.infParlementArr || lobby.infParlementArr.length < simulationYears.length ||
        !lobby.infCommissionArr || lobby.infCommissionArr.length < simulationYears.length) {
        console.warn(`WARN: Les données de simulation complètes pour le lobby "${lobby.nom}" ne sont pas disponibles (longueur attendue: ${simulationYears.length}, trouvée: Rep: ${lobby.reputationArr ? lobby.reputationArr.length : 'N/A'}, Etats: ${lobby.infEtatsArr ? lobby.infEtatsArr.length : 'N/A'}, Parlement: ${lobby.infParlementArr ? lobby.infParlementArr.length : 'N/A'}, Commission: ${lobby.infCommissionArr ? lobby.infCommissionArr.length : 'N/A'}). Le graphique ne sera pas tracé.`);
        globalLobbyScoreDiv.innerHTML = `<p>Chargement des données du lobby en cours ou échec de simulation.</p>`;
        if (charts.lobbyChart) { charts.lobbyChart.destroy(); charts.lobbyChart = null; } // Utilise charts.lobbyChart
        return;
    }

    const labels = simulationYears; // Utilise la variable globale `simulationYears`

    const datasets = [
        {
            label: 'Réputation',
            data: lobby.reputationArr,
            borderColor: '#9c27b0', // Violet
            backgroundColor: '#9c27b022',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        },
        {
            label: 'Influence États',
            data: lobby.infEtatsArr,
            borderColor: '#1976d2', // Bleu
            backgroundColor: '#1976d222',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        },
        {
            label: 'Influence Parlement',
            data: lobby.infParlementArr,
            borderColor: '#388e3c', // Vert
            backgroundColor: '#388e3c22',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        },
        {
            label: 'Influence Commission',
            data: lobby.infCommissionArr,
            borderColor: '#f57c00', // Orange
            backgroundColor: '#f57c0022',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        }
    ];

    // Utilisation de createOrUpdateChart pour gérer le cycle de vie du graphique
    charts.lobbyChart = createOrUpdateChart('lobbyChart', 'line', {
        labels: labels,
        datasets: datasets
    }, {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Évolution du lobby : ${lobby.nom}` },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100 // Échelle de 0 à 100 pour les scores d'influence/réputation
            }
        }
    });

    // Afficher les détails du score pour le lobby sélectionné
    showLobbyScore(lobby);
}


// --- Simulation UE ---
// Function simulateEU - MODIFIED TO ACCEPT INPUTS OBJECT
function simulateEU(scenario, inputValues) { // Added inputValues parameter
    console.log(`LOG: Démarrage de simulateEU pour le scénario ${scenario}.`);

    let pib_eu, gini_eu, co2_eu, veb_eu, normandie_eu, vdem_eu, pib_growth_eu, idh_eu;

    // Determine the source of inputs: from the inputValues object (dashboard)
    // or from the main simulator DOM elements (default behavior)
    if (inputValues) {
        // Inputs are coming from the dashboard via runDashboardSimulation
        if (scenario === 1) {
            pib_eu = inputValues.pib_eu;
            gini_eu = inputValues.gini_eu;
            co2_eu = inputValues.co2_eu;
            veb_eu = inputValues.veb_eu;
        } else { // Scenario 2
            normandie_eu = inputValues.normandie_eu;
            vdem_eu = inputValues.vdem_eu;
            pib_growth_eu = inputValues.pib_growth_eu;
            idh_eu = inputValues.idh_eu;
        }
    } else {
        // Inputs are coming from the main simulator's DOM elements
        if (scenario === 1) {
            pib_eu = getNumericValue('pib_eu', 3);
            gini_eu = getNumericValue('gini_eu', 0.3);
            co2_eu = getNumericValue('co2_eu', 4);
            veb_eu = getNumericValue('veb_eu', 80);
        } else { // Scenario 2
            normandie_eu = getNumericValue('normandie_eu', 80);
            vdem_eu = getNumericValue('vdem_eu', 0.85);
            pib_growth_eu = getNumericValue('pib_growth_eu', 1.5);
            idh_eu = getNumericValue('idh_eu', 0.92);
        }
    }


    const euData = {
        arr1: [], arr2: [], arr3: [], arr4: [], satisArr: []
    };

    let pib = pib_eu;
    let gini = gini_eu;
    let co2 = co2_eu;
    let veb = veb_eu;
    let normandie = normandie_eu;
    let vdem = vdem_eu;
    let pib_growth = pib_growth_eu;
    let idh = idh_eu;

    for (let i = 0; i < simulationYears.length; i++) {
        // Apply fluctuations (you might want to adjust how these are applied
        // if coming from fixed dashboard inputs vs. a full simulation)
        // For dashboard, these fluctuations might make less sense if inputs are fixed.
        // Consider if dashboard inputs should 'lock' the values or just be initial.
        // For simplicity, let's keep the existing fluctuation for now, but be aware.
        const fluctuation = (Math.random() - 0.5) * 0.1; // +/- 5% fluctuation

        if (scenario === 1) {
            pib += pib * fluctuation;
            gini += (Math.random() - 0.5) * 0.01;
            co2 += (Math.random() - 0.5) * 0.1;
            veb += (Math.random() - 0.5) * 2;

            gini = Math.max(0.2, Math.min(0.6, gini));
            co2 = Math.max(2, Math.min(10, co2));
            veb = Math.max(0, Math.min(100, veb));

            euData.arr1.push(pib);
            euData.arr2.push(gini);
            euData.arr3.push(co2);
            euData.arr4.push(veb);

            // Calculate EU satisfaction for scenario 1
            const scorePIB = normalize(pib, 0, 10); // Example range
            const scoreGini = 1 - normalize(gini, 0.2, 0.6); // Lower Gini is better
            const scoreCO2 = 1 - normalize(co2, 2, 10); // Lower CO2 is better
            const scoreVEB = normalize(veb, 0, 100); // Higher VEB is better
            euData.satisArr.push((scorePIB + scoreGini + scoreCO2 + scoreVEB) / 4 );

        } else { // Scenario 2
            normandie += (Math.random() - 0.5) * 2;
            vdem += (Math.random() - 0.5) * 0.01;
            pib_growth += pib_growth * fluctuation; // Use pib_growth
            idh += (Math.random() - 0.5) * 0.01;

            normandie = Math.max(0, Math.min(100, normandie));
            vdem = Math.max(0, Math.min(1, vdem));
            pib_growth = Math.max(-5, Math.min(10, pib_growth)); // Sensible range for growth
            idh = Math.max(0, Math.min(1, idh));

            euData.arr1.push(pib_growth); // Now pib_growth
            euData.arr2.push(normandie);
            euData.arr3.push(vdem);
            euData.arr4.push(idh);

            // Calculate EU satisfaction for scenario 2
            const scoreNormandie = normalize(normandie, 0, 100);
            const scoreVDem = normalize(vdem, 0, 1);
            const scorePIBGrowth = normalize(pib_growth, -5, 10); // Range for growth
            const scoreIDH = normalize(idh, 0, 1);
            euData.satisArr.push((scoreNormandie + scoreVDem + scorePIBGrowth + scoreIDH) / 4);
        }
    }
    console.log("LOG: simulateEU terminé. Données générées:", euData);
    return euData;
}


// --- NOUVELLE FONCTION AUXILIAIRE ---
/**
 * Calcule le score de satisfaction de base de manière linéaire.
 * @param {object} pond - L'objet de pondération du parti.
 * @param {object} norm - Un objet contenant tous les indicateurs normalisés.
 * @param {number} scenario - Le scénario actif (1 ou 2).
 * @returns {number} Le score de satisfaction de base (entre 0 et 1).
 */
function calculerScoreDeBase(pond, norm, scenario) {
    let score = 0;
    let totalPoids = 0;

    if (scenario === 1) {
        // Scénario 1: Développement Durable
        score = pond.pib * norm.pib
            + pond.gini * (1 - norm.gini) // Inversé: Gini élevé = mauvais
            + pond.co2 * (1 - norm.co2)   // Inversé: CO2 élevé = mauvais
            + pond.veb * norm.veb;
        totalPoids = pond.pib + pond.gini + pond.co2 + pond.veb;

    } else { // Scénario 2: Géopolitique
        score = pond.pib * norm.pib   // Croissance
            + pond.stab * norm.stab  // Stabilité
            + pond.dem * norm.dem   // Démocratie
            + pond.idh * norm.idh;  // IDH
        totalPoids = pond.pib + pond.stab + pond.dem + pond.idh;
    }

    // Éviter la division par zéro et normaliser le score
    return totalPoids > 0 ? score / totalPoids : 0;
}

// --- MISE À JOUR MAJEURE DE LA FONCTION EXISTANTE ---
function simulerPolitique(statsUE, scenario) {
    console.log("LOG 7: Valeur de 'partis' au début de la fonction simulerPolitique :", partis);
    console.log("LOG 8: Valeur de 'statsUE' au début de la fonction simulerPolitique :", statsUE);
    console.log("LOG 9: Valeur de 'scenario' au début de la fonction simulerPolitique :", scenario);
    Object.keys(partis).forEach(cle => {
        const pond = pondPartis[cle];
        const parti = partis[cle];
        parti.satisfactionArr = [];

        for (let i = 0; i < 10; i++) {
            // 1. Normaliser tous les indicateurs une seule fois
            const norm = {
                pib: normalize(statsUE.pibArr[i], -2, 4),   // PIB ou Croissance
                gini: normalize(statsUE.giniArr[i], 0.2, 0.6),
                co2: normalize(statsUE.co2Arr[i], 2, 10),
                veb: normalize(statsUE.vebArr[i], 0, 100),
                stab: normalize(statsUE.stabArr[i], 0, 100),
                dem: normalize(statsUE.demArr[i], 0, 1),
                idh: normalize(statsUE.idhArr[i], 0, 1)
            };

            // 2. Calculer le score de base
            let s = calculerScoreDeBase(pond, norm, scenario);

            // 3. Appliquer la logique idéologique spécifique (bonus, malus, etc.)
            switch (cle) {
                case 'VERT':
                    // LIGNE ROUGE : L'écologie est un multiplicateur. Si elle est mauvaise, rien d'autre ne compte.
                    const ecoMultiplier = norm.veb * (1 - norm.co2);
                    s *= ecoMultiplier;
                    // Bonus si les deux indicateurs sont excellents (au-dessus de 80% de la norme)
                    if (norm.veb > 0.8 && norm.co2 < 0.2) s += 0.2;
                    break;

                case 'SDE':
                case 'GUE':
                    // LIGNE ROUGE : Les inégalités (Gini) sont critiques.
                    // Si le Gini est élevé (norm > 0.6), appliquer un malus sévère.
                    if (norm.gini > 0.6) {
                        s -= (norm.gini - 0.6) * 1.5; // Malus très punitif
                    }
                    if (cle === 'GUE') {
                        // PLAFOND : La gauche radicale est par nature critique du système.
                        s = Math.min(s, 0.80); // Satisfaction plafonnée à 80%
                    }
                    break;

                case 'PPE':
                    // LEVIER : La croissance du PIB et la stabilité sont primordiales.
                    // Malus si la croissance est faible (norm < 0.4, soit < ~0.4% de croissance réelle)
                    if (norm.pib < 0.4) s -= 0.2;
                    // Bonus si la croissance ET la stabilité sont fortes.
                    if (norm.pib > 0.7 && norm.stab > 0.7) s += 0.15;
                    break;

                case 'ECR':
                    // LIGNE ROUGE : La souveraineté. L'approfondissement de la démocratie UE est vu avec méfiance.
                    // Le score de base inclus déjà l'effet positif de la 'dem'. Nous appliquons un malus pour le contrebalancer.
                    s -= norm.dem * pond.dem * 1.2; // Annule et pénalise légèrement le gain lié à la démocratie supranationale.
                    s = Math.min(s, 0.85); // Plafond souverainiste
                    break;

                case 'RENEW':
                    // LIGNE ROUGE : La santé du projet européen.
                    // Si la stabilité ou la démocratie s'effondrent, c'est un échec majeur.
                    if (norm.stab < 0.5 || norm.dem < 0.5) {
                        s -= 0.3;
                    }
                    break;
            }

            // 4. Assurer que le score final reste dans les bornes [0, 1] avant de le convertir en %
            const finalScore = Math.max(0, Math.min(1, s));
            parti.satisfactionArr.push(finalScore * 100);
        }

        // --- Le reste de la fonction (calcul des MEPs, etc.) reste INCHANGÉ ---
        const sMoy5 = parti.satisfactionArr.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        const sMoy10 = parti.satisfactionArr.reduce((a, b) => a + b, 0) / 10;

        parti.mepsArr = Array(5).fill(parti.base.meps)
            .concat(Array(4).fill(Math.round(parti.base.meps * (0.8 + 0.8 * sMoy5 / 100))))
            .concat([Math.round(parti.base.meps * (0.8 + 0.8 * sMoy10 / 100))]);

        parti.commissairesArr = Array(5).fill(parti.base.commissaires)
            .concat(Array(4).fill(Math.max(1, Math.round(parti.base.commissaires * (0.8 + 0.8 * sMoy5 / 100)))))
            .concat([Math.max(1, Math.round(parti.base.commissaires * (0.8 + 0.8 * sMoy10 / 100)))]);

        parti.conseilArr = Array(5).fill(parti.base.conseil)
            .concat(Array(4).fill(Math.min(100, Math.round(parti.base.conseil * (1 + 0.3 * (sMoy5 / 100 - 0.5))))))
            .concat([Math.min(100, Math.round(parti.base.conseil * (1 + 0.3 * (sMoy10 / 100 - 0.5))))]);

        parti.presArr = Array(5).fill(Math.round(parti.base.influence * 100))
            .concat(Array(4).fill(Math.round(parti.base.influence * 100 * (0.9 + 0.2 * sMoy5 / 100))))
            .concat([Math.round(parti.base.influence * 100 * (0.9 + 0.2 * sMoy10 / 100))]);

        parti.victoire = Math.round(100 * (
            0.6 * sMoy10 / 100 +
            0.2 * (parti.mepsArr[9] / 200) +
            0.2 * (parti.commissairesArr[9] / 10)
        ));

        parti.satisfaction = sMoy10;
    });
}


function showScore(satisArr, id) {
    const adhInit = satisArr[0];
    const adhFin = satisArr[satisArr.length - 1];
    const ecart = adhFin - adhInit;

    // Formule qui valorise à la fois le niveau final et l'amélioration
    const scoreSucces = (0.4 * adhFin + 0.4 * (1 - Math.abs(0.8 - adhFin)) + 0.2 * ecart) * 100;
    // - 40% pour le niveau final
    // - 40% pour la proximité avec l'objectif idéal (0.8)
    // - 20% pour la progression

    // Icône dynamique
    const icon = ecart > 0.1 ? "📈" : ecart < -0.1 ? "📉" : "➡️";

    document.getElementById(id).innerHTML = `
        <div style="margin-bottom:4px;">
            <b>${icon} Score de réussite :</b> <span style="font-weight:600">${scoreSucces.toFixed(1)}/100</span>
        </div>
        <div style="font-size:0.94em; color:#555; line-height:1.4;">
            <div>• Niveau initial: ${(adhInit * 100).toFixed(1)}%</div>
            <div>• Niveau final: ${(adhFin).toFixed(2)}%</div>
            <div>• Progression: ${ecart >= 0 ? "+" : ""}${(ecart * 100).toFixed(1)} points</div>
        </div>`;
}

/**
 * Simule l'évolution de l'influence et de la réputation des lobbies
 * Version corrigée avec gestion d'erreurs et retour des données d'influence agrégées
 */
function simulerLobbies(statsUE, scenario) {
    // Vérification que l'objet lobbies existe
    if (typeof lobbies === 'undefined' || !lobbies) {
        console.error("L'objet 'lobbies' n'est pas défini");
        return; // Retourne undefined
    }

    // Étape d'initialisation : on prépare les tableaux de résultats pour chaque lobby
    Object.values(lobbies).forEach(lobby => {
        // Vérification de la structure du lobby
        if (!lobby.base) {
            console.error("Structure lobby invalide:", lobby);
            return; // Ne devrait pas arrêter la boucle, mais le lobby sera ignoré
        }

        // Assurer que les valeurs de base sont des nombres
        lobby.reputationArr = [typeof lobby.base.reputation === 'number' ? lobby.base.reputation : 50];
        lobby.infEtatsArr = [typeof lobby.base.infEtats === 'number' ? lobby.base.infEtats : 30];
        lobby.infParlementArr = [typeof lobby.base.infParlement === 'number' ? lobby.base.infParlement : 30];
        lobby.infCommissionArr = [typeof lobby.base.infCommission === 'number' ? lobby.base.infCommission : 30];
    });

    // Vérification des données statsUE
    // MODIFIÉ: Vérification plus robuste pour s'assurer que les tableaux existent et ont une longueur suffisante
    if (!statsUE || !statsUE.pibArr || statsUE.pibArr.length < 10) {
        console.error("Les données statsUE sont invalides ou incomplètes pour la simulation des lobbies:", statsUE);
        return; // Retourne undefined
    }

    // Boucle de simulation sur 10 ans (en fait 9 itérations pour remplir les 10 années)
    for (let i = 0; i < 9; i++) { // i goes from 0 to 8
        console.log(`DEBUG: simulerLobbies - Iteration i = ${i}`); // Log pour suivre les itérations

        // --- A. Calcul des Facteurs d'Impact Globaux de l'Année ---
        // S'assurer que statsUE.arr[i] est défini avant de normaliser
        const norm = {
            pib: normalize(statsUE.pibArr[i] !== undefined ? statsUE.pibArr[i] : 0, -2, 4),
            gini: normalize(statsUE.giniArr[i] !== undefined ? statsUE.giniArr[i] : 0.3, 0.2, 0.6),
            co2: normalize(statsUE.co2Arr[i] !== undefined ? statsUE.co2Arr[i] : 4, 2, 10),
            veb: normalize(statsUE.vebArr[i] !== undefined ? statsUE.vebArr[i] : 80, 0, 100),
            stab: normalize(statsUE.stabArr[i] !== undefined ? statsUE.stabArr[i] : 80, 0, 100),
            dem: normalize(statsUE.demArr[i] !== undefined ? statsUE.demArr[i] : 0.85, 0, 1),
            idh: normalize(statsUE.idhArr[i] !== undefined ? statsUE.idhArr[i] : 0.92, 0, 1)
        };

        const impacts = {
            croissance: norm.pib,
            securite: norm.stab,
            stabilite: norm.stab,
            sante: norm.idh,
            ecologie: (norm.veb + (1 - norm.co2)) / 2,
            democratie: norm.dem
        };

        // --- B. Mise à Jour de la Réputation pour tous les lobbies ---
        Object.values(lobbies).forEach(lobby => {
            if (!lobby.facteurs || !lobby.facteurs.rep) return;

            // Vérifier que lobby.reputationArr[i] est un nombre
            const currentReputation = typeof lobby.reputationArr[i] === 'number' ? lobby.reputationArr[i] : 50;

            let changement_R = 0;
            // Calcule l'impact sur la réputation basé sur les facteurs du lobby
            for (const [facteur, ponderation] of Object.entries(lobby.facteurs.rep)) {
                if (impacts[facteur] !== undefined && typeof impacts[facteur] === 'number') {
                    changement_R += impacts[facteur] * ponderation * 10;
                }
            }
            // Facteur de scandale aléatoire (4% de chance par an)
            if (Math.random() < 0.04) changement_R -= 25;

            const nouvelleRep = currentReputation + changement_R;
            lobby.reputationArr.push(Math.max(0, Math.min(100, nouvelleRep)));
        });

        // --- C. Mise à Jour de l'Influence pour tous les lobbies ---
        Object.values(lobbies).forEach(lobby => {
            if (!lobby.facteurs || !lobby.facteurs.inf) return;

            const repMultiplier = typeof lobby.reputationArr[i + 1] === 'number' ? lobby.reputationArr[i + 1] / 100 : 0.5;
            let changement_inf_base = 0;

            // Calcule le changement d'influence de base
            for (const [facteur, ponderation] of Object.entries(lobby.facteurs.inf)) {
                if (impacts[facteur] !== undefined && typeof impacts[facteur] === 'number') {
                    changement_inf_base += impacts[facteur] * ponderation * 8;
                }
            }

            // Le changement réel est modulé par la réputation
            const changement_inf_reel = changement_inf_base * repMultiplier;

            // Applique le changement à chaque type d'influence
            // Vérifier que les valeurs actuelles sont des nombres
            let nouvelleIE = (typeof lobby.infEtatsArr[i] === 'number' ? lobby.infEtatsArr[i] : 30) + changement_inf_reel;
            let nouvelleIM = (typeof lobby.infParlementArr[i] === 'number' ? lobby.infParlementArr[i] : 30) + changement_inf_reel;
            let nouvelleIC = (typeof lobby.infCommissionArr[i] === 'number' ? lobby.infCommissionArr[i] : 30) + changement_inf_reel;

            // Bonus de scénario
            if (scenario === 1) {
                nouvelleIC += changement_inf_reel > 0 ? 2 : 0;
            } else {
                nouvelleIE += changement_inf_reel > 0 ? 2 : 0;
            }

            lobby.infEtatsArr.push(nouvelleIE);
            lobby.infParlementArr.push(nouvelleIM);
            lobby.infCommissionArr.push(nouvelleIC);
        });

        // --- D. Appliquer la Dynamique Concurrentielle ---
        Object.values(lobbies).forEach(lobby => {
            if (!lobby.ennemis) return;

            let malus_ennemi = 0;
            lobby.ennemis.forEach(ennemi => {
                if (impacts[ennemi] > 0.6 && typeof impacts[ennemi] === 'number') {
                    malus_ennemi -= impacts[ennemi] * 3;
                }
            });

            // Applique le malus et borne les valeurs finales entre 0 et 100
            // Vérifier que les valeurs sont des nombres avant de les modifier
            lobby.infEtatsArr[i + 1] = Math.max(0, Math.min(100, (typeof lobby.infEtatsArr[i + 1] === 'number' ? lobby.infEtatsArr[i + 1] : 0) + malus_ennemi));
            lobby.infParlementArr[i + 1] = Math.max(0, Math.min(100, (typeof lobby.infParlementArr[i + 1] === 'number' ? lobby.infParlementArr[i + 1] : 0) + malus_ennemi));
            lobby.infCommissionArr[i + 1] = Math.max(0, Math.min(100, (typeof lobby.infCommissionArr[i + 1] === 'number' ? lobby.infCommissionArr[i + 1] : 0) + malus_ennemi));
        });
    }

    // --- NOUVELLE PARTIE : Calcul et retour du score d'influence agrégé ---
    const influenceScores = [];
    for (let i = 0; i < 10; i++) { // Loop sur les 10 années pour lesquelles les données ont été calculées
        let totalInfluenceThisYear = 0;
        let count = 0;
        Object.values(lobbies).forEach(lobby => {
            // Assurez-vous que les tableaux d'influence existent pour cette année
            if (lobby.infEtatsArr && typeof lobby.infEtatsArr[i] === 'number' &&
                lobby.infParlementArr && typeof lobby.infParlementArr[i] === 'number' &&
                lobby.infCommissionArr && typeof lobby.infCommissionArr[i] === 'number') {
                // Moyenne des trois types d'influence pour ce lobby, puis ajout au total
                totalInfluenceThisYear += (lobby.infEtatsArr[i] + lobby.infParlementArr[i] + lobby.infCommissionArr[i]) / 3;
                count++;
            }
        });

        if (count > 0) {
            influenceScores.push(totalInfluenceThisYear / count); // Moyenne de l'influence pour l'année
        } else {
            influenceScores.push(0); // Aucune donnée disponible, pousse 0
        }
    }
    // --- AJOUT : Calcul du score de réussite INDIVIDUEL pour chaque lobby après la simulation ---
    const lastYearIndex = simulationYears.length - 1; // Index 9 pour l'année 2034
    Object.values(lobbies).forEach(lobby => {
        console.log(`DEBUG: Lobby ${lobby.nom} array lengths before score calculation:`);
        console.log(`  reputationArr.length: ${lobby.reputationArr ? lobby.reputationArr.length : 'null'}`);
        console.log(`  infEtatsArr.length: ${lobby.infEtatsArr ? lobby.infEtatsArr.length : 'null'}`);
        console.log(`  infParlementArr.length: ${lobby.infParlementArr ? lobby.infParlementArr.length : 'null'}`);
        console.log(`  infCommissionArr.length: ${lobby.infCommissionArr ? lobby.infCommissionArr.length : 'null'}`);

        if (lobby.infEtatsArr && lobby.infEtatsArr.length > lastYearIndex &&
            lobby.infParlementArr && lobby.infParlementArr.length > lastYearIndex &&
            lobby.infCommissionArr && lobby.infCommissionArr.length > lastYearIndex) {

            // Assurer que les valeurs sont des nombres avant le calcul
            const ie = typeof lobby.infEtatsArr[lastYearIndex] === 'number' ? lobby.infEtatsArr[lastYearIndex] : 0;
            const ip = typeof lobby.infParlementArr[lastYearIndex] === 'number' ? lobby.infParlementArr[lastYearIndex] : 0;
            const ic = typeof lobby.infCommissionArr[lastYearIndex] === 'number' ? lobby.infCommissionArr[lastYearIndex] : 0;

            lobby.scoreDeReussite = (ie + ip + ic) / 3;
            console.log(`DEBUG: Score de réussite calculé pour ${lobby.nom}: ${lobby.scoreDeReussite.toFixed(2)}`);
        } else {
            lobby.scoreDeReussite = 0; // Ou une autre valeur par défaut si les données sont insuffisantes
            console.warn(`WARN: Impossible de calculer le score de réussite pour ${lobby.nom}, données insuffisantes.`);
        }
    });

    // Retourne l'objet avec la propriété 'influenceScores' que 'createLobbyChart' attend
    return { influenceScores: influenceScores };
}

// Cette fonction est responsable de l'affichage détaillé du score du lobby.
// Elle était présente dans lobbies.js et est nécessaire pour la "complexité première".
function showLobbyScore(lobby) {
    // globalLobbyScoreDiv doit être un élément DOM valide (par ex. un <div>)
    // qui est censé contenir les détails du score du lobby.
    // Il doit être initialisé dans votre DOMContentLoaded dans main.js.
    if (!globalLobbyScoreDiv) {
        console.error("Erreur: L'élément 'globalLobbyScoreDiv' n'est pas encore disponible ou n'a pas pu être récupéré. Assurez-vous qu'il est défini et correctement initialisé.");
        return;
    }

    // Vérifie si l'objet lobby et son nom sont définis
    if (!lobby || !lobby.nom) {
        console.error("Erreur: L'objet lobby est indéfini ou manque la propriété 'nom'.");
        globalLobbyScoreDiv.innerHTML = `<p>Erreur: Données du lobby non valides.</p>`;
        return;
    }

    // Vide le contenu précédent de l'élément
    globalLobbyScoreDiv.innerHTML = '';

    // Définition de la fonction utilitaire pour créer un élément de métrique
    const createMetricDiv = (label, value, isPercentage = false) => {
        console.log(`DEBUG: createMetricDiv - Label: ${label}, Value: ${value}, Type: ${typeof value}`); // AJOUTÉ POUR DÉBOGAGE
        const div = document.createElement('div');
        // MODIFIÉ: Vérification pour s'assurer que 'value' est un nombre avant d'appeler toFixed
        const formattedValue = typeof value === 'number' ? value.toFixed(2) : 'N/A';
        div.textContent = `${label}: ${formattedValue}${isPercentage ? '%' : ''}`;
        div.style.marginBottom = '10px';
        return div;
    };

    const lastYearIndex = simulationYears.length - 1;

    // Vérifie que toutes les données nécessaires sont disponibles et valides
    if (
        lobby.reputationArr && lobby.reputationArr.length > lastYearIndex &&
        lobby.infEtatsArr && lobby.infEtatsArr.length > lastYearIndex &&
        lobby.infParlementArr && lobby.infParlementArr.length > lastYearIndex &&
        lobby.infCommissionArr && lobby.infCommissionArr.length > lastYearIndex &&
        lobby.scoreDeReussite !== undefined // S'assurer que le score de réussite est déjà calculé
    ) {
        // AJOUT DU SCORE DE RÉUSSITE SPÉCIFIQUE
        const scoreReussiteP = document.createElement('h3'); // Utilisation d'un h3 pour le mettre en évidence
        scoreReussiteP.textContent = `Score de Réussite: ${Math.round(lobby.scoreDeReussite)}%`;
        scoreReussiteP.style.color = '#1a237e'; // Couleur pour le titre
        scoreReussiteP.style.marginTop = '15px';
        scoreReussiteP.style.marginBottom = '15px';
        globalLobbyScoreDiv.appendChild(scoreReussiteP);

        // Ajoute les métriques détaillées au DOM
        globalLobbyScoreDiv.appendChild(createMetricDiv('Réputation Finale', lobby.reputationArr[lastYearIndex]));
        globalLobbyScoreDiv.appendChild(createMetricDiv('Influence États Finale', lobby.infEtatsArr[lastYearIndex]));
        globalLobbyScoreDiv.appendChild(createMetricDiv('Influence Parlement Finale', lobby.infParlementArr[lastYearIndex]));
        globalLobbyScoreDiv.appendChild(createMetricDiv('Influence Commission Finale', lobby.infCommissionArr[lastYearIndex]));

        // Calcule l'influence moyenne (qui devrait être lobby.scoreDeReussite si elle est cohérente)
        const calculatedAvgInfluence = (
            (typeof lobby.infEtatsArr[lastYearIndex] === 'number' ? lobby.infEtatsArr[lastYearIndex] : 0) +
            (typeof lobby.infParlementArr[lastYearIndex] === 'number' ? lobby.infParlementArr[lastYearIndex] : 0) +
            (typeof lobby.infCommissionArr[lastYearIndex] === 'number' ? lobby.infCommissionArr[lastYearIndex] : 0)
        ) / 3;

        const summaryP = document.createElement('p');
        if (calculatedAvgInfluence > 70) {
            summaryP.innerHTML = `Le lobby ${lobby.nom} a maintenu une <strong>très forte influence</strong> globale.`;
            summaryP.style.color = '#2e7d32'; // Vert pour forte influence
        } else if (calculatedAvgInfluence > 50) {
            summaryP.innerHTML = `Le lobby ${lobby.nom} a une <strong>influence modérée</strong> mais significative.`;
            summaryP.style.color = '#f9a825'; // Jaune pour influence modérée
        } else {
            summaryP.innerHTML = `L'influence du lobby ${lobby.nom} est devenue <strong>faible</strong>.`;
            summaryP.style.color = '#c62828'; // Rouge pour faible influence
        }
        globalLobbyScoreDiv.appendChild(summaryP);
    } else {
        // Message d'erreur si les données sont incomplètes
        console.warn(`WARN: showLobbyScore - Données incomplètes ou non numériques pour le lobby ${lobby.nom}. Affichage du message par défaut.`);
        globalLobbyScoreDiv.innerHTML = `<p>Les données pour le lobby ${lobby.nom} ne sont pas encore disponibles ou complètes.</p>`;
    }
}


// Fonction pour afficher la page de transition
function showTransitionPage() {
    console.log("------------------------------------------");
    console.log("--> showTransitionPage ENTRÉE.");

    const carouselContainer = document.querySelector('.carousel-container');
    const mainContent = document.querySelector('.main-content');
    const transitionContainer = document.querySelector('.transition-container');

    // Logs pour le carouselContainer
    if (carouselContainer) {
        console.log("showTransitionPage DEBUG: carouselContainer trouvé.");
        console.log("  - Current display (style):", carouselContainer.style.display);
        console.log("  - Current display (computed):", getComputedStyle(carouselContainer).display);
        carouselContainer.style.display = 'none';
        console.log("  - New display (style):", carouselContainer.style.display);
    } else {
        console.warn("showTransitionPage AVERTISSEMENT: '.carousel-container' non trouvé.");
    }

    // Logs pour mainContent (doit rester hidden)
    if (mainContent) {
        console.log("showTransitionPage DEBUG: mainContent trouvé.");
        console.log("  - Current display (style):", mainContent.style.display);
        console.log("  - Current display (computed):", getComputedStyle(mainContent).display);
        mainContent.style.display = 'none'; // S'assurer qu'il est bien masqué
        console.log("  - New display (style):", mainContent.style.display);
    } else {
        console.warn("showTransitionPage AVERTISSEMENT: '#main-content' non trouvé.");
    }

    // Logs CRUCIALES pour transitionContainer
    if (transitionContainer) {
        console.log("showTransitionPage DEBUG: transitionContainer trouvé.");
        console.log("  - Current display (style):", transitionContainer.style.display);
        console.log("  - Current display (computed):", getComputedStyle(transitionContainer).display);
        console.log("  - Before setting display: BoundingRect - Width:", transitionContainer.getBoundingClientRect().width, "Height:", transitionContainer.getBoundingClientRect().height);

        transitionContainer.style.display = 'flex'; // Assurez-vous que c'est bien 'flex' ou 'block' selon votre CSS

        console.log("  - New display (style):", transitionContainer.style.display);
        console.log("  - After setting display: BoundingRect - Width:", transitionContainer.getBoundingClientRect().width, "Height:", transitionContainer.getBoundingClientRect().height);

        // Un petit délai pour laisser le navigateur potentiellement recalculer le rendu
        setTimeout(() => {
            console.log(`showTransitionPage DEBUG (after 50ms): transitionContainer Computed - Width: ${transitionContainer.offsetWidth}px, Height: ${transitionContainer.offsetHeight}px`);
            console.log(`showTransitionPage DEBUG (after 50ms): transitionContainer BoundingRect - Width: ${transitionContainer.getBoundingClientRect().width}px, Height: ${transitionContainer.getBoundingClientRect().height}px`);
            const zIndex = getComputedStyle(transitionContainer).zIndex;
            const position = getComputedStyle(transitionContainer).position;
            console.log(`showTransitionPage DEBUG (after 50ms): transitionContainer Computed - z-index: ${zIndex}, position: ${position}`);
        }, 50); // Un micro-délai pour la re-peinture du navigateur
    } else {
        console.error("showTransitionPage ERREUR: '.transition-container' non trouvé. La page de transition ne peut pas s'afficher.");
    }

    console.log("--> showTransitionPage SORTIE.");
    console.log("------------------------------------------");
}

function showMainContent() {
    console.log("------------------------------------------");
    console.log("ENTRÉE: showMainContent appelée.");

    const carouselContainer = document.querySelector('.carousel-container');
    const mainContent = document.querySelector('.main-content');
    const transitionContainer = document.querySelector('.transition-container');

    // Masquer le carrousel initial
    if (carouselContainer) {
        console.log("DEBUG showMainContent: Masquage de carouselContainer.");
        console.log("  - Current display (style):", carouselContainer.style.display);
        console.log("  - Current display (computed):", getComputedStyle(carouselContainer).display);
        carouselContainer.style.display = 'none';
        console.log("  - New display (style):", carouselContainer.style.display);
    } else {
        console.warn("AVERTISMENT showMainContent: Élément '.carousel-container' non trouvé.");
    }

    // Masquer la page de transition
    if (transitionContainer) {
        console.log("DEBUG showMainContent: Masquage de transitionContainer.");
        console.log("  - Current display (style):", transitionContainer.style.display);
        console.log("  - Current display (computed):", getComputedStyle(transitionContainer).display);
        transitionContainer.style.display = 'none'; // Le masque après l'animation de transition
        console.log("  - New display (style):", transitionContainer.style.display);
    } else {
        console.warn("AVERTISSEMENT showMainContent: Élément '.transition-container' non trouvé.");
    }

    // Afficher le contenu principal du simulateur
    if (mainContent) {
        console.log("DEBUG showMainContent: Affichage de mainContent.");
        console.log("  - Current display (style):", mainContent.style.display);
        console.log("  - Current display (computed):", getComputedStyle(mainContent).display);
        mainContent.style.display = 'block'; // Ou 'flex', selon votre #main-content CSS
        console.log("  - New display (style):", mainContent.style.display);

        // Vérification des dimensions après affichage de mainContent
        setTimeout(() => {
            console.log(`DEBUG showMainContent (after 50ms): mainContent Computed - Width: ${mainContent.offsetWidth}px, Height: ${mainContent.offsetHeight}px`);
            console.log(`DEBUG showMainContent (after 50ms): mainContent BoundingRect - Width: ${mainContent.getBoundingClientRect().width}px, Height: ${mainContent.getBoundingClientRect().height}px`);
        }, 50);

    } else {
        console.error("ERREUR showMainContent: Élément '#main-content' non trouvé. Le simulateur ne peut pas être affiché.");
    }

    console.log("SORTIE: showMainContent terminée.");
    console.log("------------------------------------------");
}


function handleSwipe() {
    const threshold = 50; // Distance minimale pour considérer comme un glissement

    if (touchEndX < touchStartX - threshold) { // Glissement vers la gauche (passe à la slide suivante)
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
    } else if (touchEndX > touchStartX + threshold) { // Glissement vers la droite (passe à la slide précédente)
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
    }
}

// --- Fin de la logique du carrousel ---


// --- Fonctions utilitaires et de logique de sélection de scénario/directive ---

/**
 * Popule le corps du tableau avec les amendements/directives pertinents pour un scénario donné.
 * @param {HTMLElement} tableBodyElement - Le tbody du tableau à populer.
 * @param {object} scenarioData - Les données complètes du scénario (y compris .directive.amendements).
 */
function populateDirectivesTable(tableBodyElement, scenarioData) {
    if (!scenarioData?.directive || !Array.isArray(scenarioData.directive)) {
        console.error("ERROR-DIRECTIVES-TABLE: pas de directive");
        return;
    }

    tableBodyElement.innerHTML = '';

    // On ne prend QUE la première directive du scénario (celle du JSON)
    const activeDirective = scenarioData.directive.find(d => d.id === 1);
    if (!activeDirective || !Array.isArray(activeDirective.amendements)) {
        console.error("ERROR-DIRECTIVES-TABLE: pas d’amendements");
        return;
    }

    const directivesToShow = activeDirective.amendements.filter(
        a => a.type === 'parlement' || a.type === 'conseil'
    );

    directivesToShow.forEach(amendement => {
        const row = tableBodyElement.insertRow();
        row.dataset.directiveId = amendement.id;
        row.dataset.directiveDescription = amendement.description;
        row.dataset.directiveType = amendement.type;

        const nameCell = row.insertCell(0);
        nameCell.textContent = amendement.description.length > 60
            ? amendement.description.substring(0, 57) + '...'
            : amendement.description;

        const typeCell = row.insertCell(1);
        typeCell.textContent = amendement.type === 'parlement' ? 'Parlement' : 'Conseil';

        const selectCell = row.insertCell(2);
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Choisir';
        selectBtn.className = 'select-directive-btn';
        selectBtn.disabled = false;
        selectCell.appendChild(selectBtn);

        selectBtn.addEventListener('click', e => {
            e.stopPropagation();
            handleDirectiveSelection(window.selectedScenarioId, amendement.id, amendement.description);
        });
    });
}

/**
 * Met à jour l'état (activé/désactivé) du bouton "Lancer la simulation".
 * Le bouton est activé si un scénario ET une directive sont sélectionnés.
 */
function updateLaunchButtonState() {
    // MODIFIÉ: Utilisation cohérente de window.selectedScenarioId et window.selectedDirectiveId
    if (window.selectedScenarioId !== null && window.selectedDirectiveId !== null) {
        launchSimulationBtn.disabled = false;
        launchSimulationBtn.textContent = `Lancer la simulation (Scénario ${window.selectedScenarioId} - ${window.selectedDirectiveId})`;
    } else {
        launchSimulationBtn.disabled = true;
        launchSimulationBtn.textContent = `Lancer la simulation`;
    }
}

/**
 * Gère l'état visuel et d'interaction des colonnes de scénario et des boutons.
 * Désactive les scénarios non sélectionnés et leurs directives, et met en évidence le scénario actif.
 * @param {number|null} scenarioToEnableId - L'ID du scénario à activer (1 ou 2), ou null pour désactiver tout.
 */
function setScenarioSelectionState(scenarioToEnableId = null) {
    // Réinitialise la mise en évidence de toutes les lignes de directive
    document.querySelectorAll('.scenario-table tbody tr').forEach(row => {
        row.classList.remove('selected');
    });

    // Gère les colonnes de scénario
    scenarioColumns.forEach(col => {
        const scenarioId = parseInt(col.dataset.scenarioId);
        if (scenarioId === scenarioToEnableId) {
            col.classList.remove('disabled');
            col.classList.add('selected'); // Met en évidence le scénario sélectionné
            // Active les boutons de directive dans la colonne sélectionnée
            col.querySelectorAll('.select-directive-btn').forEach(btn => btn.disabled = false);
        } else {
            col.classList.add('disabled'); // Désactive les autres colonnes
            col.classList.remove('selected');
            // Désactive les boutons de directive dans les autres colonnes
            col.querySelectorAll('.select-directive-btn').forEach(btn => btn.disabled = true);
        }
    });

    // Supprimez ou commentez les deux lignes suivantes pour garder les boutons de sélection de scénario toujours actifs
    // selectScenarioBtns.forEach(btn => btn.disabled = (scenarioToEnableId !== null));
    // drawScenarioBtn.disabled = (scenarioToEnableId !== null);

    // Active/désactive le bouton de tirage de directive
    drawDirectiveBtn.disabled = (scenarioToEnableId === null);
}

/**
 * Gère la sélection manuelle ou aléatoire d'une directive.
 * Met à jour l'état global et l'interface.
 * @param {number} scenarioId - L'ID du scénario auquel appartient la directive.
 * @param {string} directiveId - L'ID de la directive (ex: 'D1').
 * @param {string} directiveDescription - La description complète de la directive.
 */
function handleDirectiveSelection(scenarioId, directiveId, directiveDescription) {
    window.selectedDirectiveId = directiveId; // MODIFIÉ: Utilisation cohérente de window.
    window.selectedDirectiveDescription = directiveDescription; // MODIFIÉ: Utilisation cohérente de window.

    // Réinitialise la mise en évidence des lignes de directive
    document.querySelectorAll('.scenario-table tbody tr').forEach(row => {
        row.classList.remove('selected');
        // Réactive tous les boutons de sélection de directive pour le scénario actif avant de désactiver si besoin
        const btn = row.querySelector('.select-directive-btn');
        // MODIFIÉ: Utilisation cohérente de window.selectedScenarioId
        if (btn && parseInt(btn.closest('.scenario-column').dataset.scenarioId) === window.selectedScenarioId) {
            btn.disabled = false;
        }
    });

    // Met en évidence la ligne de la directive sélectionnée
    const selectedRow = document.querySelector(`.scenario-table tbody tr[data-directive-id="${directiveId}"]`);
    if (selectedRow) {
        selectedRow.classList.add('selected');
        // Désactive les autres boutons de sélection de directive une fois qu'une est choisie
        document.querySelectorAll('.scenario-table tbody tr .select-directive-btn').forEach(btn => {
            if (btn.closest('tr') !== selectedRow) {
                btn.disabled = true;
            }
        });
    }

    drawDirectiveBtn.disabled = true; // Désactive le tirage de directive une fois qu'une est choisie manuellement
    updateLaunchButtonState();
}

// --- Fonctions utilitaires pour récupérer les données simulées réelles ---

/**
 * Récupère les données simulées d'un parti pour toutes les années de simulation.
 * Cette fonction s'attend à ce que les tableaux d'évolution (e.g., parti.satisfactionArr)
 * aient déjà été peuplés par une fonction de simulation (e.g., simulerPartis).
 *
 * @param {string} partyKey La clé du parti (ex: 'PPE').
 * @returns {Object<string, Array<number>>} Un objet où chaque clé est un indicateur
 * (ex: 'satisfaction', 'meps') et la valeur est un tableau de 10 nombres pour chaque année.
 */
function getSimulatedPartyDataForYears(partyKey) {
    console.log(`DEBUG: Appel de getSimulatedPartyDataForYears pour le parti ${partyKey}.`);

    const party = partis[partyKey];
    if (!party) {
        console.error(`ERREUR: Parti '${partyKey}' non trouvé.`);
        return {};
    }

    // Nous nous attendons à ce que ces tableaux soient déjà remplis par votre logique de simulation (e.g., simulerPartis)
    const simulatedData = {
        satisfaction: party.satisfactionArr || [],
        meps: party.mepsArr || [],
        conseil: party.conseilArr || [],
        commissaires: party.commissairesArr || [],
        influence: party.presArr || [] // Assumant que 'presArr' est pour l'Influence Présidence
    };

    // Quelques vérifications pour s'assurer que les données existent et sont de la bonne longueur
    for (const key in simulatedData) {
        if (!Array.isArray(simulatedData[key]) || simulatedData[key].length === 0) {
            console.warn(`WARN: Les données simulées pour ${key} du parti ${partyKey} sont vides ou absentes.`);
            // Vous pourriez vouloir remplir avec des zéros ou une valeur par défaut ici si c'est critique
        }
    }

    return simulatedData;
}

/**
 * Met à jour le graphique des partis politiques ('politiqueChart').
 * Cette fonction appelle `getSimulatedPartyDataForYears` pour obtenir les données.
 */
function updatePolitiqueChartForSelectedParty() {
    console.log(`DEBUG-UPDATE-CHART: Mise à jour du graphique Politique pour : ${window.currentParti}`);

    const chartId = 'politiqueChart';
    const originalChart = charts[chartId];

    if (!originalChart) {
        console.error(`ERROR-UPDATE-CHART: Graphique original '${chartId}' non trouvé pour la mise à jour.`);
        return;
    }

    if (typeof partis === 'undefined' || typeof partis[window.currentParti] === 'undefined') {
        console.warn(`WARN-UPDATE-CHART: Données 'partis' indéfinies ou parti '${window.currentParti}' introuvable.`);
        return;
    }

    const selectedPartyData = partis[window.currentParti];

    // Appelle la fonction qui va chercher les vraies données sur 10 ans
    const simulatedPartyData = getSimulatedPartyDataForYears(window.currentParti);

    originalChart.data.labels = simulationYears; // Les années en abscisse
    originalChart.data.datasets = []; // Réinitialiser les datasets

    // Correspondance exacte avec les labels de votre plotPolitique
    const metricsConfig = [
        { key: 'satisfaction', label: 'Satisfaction (%)', color: '#d32f2f' },
        { key: 'meps', label: 'Députés', color: selectedPartyData.couleur }, // Utilise la couleur du parti
        { key: 'commissaires', label: 'Commissaires', color: '#888' },
        { key: 'conseil', label: 'Conseil (% États)', color: '#1976d2' },
        { key: 'influence', label: 'Présidence (%)', color: '#FFD700' } // Assumant 'presArr'
    ];

    metricsConfig.forEach(metric => {
        const dataForMetric = simulatedPartyData[metric.key];

        if (dataForMetric && Array.isArray(dataForMetric) && dataForMetric.length === simulationYears.length) {
            originalChart.data.datasets.push({
                label: metric.label, // Libellé exact de votre plotPolitique
                data: dataForMetric,
                borderColor: metric.color,
                backgroundColor: metric.color + '22', // Utilise la transparence de votre plotPolitique
                fill: false,
                tension: (metric.key === 'satisfaction') ? 0.35 : 0, // Tension spécifique pour satisfaction
                stepped: (metric.key === 'meps' || metric.key === 'commissaires' || metric.key === 'conseil' || metric.key === 'influence') ? true : false, // Stepped pour Députés/Commissaires/Conseil/Présidence
                yAxisID: (metric.key === 'satisfaction' || metric.key === 'conseil' || metric.key === 'influence') ? 'y2' : 'y', // Axes Y spécifiques
                borderDash: (metric.key === 'satisfaction') ? [10, 5] : [], // Bordure tiretée pour satisfaction
                borderWidth: (metric.key === 'satisfaction') ? 3 : 2, // Largeur de ligne spécifique
                pointRadius: 4,
                pointHoverRadius: 7
            });
        } else {
            console.warn(`WARN-UPDATE-CHART: Données simulées pour la métrique '${metric.label}' du parti '${selectedPartyData.nom}' sont invalides ou incomplètes.`);
        }
    });

    originalChart.options.plugins.title.text = `Projections politiques - ${selectedPartyData.nom}`; // Titre comme dans plotPolitique
    originalChart.update();
    console.log(`LOG-UPDATE-CHART: Graphique Politique mis à jour pour '${selectedPartyData.nom}' avec les indicateurs spécifiés sur les années.`);
}

/**
 * Récupère les données simulées d'un lobby pour toutes les années de simulation.
 * Cette fonction s'attend à ce que les tableaux d'évolution (e.g., lobby.reputationArr)
 * aient déjà été peuplés par la fonction `simulerLobbies`.
 *
 * @param {string} lobbyKey La clé du lobby (ex: 'BIG_TECH').
 * @returns {Object<string, Array<number>>} Un objet où chaque clé est un indicateur
 * (ex: 'reputation', 'infEtats') et la valeur est un tableau de 10 nombres pour chaque année.
 */
function getSimulatedLobbyDataForYears(lobbyKey) {
    console.log(`DEBUG: Appel de getSimulatedLobbyDataForYears pour le lobby ${lobbyKey}.`);

    const lobby = lobbies[lobbyKey];
    if (!lobby) {
        console.error(`ERREUR: Lobby '${lobbyKey}' non trouvé.`);
        return {};
    }

    // Nous nous attendons à ce que ces tableaux soient déjà remplis par simulerLobbies
    const simulatedData = {
        reputation: lobby.reputationArr || [],
        infEtats: lobby.infEtatsArr || [],
        infParlement: lobby.infParlementArr || [],
        infCommission: lobby.infCommissionArr || []
    };

    // Quelques vérifications pour s'assurer que les données existent et sont de la bonne longueur
    for (const key in simulatedData) {
        if (!Array.isArray(simulatedData[key]) || simulatedData[key].length === 0) {
            console.warn(`WARN: Les données simulées pour ${key} du lobby ${lobbyKey} sont vides ou absentes.`);
        }
    }

    return simulatedData;
}

/**
 * Met à jour le graphique des groupes de lobbying ('lobbyChart').
 * Cette fonction appelle `getSimulatedLobbyDataForYears` pour obtenir les données.
 */
function updateLobbyChartForSelectedLobby() {
    console.log(`DEBUG-UPDATE-CHART: Mise à jour du graphique Lobby pour : ${window.currentLobbyId}`);

    const chartId = 'lobbyChart';
    const originalChart = charts[chartId];

    if (!originalChart) {
        console.error(`ERROR-UPDATE-CHART: Graphique original '${chartId}' non trouvé pour la mise à jour.`);
        return;
    }

    if (typeof lobbies === 'undefined' || typeof lobbies[window.currentLobbyId] === 'undefined') {
        console.warn(`WARN-UPDATE-CHART: Données 'lobbies' indéfinies ou lobby '${window.currentLobbyId}' introuvable.`);
        return;
    }

    const selectedLobbyData = lobbies[window.currentLobbyId];

    /* ------------------------------------------------------------------
       FORCER une nouvelle simulation des lobbies avec les données UE actuelles
       ------------------------------------------------------------------ */
    if (!statsUE || !statsUE.pibArr?.length) {
        console.warn('WARN-UPDATE-CHART: statsUE non disponibles, impossibles de recalculer les lobbies.');
        return;
    }
    simulerLobbies(statsUE, window.currentScenario);

    /* ------------------------------------------------------------------ */

    // Récupération des données fraîches
    const simulatedLobbyData = getSimulatedLobbyDataForYears(window.currentLobbyId);

    originalChart.data.labels = simulationYears;
    originalChart.data.datasets = [];

    const metricsConfig = [
        { key: 'reputation',    label: 'Réputation',         color: '#9c27b0' },
        { key: 'infEtats',      label: 'Influence États',    color: '#1976d2' },
        { key: 'infParlement',  label: 'Influence Parlement',color: '#388e3c' },
        { key: 'infCommission', label: 'Influence Commission',color: '#f57c00' }
    ];

    metricsConfig.forEach(metric => {
        const dataForMetric = simulatedLobbyData[metric.key];
        if (dataForMetric && Array.isArray(dataForMetric) && dataForMetric.length === simulationYears.length) {
            originalChart.data.datasets.push({
                label: metric.label,
                data: dataForMetric,
                borderColor: metric.color,
                backgroundColor: metric.color + '22',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            });
        } else {
            console.warn(`WARN-UPDATE-CHART: Données simulées pour '${metric.label}' du lobby '${selectedLobbyData.nom}' sont invalides ou incomplètes.`);
        }
    });

    originalChart.options.plugins.title.text = `Évolution du lobby : ${selectedLobbyData.nom}`;
    originalChart.options.scales.y.max = 100;
    originalChart.update();
    console.log(`LOG-UPDATE-CHART: Graphique Lobby mis à jour pour '${selectedLobbyData.nom}'.`);
}

// Assurez-vous que 'charts' et 'chartIdsToClone' sont déclarés globalement ou accessibles ici.
// Par exemple:
// let charts = {}; // Contient les instances Chart.js des graphiques originaux
// const chartIdsToClone = ['euChart', 'countryChart', 'politiqueChart', 'lobbyChart']; // Les IDs des graphiques à cloner

// ---------------  cloneCharts  (version finale)  ---------------
// ---------------  cloneCharts  (version complète & cohérente)  ---------------
function cloneCharts() {
    console.log("DEBUG-CLONE-CHARTS-START: Début de la fonction cloneCharts.");

    const clonedDashboardChartsContainer = document.getElementById('clonedDashboardCharts');
    if (!clonedDashboardChartsContainer) {
        console.error('ERROR-CLONE-CHARTS: Conteneur pour les graphiques clonés non trouvé.');
        return;
    }

    if (!Array.isArray(chartIdsToClone)) {
        console.error("ERREUR-CLONE-CHARTS: 'chartIdsToClone' n'est pas un tableau valide.");
        return;
    }

    clonedDashboardChartsContainer.innerHTML = '';
    clonedDashboardChartsContainer.style.display = 'grid';
    clonedDashboardChartsContainer.style.minHeight = '500px';

    /* 1.  Initialise les clés manquantes pour éviter « undefined » */
    if (!window.currentCountryId  || !euStatesData.find(s => s.code === window.currentCountryId))
        window.currentCountryId  = euStatesData[0]?.code;
    if (!window.currentParti      || !partis[window.currentParti])
        window.currentParti      = Object.keys(partis)[0];
    if (!window.currentLobbyId    || !lobbies[window.currentLobbyId])
        window.currentLobbyId    = Object.keys(lobbies)[0];

    /* 2.  Helper : construction du titre dynamique */
    const buildTitle = (chartId) => {
        switch (chartId) {
            case 'countryChart':
                return `Évolution des indicateurs – ${euStatesData.find(s => s.code === window.currentCountryId)?.name}`;
            case 'politiqueChart':
                return `Projections politiques – ${partis[window.currentParti]?.nom}`;
            case 'lobbyChart':
                return `Évolution du lobby : ${lobbies[window.currentLobbyId]?.nom}`;
            default:
                return charts[chartId]?.config?.options?.plugins?.title?.text || chartId;
        }
    };

    /* 3.  Helper : synchronise le titre dans le zoom plein-écran */
    const syncZoomTitle = (chartId) => {
        if (window._fullChart) {
            window._fullChart.options.plugins.title.text = buildTitle(chartId);
            window._fullChart.update();
        }
    };

    chartIdsToClone.forEach(chartId => {
        const originalChart = charts[chartId];
        if (!originalChart || !originalChart.config || !originalChart.config.options) {
            console.warn(`WARN-CLONE-CHARTS: Graphique original '${chartId}' invalide ou configuration manquante.`);
            return;
        }

        const clonedChartWrapper = document.createElement('div');
        clonedChartWrapper.className = 'dashboard-chart cloned-chart-wrapper';
        clonedChartWrapper.style.position = 'relative';

        const chartTitle = document.createElement('div');
        chartTitle.className = 'chart-title';
        chartTitle.textContent = buildTitle(chartId);
        clonedChartWrapper.appendChild(chartTitle);

        const clonedCanvas = document.createElement('canvas');
        clonedCanvas.id = `cloned-${chartId}`;
        clonedCanvas.width = 400;
        clonedCanvas.height = 300;
        clonedCanvas.style.width = '100%';
        clonedCanvas.style.height = '100%';
        clonedChartWrapper.appendChild(clonedCanvas);

        let newClonedChartInstance = null;
        try {
            const clonedConfig = {
                type: originalChart.config.type,
                data: JSON.parse(JSON.stringify(originalChart.config.data)),
                options: {
                    ...originalChart.config.options,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        ...(originalChart.config.options?.plugins || {}),
                        legend: { display: true },
                        title:  { display: true, text: buildTitle(chartId) }
                    }
                }
            };
            newClonedChartInstance = new Chart(clonedCanvas, clonedConfig);
            console.log(`LOG-CLONE-CHARTS-SUCCESS: Graphique '${chartId}' cloné.`);
        } catch (error) {
            console.error(`ERREUR-CLONE-CHARTS: Échec du clonage de '${chartId}':`, error);
            clonedChartWrapper.remove();
            return;
        }

        /* 4.  Sélecteurs dynamiques + titre synchronisé */
        const createSelect = (data, labelKey, valueKey) => {
            const sel = document.createElement('select');
            sel.className = 'chart-selector';
            sel.id = `selector-${chartId}`;
            data.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item[valueKey];
                opt.textContent = item[labelKey];
                sel.appendChild(opt);
            });
            return sel;
        };

        if (chartId === 'countryChart') {
            const sel = createSelect(euStatesData, 'name', 'code');
            sel.value = window.currentCountryId;
            sel.onchange = (e) => {
                window.currentCountryId = e.target.value;
                updateCountryChartForSelectedCountry();
                if (charts.countryChart) charts.countryChart.update();
                const nt = buildTitle('countryChart');
                chartTitle.textContent = nt;
                if (newClonedChartInstance) {
                    newClonedChartInstance.data = JSON.parse(JSON.stringify(charts.countryChart.data));
                    newClonedChartInstance.options.plugins.title.text = nt;
                    newClonedChartInstance.update();
                }
                syncZoomTitle('countryChart');
            };
            clonedChartWrapper.appendChild(sel);

        } else if (chartId === 'politiqueChart') {
            const sel = document.createElement('select');
            sel.className = 'chart-selector';
            sel.id = `selector-${chartId}`;
            Object.keys(partis).forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = k;
                sel.appendChild(opt);
            });
            sel.value = window.currentParti;
            sel.onchange = (e) => {
                window.currentParti = e.target.value;
                updatePolitiqueChartForSelectedParty();
                if (charts.politiqueChart) charts.politiqueChart.update();
                const nt = buildTitle('politiqueChart');
                chartTitle.textContent = nt;
                if (newClonedChartInstance) {
                    newClonedChartInstance.data = JSON.parse(JSON.stringify(charts.politiqueChart.data));
                    newClonedChartInstance.options.plugins.title.text = nt;
                    newClonedChartInstance.update();
                }
                syncZoomTitle('politiqueChart');
            };
            clonedChartWrapper.appendChild(sel);

        } else if (chartId === 'lobbyChart') {
            const sel = document.createElement('select');
            sel.className = 'chart-selector';
            sel.id = `selector-${chartId}`;
            Object.keys(lobbies).forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = lobbies[k].nom;
                sel.appendChild(opt);
            });
            sel.value = window.currentLobbyId;
            sel.onchange = (e) => {
                window.currentLobbyId = e.target.value;
                updateLobbyChartForSelectedLobby();
                if (charts.lobbyChart) charts.lobbyChart.update();
                const nt = buildTitle('lobbyChart');
                chartTitle.textContent = nt;
                if (newClonedChartInstance) {
                    newClonedChartInstance.data = JSON.parse(JSON.stringify(charts.lobbyChart.data));
                    newClonedChartInstance.options.plugins.title.text = nt;
                    newClonedChartInstance.update();
                }
                syncZoomTitle('lobbyChart');
            };
            clonedChartWrapper.appendChild(sel);
        }

        /* 5.  Clic pour zoom plein-écran */
        clonedChartWrapper.style.cursor = 'pointer';
        clonedChartWrapper.title = 'Cliquer pour agrandir';
        clonedChartWrapper.addEventListener('click', (e) => {
            if (e.target.tagName !== 'SELECT') openDashboardFullscreen(chartId);
        });

        clonedDashboardChartsContainer.appendChild(clonedChartWrapper);
    });

    console.log("DEBUG-CLONE-CHARTS-END: Fin de la fonction cloneCharts.");
}

function getCurrentName(chartId) {
    switch (chartId) {
        case 'countryChart':
            return euStatesData.find(s => s.code === window.currentCountryId)?.name || window.currentCountryId;
        case 'politiqueChart':
            return partis[window.currentParti]?.nom || window.currentParti;
        case 'lobbyChart':
            return lobbies[window.currentLobbyId]?.nom || window.currentLobbyId;
        default:
            return '';
    }
}


/**
 * Construit dynamiquement les 4 inputs + bouton « Relancer »
 * dans le mini-dashboard flottant du mode plein-écran.
 * @param {string} chartId  euChart | countryChart | politiqueChart | lobbyChart
 */
function buildFullscreenInputs(chartId, scenario) {
    const container = document.getElementById('fullscreenControls');
    if (!container) return;
    container.innerHTML = '';

    console.log(`DEBUG buildFullscreenInputs: Scénario actuel = ${scenario}, Chart ID = ${chartId}`);


    /* --- Choix des champs et labels selon le scénario --- */
    const fields = scenario === 1
        ? [
            { id: 'fs_pib_eu',   label: 'PIB UE (%)',        min: 0,   max: 4,   step: 0.1 },
            { id: 'fs_gini_eu',  label: 'Gini',              min: 0.2, max: 0.6, step: 0.01 },
            { id: 'fs_co2_eu',   label: 'CO₂ (t)',           min: 2,   max: 10,  step: 0.1 },
            { id: 'fs_veb_eu',   label: 'VEB (Mds €)',       min: 0,   max: 100, step: 1 }
        ]
        : [
            { id: 'fs_normandie_eu', label: 'Indice Normandie',  min: 0,   max: 100, step: 1 },
            { id: 'fs_vdem_eu',      label: 'Démocratie (V-Dem)', min: 0,  max: 1,   step: 0.01 },
            { id: 'fs_pib_growth_eu', label: 'Croissance UE (%)', min: -2, max: 4,   step: 0.1 },
            { id: 'fs_idh_eu',       label: 'IDH',               min: 0,   max: 1,   step: 0.01 }
        ];

    /* --- Valeurs par défaut selon le scénario --- */
    const defaults = scenario === 1
        ? { pib_eu: 2, gini_eu: 0.3, co2_eu: 4, veb_eu: 80 }
        : { normandie_eu: 80, vdem_eu: 0.85, pib_growth_eu: 1.5, idh_eu: 0.92 };

    /* --- Construction des champs --- */
    fields.forEach(f => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.justifyContent = 'space-between';
        label.innerHTML = `${f.label} <input type="number" id="${f.id}" min="${f.min}" max="${f.max}" step="${f.step}" style="width:60px">`;
        container.appendChild(label);

        const input = document.getElementById(f.id);
        const key = f.id.replace('fs_', '');
        input.value = defaults[key];
    });

    /* --- Bouton Relancer --- */
    const btn = document.createElement('button');
    btn.textContent = 'Simuler';
    btn.style.marginTop = '4px';
    btn.style.padding = '4px 8px';
    btn.style.fontSize = '0.8rem';
    btn.addEventListener('click', () => runFullscreenSimulation());
    container.appendChild(btn);
}

/**
 * Lance la simulation depuis le zoom plein-écran
 */
function runFullscreenSimulation() {
    const scenario = window.currentScenario || 1;
    const keys = scenario === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const inputs = {};
    keys.forEach(k => {
        const el = document.getElementById(`fs_${k}`);
        inputs[k] = el ? parseFloat(el.value) || 0 : 0;
    });

    simulateLobbyInPlace(inputs); // ou simulate() selon votre architecture

    setTimeout(() => {
        if (window._fullChart && charts[window.currentChartId]?.data) {
            window._fullChart.data = JSON.parse(JSON.stringify(charts[window.currentChartId].data));
            window._fullChart.update();
        }
    }, 0);
}

function simulateLobbyInPlace(inputs) {
    const rawStats = simulateEU(window.currentScenario, inputs); // { arr1, arr2, arr3, arr4, satisArr }

    // Mapping dynamique selon le scénario
    let statsUE;

    if (window.currentScenario === 1) {
        statsUE = {
            pibArr: rawStats.arr1,
            giniArr: rawStats.arr2,
            co2Arr: rawStats.arr3,
            vebArr: rawStats.arr4,
            stabArr: Array(simulationYears.length).fill(75),  // valeur par défaut
            demArr: Array(simulationYears.length).fill(0.85),
            idhArr: Array(simulationYears.length).fill(0.9)
        };
    } else if (window.currentScenario === 2) {
        statsUE = {
            pibArr: rawStats.arr1, // utilisé comme "pib growth"
            giniArr: Array(simulationYears.length).fill(0.3), // valeur fictive
            co2Arr: Array(simulationYears.length).fill(4),
            vebArr: Array(simulationYears.length).fill(80),
            stabArr: rawStats.arr2,   // normandie = sécurité
            demArr: rawStats.arr3,    // vdem
            idhArr: rawStats.arr4     // idh
        };
    } else {
        console.warn("Scénario inconnu :", window.currentScenario);
        return;
    }

    simulerLobbies(statsUE, window.currentScenario);

}


function getSelectorFor(chartId) {
    switch (chartId) {
        case 'countryChart':
            return { data: euStatesData, key: 'code', label: 'name' };

        case 'politiqueChart':
            return {
                data: Object.keys(partis),         // ["PPE","SDE",…]
                key: null,                         // on garde la clé telle quelle
                label: k => k                      // on affiche l’initiale / la clé
            };

        case 'lobbyChart':
            return {
                data: Object.keys(lobbies),
                key: null,
                label: k => k
            };

        default:
            return null;
    }
}

function refreshLobbySimulation() {
    // On ré-utilise les indicateurs UE actuels (statsUE)
    if (!statsUE || !statsUE.pibArr?.length) return;

    simulerLobbies(statsUE, window.currentScenario);
}

/* -------------------------------------------------
   openDashboardFullscreen – version complète
   – sliders synchronisés
   – sélecteur dynamique (pays / parti / lobby)
   – bouton « Simuler »
   – MAJ des graphiques principaux
------------------------------------------------- */
function openDashboardFullscreen(chartId) {
    const modal   = document.getElementById('dashboardFullscreenModal');
    const canvas  = document.getElementById('dashboardFullscreenCanvas');
    const ctrlBox = document.getElementById('fullscreenControls');
    if (!modal || !canvas || !ctrlBox) return;
    const originalChart = charts[chartId];
    if (!originalChart) return;

    /* 1. Nettoyage */
    ctrlBox.innerHTML = '';
    if (window._fullChart) {
        window._fullChart.destroy();
        window._fullChart = null;
    }

    /* 2-a. 4 sliders synchronisés */
    buildSyncedInputs('fullscreenControls', currentScenario);

    /* 2-b. Bouton « Simuler » */
    const btn = document.createElement('button');
    btn.textContent = 'Simuler';
    btn.style.marginTop = '8px';
    btn.style.padding = '4px 8px';
    btn.style.fontSize = '0.8rem';
    btn.addEventListener('click', () => {
        simulate();
        setTimeout(() => {
            if (window._fullChart && charts[chartId]) {
                window._fullChart.data = JSON.parse(JSON.stringify(charts[chartId].data));
                window._fullChart.update();
            }
        }, 0);
    });
    ctrlBox.appendChild(btn);

    /* 2-c. Sélecteur dynamique (pays / parti / lobby) */
    const selector = getSelectorFor(chartId);
    if (selector) {
        const sel = document.createElement('select');
        sel.id = 'fullscreenDynamicSelect';
        sel.style.marginTop = '8px';
        sel.style.padding = '4px 6px';

        selector.data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = selector.key ? item[selector.key] : item;
            opt.textContent = selector.key ? item[selector.label] : selector.label(item);
            sel.appendChild(opt);
        });

        sel.value = chartId === 'countryChart' ? window.currentCountryId
            : chartId === 'politiqueChart' ? (window.currentParti || 'PPE')
                : (window.currentLobbyId || 'BIG_TECH');

        sel.addEventListener('change', (e) => {
            const val = e.target.value;
            let newTitle = '';

            if (chartId === 'countryChart') {
                window.currentCountryId = val;
                updateCountryChartForSelectedCountry();      // graphique principal
                if (charts.countryChart) charts.countryChart.update();
                newTitle = `Évolution des indicateurs – ${euStatesData.find(s => s.code === val)?.name || val}`;
            } else if (chartId === 'politiqueChart') {
                window.currentParti = val;
                updatePolitiqueChartForSelectedParty();      // graphique principal
                if (charts.politiqueChart) charts.politiqueChart.update();
                newTitle = `Projections politiques – ${partis[val]?.nom || val}`;
            } else {
                window.currentLobbyId = val;
                updateLobbyChartForSelectedLobby();          // graphique principal
                if (charts.lobbyChart) charts.lobbyChart.update();
                newTitle = `Évolution du lobby : ${lobbies[val]?.nom || val}`;
            }

            /* Mise à jour du graphique plein-écran */
            if (window._fullChart) {
                window._fullChart.data = JSON.parse(JSON.stringify(charts[chartId].data));
                window._fullChart.options.plugins.title.text = newTitle;
                window._fullChart.update();
            }
        });
        ctrlBox.appendChild(sel);
    }

    /* 3. Copie propre du graphique */
    const config = {
        type: originalChart.config.type,
        data: JSON.parse(JSON.stringify(originalChart.data)),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: chartId === 'countryChart'
                        ? `Évolution des indicateurs – ${getCurrentName('countryChart')}`
                        : chartId === 'politiqueChart'
                            ? `Projections politiques – ${getCurrentName('politiqueChart')}`
                            : `Évolution du lobby : ${getCurrentName('lobbyChart')}`
                }
            },
            scales: JSON.parse(JSON.stringify(originalChart.options.scales || {}))
        }
    };
    window._fullChart = new Chart(canvas, config);

    /* 4. Affichage */
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDashboardFullscreen() {
    const modal = document.getElementById('dashboardFullscreenModal');
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (window._fullChart) {
        window._fullChart.destroy();
        window._fullChart = null;
    }
}

/**
 * Point d'entrée pour la configuration du mode dashboard.
 * Récupère l'état actuel de la simulation et lance la mise à jour de l'interface du dashboard.
 */
function setupDashboardMode() {
    console.log("DEBUG-DASHBOARD-SETUP-START: setupDashboardMode démarré avec", {
        currentScenario,
        currentScenarioData,
        windowSelectedScenarioName: window.selectedScenarioName,
        scenario1Data,
        scenario2Data
    });

    if (!currentScenario) {
        console.warn("WARN-DASHBOARD-SETUP: currentScenario non défini, utilisation du scénario 1 par défaut.");
        currentScenario = 1;
    }

    currentScenarioData = currentScenario === 1 ? scenario1Data : scenario2Data;

    if (!currentScenarioData || !currentScenarioData.directive) {
        console.error("ERREUR-DASHBOARD-SETUP: Données du scénario ou directive manquantes. Impossible de configurer le dashboard.");
        return;
    }

    // Mettre à jour le titre du dashboard
    const dashboardTitle = document.getElementById('dashboardScenarioDisplay');
    if (dashboardTitle) {
        dashboardTitle.textContent = window.selectedScenarioName || (currentScenario === 1 ? "Développement Durable" : "Stabilité Géopolitique");
    }

    // 1. Mettre à jour les libellés et les valeurs des inputs du dashboard
    updateDashboardParams(currentScenario, currentScenarioData, statsUE);

    // 2. Mettre à jour l'affichage des inputs du simulateur principal (pour cohérence si on navigue)
    updateSimulatorInputsDisplay();

    // 3. ÉTAPE CRUCIALE AJOUTÉE : Activer la synchronisation bidirectionnelle des inputs
    // C'est cette ligne qui rend les inputs du dashboard fonctionnels.
    setupInputSynchronization();

    console.log("LOG-DASHBOARD-SETUP-END: setupDashboardMode terminé.");
}





// Fonction toggleDashboard - À MODIFIER
function toggleDashboard() {
    console.log("DEBUG: toggleDashboard() a été appelée.");
    const dashboardPanel = document.getElementById('dashboardContainer');
    if (!dashboardPanel) {
        console.error("ERREUR: Élément 'dashboardContainer' non trouvé.");
        return;
    }

    const isOpening = !dashboardPanel.classList.contains('open');
    dashboardPanel.classList.toggle('open'); // <-- Utilise la classe CSS

    if (isOpening) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (dashboardPanel.classList.contains('open')) {
                // C'est ici que les logs précédemment analysés apparaissaient.
                // Vérifiez ici les appels parasites à toggleDashboard() si le problème de fermeture immédiate revient.
                setupDashboardMode(); // <-- Assurez-vous qu'il n'y a PAS de toggleDashboard() ici
                cloneCharts();        // <-- Assurez-vous qu'il n'y a PAS de toggleDashboard() ici
            }
        }, 300); // Correspond à la durée de la transition CSS
    } else {
        document.body.style.overflow = 'auto';
    }
    console.log("DEBUG: Dashboard " + (isOpening ? "ouvert" : "fermé") + ".");
}


function openFullscreenChart(originalChartId) {
    console.log(`DEBUG-FULLSCREEN: Tentative d'ouverture du graphique '${originalChartId}' en plein écran.`);
    const originalChart = charts[originalChartId];
    if (!originalChart) {
        console.error(`ERREUR-FULLSCREEN: Graphique original '${originalChartId}' non trouvé pour le mode plein écran. Il doit être dans l'objet 'charts'.`);
        return;
    }

    const fullscreenChartModal = document.getElementById('fullscreenChartModal');
    const fullscreenChartContainer = document.getElementById('fullscreenChartContainer');
    if (!fullscreenChartModal || !fullscreenChartContainer) {
        console.error("ERREUR-FULLSCREEN: Éléments du modal plein écran non trouvés. Vérifiez les IDs 'fullscreenChartModal' et 'fullscreenChartContainer'.");
        return;
    }

    fullscreenChartContainer.innerHTML = ''; // Nettoyer le conteneur

    const fullscreenCanvas = document.createElement('canvas');
    fullscreenCanvas.id = `fullscreen-${originalChartId}`;
    fullscreenChartContainer.appendChild(fullscreenCanvas);

    // ... (Reste de la fonction openFullscreenChart inchangée, sauf si d'autres logs sont nécessaires) ...

    // Ajouter un sélecteur pour countryChart ou politiqueChart dans le modal
    let selector;
    if (originalChartId === 'countryChart' || originalChartId === 'politiqueChart') {
        selector = document.createElement('select');
        selector.className = 'chart-selector fullscreen-selector';
        const options = originalChartId === 'countryChart' ?
            ['France', 'Germany', 'Italy', 'Spain'] :
            Object.keys(partis); // Utiliser Object.keys(partis) pour politiqueChart
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selector.appendChild(opt);
        });
        selector.addEventListener('change', () => {
            console.log(`DEBUG-FULLSCREEN-SELECTOR: Sélecteur plein écran pour '${originalChartId}' changé à '${selector.value}'`);
            if (originalChartId === 'countryChart') {
                updateCountryChartForSelectedCountry(selector.value);
            } else if (originalChartId === 'politiqueChart') {
                updatePolitiqueChartForSelectedParty(selector.value); // Assurez-vous que cette fonction met à jour le graphique plein écran
            }
            const chartInstance = Chart.getChart(fullscreenCanvas);
            if (chartInstance) {
                chartInstance.destroy();
                console.log(`DEBUG-FULLSCREEN-SELECTOR: Instance Chart.js dupliquée détruite pour rafraîchissement.`);
            }
            const newConfig = JSON.parse(JSON.stringify(charts[originalChartId].config));
            newConfig.options.responsive = true;
            newConfig.options.maintainAspectRatio = false;
            newConfig.options.plugins.legend.display = true;
            newConfig.options.plugins.title.display = true;
            new Chart(fullscreenCanvas, newConfig);
            console.log(`LOG-FULLSCREEN-SELECTOR: Graphique plein écran pour '${originalChartId}' mis à jour.`);
        });
        fullscreenChartContainer.appendChild(selector);
    }
}





function closeFullscreenChart() {
    console.log("DEBUG-FULLSCREEN-CLOSE: Fermeture du mode plein écran.");
    const fullscreenChartModal = document.getElementById('fullscreenChartModal');
    const fullscreenChartContainer = document.getElementById('fullscreenChartContainer');
    if (fullscreenChartModal) {
        fullscreenChartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log("LOG-FULLSCREEN-CLOSE: Modal fermé, scroll activé.");
    }
    if (fullscreenChartContainer) {
        const chartInstance = Chart.getChart(`fullscreen-${currentZoomedChartId}`);
        if (chartInstance) {
            chartInstance.destroy();
            console.log(`LOG-FULLSCREEN-CLOSE: Instance Chart.js pour '${currentZoomedChartId}' détruite.`);
        }
        fullscreenChartContainer.innerHTML = ''; // Nettoie le canvas cloné
        console.log("LOG-FULLSCREEN-CLOSE: Conteneur de graphique plein écran vidé.");
    }
    currentZoomedChartId = null;
    console.log("LOG-FULLSCREEN-CLOSE: currentZoomedChartId réinitialisé.");
}

// ... (Votre fonction updateDashboardParams modifiée précédemment) ...
/**
 * Met à jour les libellés et les valeurs des indicateurs dans le panneau du dashboard.
 * Cette version est corrigée pour afficher correctement toutes les valeurs du Scénario 2
 * en lisant les bonnes propriétés depuis l'objet de résultats `statsUE`.
 *
 * @param {number} scenarioId - L'ID du scénario actuel (1 ou 2).
 * @param {object} scenarioData - Les données complètes du scénario.
 * @param {object|null} statsUEData - Les données de la dernière simulation, si elles existent.
 */
function updateDashboardParams(scenarioId, scenarioData, statsUEData = null) {
    console.log("DEBUG-DASHBOARD-PARAMS: Mise à jour des paramètres du dashboard pour le scénario", scenarioId);

    // Helper pour obtenir la dernière valeur d'un tableau de manière sûre
    const getLast = (arr) => (arr && arr.length > 0) ? arr[arr.length - 1] : undefined;

    // Détermine si on utilise les données post-simulation ou les données initiales
    const isPostSimulation = statsUEData && statsUEData.pibArr && statsUEData.pibArr.length > 0;

    let effectiveStats = {};
    if (isPostSimulation) {
        // CAS 1 : Une simulation a eu lieu. On lit les résultats depuis `statsUEData`.
        console.log("DEBUG-DASHBOARD-PARAMS: Utilisation des données post-simulation (statsUE).");
        effectiveStats = {
            // Indicateurs du Scénario 1
            pib: getLast(statsUEData.pibArr),
            gini: getLast(statsUEData.giniArr),
            co2: getLast(statsUEData.co2Arr),
            veb: getLast(statsUEData.vebArr),

            // Indicateurs du Scénario 2
            // CORRECTION : On utilise les bonnes clés (`stabArr`, `demArr`, `pibArr`)
            // qui correspondent à la structure de l'objet `statsUE`.
            normandie: getLast(statsUEData.stabArr),
            vdem: getLast(statsUEData.demArr),
            pib_growth: getLast(statsUEData.pibArr), // Pour le Scénario 2, pibArr contient la croissance
            idh: getLast(statsUEData.idhArr)
        };
    } else {
        // CAS 2 : Aucune simulation. On utilise les valeurs de départ du fichier JSON.
        console.log("DEBUG-DASHBOARD-PARAMS: Utilisation des données initiales du scénario.");
        const startStats = scenarioData.directive?.statistiques_depart || {};
        effectiveStats = {
            pib: startStats.pib_eu,
            gini: startStats.gini_eu,
            co2: startStats.co2_eu,
            veb: startStats.veb_eu,
            normandie: startStats.normandie_eu,
            vdem: startStats.vdem_eu,
            pib_growth: startStats.pib_growth_eu,
            idh: startStats.idh_eu
        };
    }

    // Fonctions utilitaires pour mettre à jour le DOM
    const updateInputLabel = (labelId, text) => {
        const element = document.getElementById(labelId);
        if (element) element.textContent = text;
    };
    const updateInput = (id, value) => {
        const element = document.getElementById(id);
        // On s'assure de ne pas afficher "undefined" ou "null" dans le champ
        if (element) element.value = (value !== undefined && value !== null) ? value : '';
    };

    let param1Label, param2Label, param3Label, param4Label;
    let param1Val, param2Val, param3Val, param4Val;

    if (scenarioId === 1) {
        // Ordre pour Scénario 1: PIB, Gini, CO2, VEB
        param1Label = 'PIB (%):';        param1Val = effectiveStats.pib;
        param2Label = 'Gini:';          param2Val = effectiveStats.gini;
        param3Label = 'CO2 (t):';       param3Val = effectiveStats.co2;
        param4Label = 'VEB:';           param4Val = effectiveStats.veb;
    } else { // Scénario 2
        // Ordre pour Scénario 2: Normandie, V-Dem, Croissance, IDH
        param1Label = 'Normandie:';     param1Val = effectiveStats.normandie;
        param2Label = 'V-Dem:';         param2Val = effectiveStats.vdem;
        param3Label = 'Croissance (%):';param3Val = effectiveStats.pib_growth;
        param4Label = 'IDH:';           param4Val = effectiveStats.idh;
    }

    // Mise à jour finale des libellés et des valeurs des inputs dans le DOM
    updateInputLabel('param1InputLabel', param1Label);
    updateInputLabel('param2InputLabel', param2Label);
    updateInputLabel('param3InputLabel', param3Label);
    updateInputLabel('param4InputLabel', param4Label);

    updateInput('param1Input', param1Val);
    updateInput('param2Input', param2Val);
    updateInput('param3Input', param3Val);
    updateInput('param4Input', param4Val);

    console.log("LOG-DASHBOARD-PARAMS-END: Paramètres du dashboard mis à jour.");
}

/**
 * Récupère les valeurs numériques actuelles des 4 inputs du tableau de bord.
 * @returns {Object} clés → valeurs numériques (ex: { pib_eu: 2.3, gini_eu: 0.31, … })
 */
function readDashboardInputs() {
    const scenario = window.currentScenario;   // 1 ou 2

    if (scenario === 1) {
        return {
            pib_eu:  parseFloat(document.getElementById('param1Input').value) || 0,
            gini_eu: parseFloat(document.getElementById('param2Input').value) || 0,
            co2_eu:  parseFloat(document.getElementById('param3Input').value) || 0,
            veb_eu:  parseFloat(document.getElementById('param4Input').value) || 0
        };
    } else { // scenario === 2
        return {
            normandie_eu: parseFloat(document.getElementById('param1Input').value) || 0,
            vdem_eu:      parseFloat(document.getElementById('param2Input').value) || 0,
            pib_growth_eu:parseFloat(document.getElementById('param3Input').value) || 0,
            idh_eu:       parseFloat(document.getElementById('param4Input').value) || 0
        };
    }
}

function buildSyncedInputs(containerId, scenario) {
    const isS1 = scenario === 1;
    const defs = isS1
        ? ['pib_eu','gini_eu','co2_eu','veb_eu']
        : ['normandie_eu','vdem_eu','pib_growth_eu','idh_eu'];
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // nettoie
    defs.forEach(key => {
        const label = document.createElement('label');
        label.innerHTML = `${key}: <input type="number" id="${containerId}_${key}" step="0.01">`;
        container.appendChild(label);
        const input = label.querySelector('input');

        // valeur initiale = celle du simulateur principal
        const mainInput = document.getElementById(key);
        input.value = mainInput ? mainInput.value : 0;

        // écriture bidirectionnelle
        input.addEventListener('input', () => {
            const val = parseFloat(input.value);
            // MAJ simulateur principal
            if (mainInput) mainInput.value = val;
            // MAJ l’autre vue
            syncSingleKey(key, val, containerId);
        });
    });
}

/**
 * Synchronise la valeur d'une clé sur tous les widgets pertinents.
 * VERSION AMÉLIORÉE : Gère les conteneurs standards ET les inputs spécifiques du dashboard (`paramXInput`).
 *
 * @param {string} key - La clé de l'indicateur (ex: 'pib_eu').
 * @param {number} val - La nouvelle valeur.
 * @param {string} [excludeContainerId] - L'ID du conteneur à ne pas mettre à jour (pour éviter les boucles).
 */
function syncSingleKey(key, val, excludeContainerId) {
    // --- PARTIE 1 : Logique existante pour les conteneurs synchronisés ---
    // Met à jour les inputs dans les conteneurs comme 'fullscreenControls'.
    ['dashboardControls', 'fullscreenControls'].forEach(id => {
        if (id === excludeContainerId) return;
        const tgt = document.getElementById(`${id}_${key}`);
        if (tgt && parseFloat(tgt.value) !== val) {
            tgt.value = val;
        }
    });

    // --- PARTIE 2 : NOUVELLE LOGIQUE pour les inputs principaux du dashboard ---
    // C'est le chaînon manquant qui lie le Zoom au Dashboard.

    // 1. On récupère le mappage des clés pour le scénario actuel.
    const scenario = window.currentScenario;
    const mainSimulatorKeys = scenario === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    // 2. On trouve l'index de la clé qui a été modifiée (0, 1, 2, ou 3).
    const keyIndex = mainSimulatorKeys.indexOf(key);

    // 3. Si la clé est trouvée, on met à jour l'input correspondant (`param1Input`, `param2Input`, etc.).
    if (keyIndex !== -1) {
        const dashboardParamId = `param${keyIndex + 1}Input`;
        const dashboardParamInput = document.getElementById(dashboardParamId);

        if (dashboardParamInput && parseFloat(dashboardParamInput.value) !== val) {
            dashboardParamInput.value = val;
            console.log(`SYNC-PLUS: Input principal du dashboard '${dashboardParamId}' mis à jour avec ${val}`);
        }
    }
}

// --- Fonction pour préparer et télécharger le CSV des groupes ---
function prepareAndDownloadGroupsCSV() {
    const hasData = groupedDataForCsv.commission.length > 0 ||
        groupedDataForCsv.states.some(s => s.members.length > 0) ||
        groupedDataForCsv.parties.some(p => p.members.length > 0) ||
        groupedDataForCsv.lobbies.some(l => l.members.length > 0);

    if (!hasData) {
        alert("Aucune donnée de groupe à télécharger. Veuillez d'abord générer les groupes.");
        return;
    }

    let csvString = 'Groupe Principal,Sous-Groupe,Membre';
    csvString += '\n';

    groupedDataForCsv.commission.forEach(member => {
        let line = `Commission Européenne,Commission,"${member ? member.fullName : ''}"`;
        csvString += line + '\n';
    });

    groupedDataForCsv.states.forEach(state => {
        if (state.members.length > 0) {
            state.members.forEach(member => {
                let line = `États Membres,${state.name},"${member ? member.fullName : ''}"`;
                csvString += line + '\n';
            });
        } else {
            let line = `États Membres,${state.name},""`;
            csvString += line + '\n';
        }
    });

    groupedDataForCsv.parties.forEach(party => {
        if (party.members.length > 0) {
            party.members.forEach(member => {
                let line = `Partis Politiques,${party.name},"${member ? member.fullName : ''}"`;
                csvString += line + '\n';
            });
        } else {
            let line = `Partis Politiques,${party.name},""`;
            csvString += line + '\n';
        }
    });

    groupedDataForCsv.lobbies.forEach(lobby => {
        if (lobby.members.length > 0) {
            lobby.members.forEach(member => {
                let line = `Lobbies,${lobby.name},"${member ? member.fullName : ''}"`;
                csvString += line + '\n';
            });
        } else {
            let line = `Lobbies,${lobby.name},""`;
            csvString += line + '\n';
        }
    });

    downloadCSV(csvString, "groupes_simulation.csv");
}

function redrawAllCharts() {
    // 1. Country chart
    updateCountryChartForSelectedCountry();

    // 2. Political chart
    updatePolitiqueUI();          // already calls plotPolitique

    // 3. Lobby chart
    createLobbyChart();

    // 4. Dashboard clones
    cloneCharts();
}


// --- Fonction pour gérer l'importation d'un fichier Excel ---
function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                    throw new Error("Aucune feuille trouvée dans le fichier Excel.");
                }

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                if (!worksheet) {
                    throw new Error(`La feuille "${sheetName}" est introuvable dans le fichier Excel.`);
                }

                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                students = [];

                if (jsonData.length > 1) {
                    const filteredJsonData = jsonData.slice(1).filter(row => {
                        const col0 = String(row[0] || '').trim();
                        const col1 = String(row[1] || '').trim();
                        return col0 !== '' || col1 !== '';
                    });

                    students = filteredJsonData.map((row, index) => {
                        const col0 = String(row[0] || '').trim();
                        const col1 = String(row[1] || '').trim();
                        const combinedName = `${col0} ${col1}`.trim();

                        return {
                            id: index + 1,
                            fullName: combinedName || `Élève Inconnu ${index + 1}`,
                            originalExcelName: combinedName || `Élève Inconnu ${index + 1}`
                        };
                    });
                }

                dataSource = 'excel';

                const numParticipantsInput = document.getElementById('numParticipants');
                if (numParticipantsInput) {
                    numParticipantsInput.value = students.length;
                } else {
                    console.warn("L'élément 'numParticipants' n'a pas été trouvé...");
                }

                groups = {
                    commission: { name: "Commission Européenne", members: [] },
                    states: euStatesData.slice(0, 6).map(data => ({ ...data, members: [] })),
                    parties: politicalPartiesData.slice(0, 6).map(data => ({ ...data, members: [] })),
                    lobbies: lobbyGroupsData.slice(0, 6).map(data => ({ ...data, members: [] }))
                };
                groupedDataForCsv = JSON.parse(JSON.stringify(groups));

                if (downloadCsvBtn) {
                    downloadCsvBtn.disabled = students.length === 0;
                }

                if (students.length > 0) {
                    allocateManualGroups();
                } else {
                    displayGroups();
                }

            } catch (error) {
                console.error("Erreur lors du traitement du fichier Excel:", error);
                if (downloadCsvBtn) {
                    downloadCsvBtn.disabled = true;
                }
                students = [];
                const numParticipantsInput = document.getElementById('numParticipants');
                if (numParticipantsInput) {
                    numParticipantsInput.value = 0;
                }
                dataSource = 'manual';
                groups = {
                    commission: { name: "Commission Européenne", members: [] },
                    states: euStatesData.slice(0, 6).map(data => ({ ...data, members: [] })),
                    parties: politicalPartiesData.slice(0, 6).map(data => ({ ...data, members: [] })),
                    lobbies: lobbyGroupsData.slice(0, 6).map(data => ({ ...data, members: [] }))
                };
                groupedDataForCsv = JSON.parse(JSON.stringify(groups));
                displayGroups();
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

// --- Fonction pour allouer les groupes manuellement ---
function allocateManualGroups() {
    const numParticipantsInput = document.getElementById('numParticipants');
    const numParticipants = parseInt(numParticipantsInput.value, 10);

    if (isNaN(numParticipants) || numParticipants <= 0) {
        alert("Veuillez entrer un nombre valide de participants (au moins 3).");
        return;
    }

    if (numParticipants < 3) {
        alert("Il faut au moins 3 élèves pour pouvoir répartir les rôles de la simulation.");
        const groupsContainer = document.getElementById('groupsContainer');
        if (groupsContainer) groupsContainer.innerHTML = '<p style="color: red;">Veuillez entrer au moins 3 élèves.</p>';
        return;
    }

    groups = {
        commission: { name: "Commission Européenne", members: [] },
        states: euStatesData.slice(0, 6).map(data => ({ ...data, members: [] })),
        parties: politicalPartiesData.slice(0, 6).map(data => ({ ...data, members: [] })),
        lobbies: lobbyGroupsData.slice(0, 6).map(data => ({ ...data, members: [] }))
    };

    groupedDataForCsv = {
        commission: [],
        states: euStatesData.slice(0, 6).map(data => ({ ...data, members: [] })),
        parties: politicalPartiesData.slice(0, 6).map(data => ({ ...data, members: [] })),
        lobbies: lobbyGroupsData.slice(0, 6).map(data => ({ ...data, members: [] }))
    };

    if (dataSource === 'manual' || !students || students.length === 0) {
        students = Array.from({ length: numParticipants }, (_, i) => ({
            id: i + 1,
            fullName: `Participant ${i + 1}`,
            originalExcelName: ''
        }));
    }

    if (dataSource === 'excel' && students.length !== numParticipants) {
        const numParticipantsInput = document.getElementById('numParticipants');
        if (numParticipantsInput) {
            numParticipantsInput.value = students.length;
        }
        console.log(`Nombre de participants ajusté de ${numParticipants} à ${students.length} selon le fichier Excel.`);
    }

    if (!students || students.length === 0) {
        alert("Erreur : Aucun participant disponible pour la répartition.");
        return;
    }

    let shuffledStudents = shuffleArray([...students]);

    let commissionSize = Math.max(1, Math.floor(numParticipants * 0.05));
    commissionSize = Math.min(commissionSize, shuffledStudents.length);

    for (let i = 0; i < commissionSize; i++) {
        if (shuffledStudents.length > 0) {
            const member = shuffledStudents.shift();
            groups.commission.members.push(member);
            groupedDataForCsv.commission.push(member);
        }
    }

    let availableSubGroups = [];

    for (let i = 0; i < groups.states.length; i++) {
        availableSubGroups.push({
            displayGroup: groups.states[i],
            csvGroup: groupedDataForCsv.states[i]
        });
    }

    for (let i = 0; i < groups.parties.length; i++) {
        availableSubGroups.push({
            displayGroup: groups.parties[i],
            csvGroup: groupedDataForCsv.parties[i]
        });
    }

    for (let i = 0; i < groups.lobbies.length; i++) {
        availableSubGroups.push({
            displayGroup: groups.lobbies[i],
            csvGroup: groupedDataForCsv.lobbies[i]
        });
    }

    if (availableSubGroups.length === 0) {
        alert("Erreur : Aucun sous-groupe disponible pour la répartition.");
        return;
    }

    shuffleArray(availableSubGroups);

    let subGroupIndex = 0;
    while (shuffledStudents.length > 0) {
        const member = shuffledStudents.shift();
        const targetSubGroupPair = availableSubGroups[subGroupIndex % availableSubGroups.length];

        targetSubGroupPair.displayGroup.members.push(member);
        targetSubGroupPair.csvGroup.members.push(member);

        subGroupIndex++;
    }

    displayGroups();

    if (downloadCsvBtn) {
        downloadCsvBtn.disabled = false;
    }
}

// --- Fonction pour afficher les groupes dans l'interface ---
function displayGroups() {
    const commissionMembersEl = document.getElementById('commissionMembers');
    const statesMembersEl = document.getElementById('statesMembers');
    const partiesMembersEl = document.getElementById('partiesMembers');
    const lobbiesMembersEl = document.getElementById('lobbiesMembers');

    console.log("Éléments trouvés:", {
        commissionMembersEl: !!commissionMembersEl,
        statesMembersEl: !!statesMembersEl,
        partiesMembersEl: !!partiesMembersEl,
        lobbiesMembersEl: !!lobbiesMembersEl
    });

    if (!commissionMembersEl || !statesMembersEl || !partiesMembersEl || !lobbiesMembersEl) {
        console.error("Un ou plusieurs éléments conteneurs de groupes n'ont pas été trouvés dans le HTML. L'affichage sera incorrect Federated.");
        const groupsContainer = document.getElementById('groupsContainer');
        if (groupsContainer) {
            groupsContainer.innerHTML = '<p style="color: red;">Erreur: Conteneurs d\'affichage des groupes manquants. Vérifiez le HTML.</p>';
        }
        return;
    }

    commissionMembersEl.innerHTML = '';
    statesMembersEl.innerHTML = '';
    partiesMembersEl.innerHTML = '';
    lobbiesMembersEl.innerHTML = '';

    if (groups.commission && groups.commission.members) {
        groups.commission.members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = member.fullName;
            commissionMembersEl.appendChild(li);
        });
        if (groups.commission.members.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Aucun membre";
            commissionMembersEl.appendChild(li);
        }
    }

    if (groups.states && groups.states.length > 0) {
        groups.states.forEach(state => {
            const div = document.createElement('div');
            div.className = 'sub-group-card';
            const memberList = state.members && state.members.length > 0 ?
                `<ul>${state.members.map(m => `<li>${m.fullName}</li>`).join('')}</ul>` :
                `<ul><li>Aucun membre</li></ul>`;
            div.innerHTML = `
                <img src="${state.icon}" alt="${state.name} Flag" class="sub-group-icon">
                <h4>${state.name} (${state.members ? state.members.length : 0} membres)</h4>
                ${memberList}
            `;
            statesMembersEl.appendChild(div);
        });
    }

    if (groups.parties && groups.parties.length > 0) {
        groups.parties.forEach(party => {
            const div = document.createElement('div');
            div.className = 'sub-group-card';
            const memberList = party.members && party.members.length > 0 ?
                `<ul>${party.members.map(m => `<li>${m.fullName}</li>`).join('')}</ul>` :
                `<ul><li>Aucun membre</li></ul>`;
            div.innerHTML = `
                <img src="${party.icon}" alt="${party.name} Symbol" class="sub-group-icon">
                <h4>${party.name} (${party.members ? party.members.length : 0} membres)</h4>
                ${memberList}
            `;
            partiesMembersEl.appendChild(div);
        });
    }

    if (groups.lobbies && groups.lobbies.length > 0) {
        lobbiesMembersEl.innerHTML = '';
        groups.lobbies.forEach(lobby => {
            const div = document.createElement('div');
            div.className = 'sub-group-card';
            const memberList = lobby.members && lobby.members.length > 0 ?
                `<ul>${lobby.members.map(m => `<li>${m.fullName}</li>`).join('')}</ul>` :
                `<ul><li>Aucun membre</li></ul>`;
            div.innerHTML = `
                <img src="${lobby.icon}" alt="${lobby.name} Symbol" class="sub-group-icon">
                <h4>${lobby.name} (${lobby.members ? lobby.members.length : 0} membres)</h4>
                ${memberList}
            `;
            lobbiesMembersEl.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DEBUG: DOMContentLoaded fired. Attempting to get element references.");

    // --- Références aux éléments DOM clés (initialisation des variables globales) ---
    globalLobbySelectElement = document.getElementById('lobbySelect');
    // MODIFICATION ICI: L'ID du canvas dans index7.html est 'lobbyChart'
    globalLobbyChartCanvas = document.getElementById('lobbyChart');
    globalLobbyScoreDiv = document.getElementById('lobbyScore');
    dashboardCountrySelect = document.getElementById('countrySelect');

    // Vérification des éléments DOM pour le debug
    console.log("DEBUG: globalLobbySelectElement:", globalLobbySelectElement);
    console.log("DEBUG: globalLobbyChartCanvas:", globalLobbyChartCanvas); // Devrait être un élément HTMLCanvasElement, pas null
    console.log("DEBUG: globalLobbyScoreDiv:", globalLobbyScoreDiv);
    console.log("DEBUG: dashboardCountrySelect:", dashboardCountrySelect);

    if (!globalLobbyScoreDiv) {
        console.error("CRITICAL: 'lobbyScore' element not found in DOM at initialization.");
    }
    // Mise à jour du message d'erreur si l'élément lobbyChart n'est pas trouvé
    if (!globalLobbyChartCanvas) {
        console.error("CRITICAL: 'lobbyChart' element not found in DOM at initialization. Le graphique du lobby ne s'affichera pas sans cet élément HTML.");
    }

    // Autres éléments DOM
    const appMainContent = document.getElementById('app-main-content');
    const carouselContainer = document.querySelector('.carousel-container');
    const transitionContainer = document.querySelector('.trans-container'); // Correction de l'ID pour 'transition-container'
    const startSimulationBtn = document.getElementById('startSimulationBtn');
    const mainContent = document.querySelector('.main-content');
    const selectedScenarioElement = document.getElementById('selected-scenario');
    const selectedDirectiveElement = document.getElementById('selected-directive');
    const scenarioDescription = document.querySelector('.scenario-description p');
    const objectivesList = document.querySelector('.objectives-list');
    const dashboardPanel = document.getElementById('dashboardContainer');
    const dbBtn1 = document.getElementById('dbBtn1');
    const dbBtn2 = document.getElementById('dbBtn2');
    const simulateBtn = document.getElementById('simulButton');
    const dbSimulateBtn = document.getElementById('dbSimulateBtn');
    const dashboardToggle = document.getElementById('dashboardToggle');
    const closeDashboardBtn = document.getElementById('closeDashboard');
    const partiSelect = document.getElementById('partiSelect');
    const navButtons = document.querySelectorAll("nav button[data-tab]");
    const excelFile = document.getElementById('excelFile');
    const generateGroupsBtn = document.getElementById('generateGroupsBtn'); // Supposé, à confirmer
    const closeBtn = document.getElementById('dashboardFullscreenCloseBtn');
    const modal    = document.getElementById('dashboardFullscreenModal');


    // Références aux éléments HTML (déjà déclarées globalement, initialisées ici)
    selectScenarioBtns = document.querySelectorAll('.select-scenario-btn');
    drawScenarioBtn = document.getElementById('drawScenarioBtn');
    drawDirectiveBtn = document.getElementById('drawDirectiveBtn');
    launchSimulationBtn = document.getElementById('launchSimulationBtn');
    scenario1TableBody = document.querySelector('#scenario1Table tbody');
    scenario2TableBody = document.querySelector('#scenario2Table tbody');
    scenarioColumns = document.querySelectorAll('.scenario-column');
    scenario1ParamsDiv = document.getElementById('scenario1Params');
    scenario2ParamsDiv = document.getElementById('scenario2Params');
    scenarioDisplayDiv = document.getElementById('scenarioDisplay');

    carousel = document.getElementById('landing-carousel');
    if (carousel) {
        slides = carousel.querySelectorAll('.carousel-slide');
        totalSlides = slides.length;
        dots = document.querySelectorAll('.carousel-dot');
        prevBtn = document.querySelector('.prev');
        nextBtn = document.querySelector('.next');
    }

    tabContents = document.querySelectorAll('.tab-content');
    tabButtons = document.querySelectorAll('.tab-button');

    fullscreenChartModal = document.getElementById('fullscreenChartModal');
    closeFullscreenModalBtn = document.getElementById('closeFullscreenModalBtn');
    fullscreenChartContainer = document.getElementById('fullscreenChartContainer');

    downloadCsvBtn = document.getElementById('downloadCsvBtn');


    // --- Initialisation de la visibilité ---
    if (carouselContainer) carouselContainer.style.display = 'flex';
    if (transitionContainer) transitionContainer.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';

    // --- Désactivation initiale du bouton de téléchargement CSV ---
    if (downloadCsvBtn) downloadCsvBtn.disabled = true;

    // --- Fonctions d'initialisation et de gestion des événements ---




    // --- Attachement des écouteurs d'événements ---

    // Écouteur pour le sélecteur de lobby (CORRIGÉ POUR LA DUPLICATION)
    if (globalLobbySelectElement) {
        if (typeof lobbies !== 'undefined' && Object.keys(lobbies).length > 0) {
            // AJOUT IMPORTANT: Vide le sélecteur avant de le peupler pour éviter les doublons
            globalLobbySelectElement.innerHTML = '';

            Object.keys(lobbies).forEach(lobbyCode => {
                const lobby = lobbies[lobbyCode];
                const option = document.createElement('option');
                option.value = lobbyCode;
                option.textContent = lobby.nom;
                globalLobbySelectElement.appendChild(option);
            });
            globalLobbySelectElement.value = Object.keys(lobbies)[0]; // Sélectionne le premier lobby par défaut
        } else {
            console.warn("WARN: La variable 'lobbies' n'est pas définie ou est vide. Impossible de peupler le sélecteur de lobby.");
        }

        globalLobbySelectElement.addEventListener('change', () => {
            if (typeof createLobbyChart === 'function') {
                createLobbyChart();
            } else {
                console.warn("WARN: createLobbyChart() n'est pas définie lors du changement de lobby.");
            }
        });
        console.log("DEBUG: Écouteur 'change' pour lobbySelectElement attaché.");
    } else {
        console.error("DEBUG: lobbySelectElement non trouvé.");
    }

    // Écouteur pour le bouton de simulation dans le dashboard
    if (dbSimulateBtn) {
        dbSimulateBtn.addEventListener('click', () => {
            console.log("DEBUG: dbSimulateBtn cliqué, déclenchement de la simulation.");
            if (typeof simulate === 'function') {
                simulate();
                redrawAllCharts();
            } else {
                console.warn("WARN: simulate() n'est pas définie lors du clic sur dbSimulateBtn.");
            }
            if (typeof cloneCharts === 'function') {
                setTimeout(cloneCharts, 2000);
            } else {
                console.warn("WARN: cloneCharts() n'est pas définie lors du clic sur dbSimulateBtn.");
            }
        });
    }

    if (simulateBtn) {
        simulateBtn.addEventListener('click', () => {
            console.log("DEBUG: simulButton cliqué, déclenchement de la simulation.");
            if (typeof simulate === 'function') {
                simulate();
                // Forcer la mise à jour du graphique après la simulation
                if (typeof updateCountryChartForSelectedCountry === 'function' && charts.countryChart) {
                    updateCountryChartForSelectedCountry(charts.countryChart, window.currentCountryId);
                }
            } else {
                console.warn("WARN: simulate() n'est pas définie lors du clic sur simulButton.");
            }
            if (typeof cloneCharts === 'function') {
                setTimeout(cloneCharts, 100);
            } else {
                console.warn("WARN: cloneCharts() n'est pas définie lors du clic sur simulButton.");
            }
        });
    }

    if (partiSelect) {
        // --- Aucune injection d'options n'est nécessaire ici, car le HTML est statique ---
        // Supprimez tout le bloc 'if (typeof politicalPartiesData !== ...)'
        // et la boucle 'forEach' qui créait les options.

        // Initialise 'currentParti' avec la valeur actuellement sélectionnée dans le HTML
        // (ce sera la première option si aucune n'est pré-sélectionnée par 'selected')
        currentParti = partiSelect.value;

        console.log("DEBUG: Parti initial:", currentParti);

        // Ajoute l'écouteur d'événements pour réagir aux changements de sélection
        partiSelect.addEventListener('change', (event) => {
            currentParti = event.target.value;
            console.log("DEBUG: Nouveau parti sélectionné:", currentParti);

            if (typeof updatePolitiqueUI === 'function') {
                updatePolitiqueUI();
            } else {
                console.warn("WARN: updatePolitiqueUI() n'est pas définie lors du changement de parti.");
            }

            // Si vous avez une fonction pour mettre à jour le graphique politique, appelez-la ici aussi :
            // if (typeof updatePolitiqueChartForSelectedParty === 'function') {
            //     updatePolitiqueChartForSelectedParty();
            // }
        });
    } else {
        console.error("ERREUR: l'élément 'partiSelect' n'a pas été trouvé dans le DOM.");
    }

    if (dashboardCountrySelect && typeof profiles !== 'undefined' && Object.keys(profiles).length > 0) {
        dashboardCountrySelect.innerHTML = '';
        if (typeof euStatesData !== 'undefined' && euStatesData.length > 0) {
            euStatesData.forEach(state => {
                const option = document.createElement('option');
                option.value = state.code;
                option.textContent = state.name;
                dashboardCountrySelect.appendChild(option);
            });
            window.currentCountryId = dashboardCountrySelect.value;
            console.log("DEBUG: Pays initial (principal):", window.currentCountryId);
            // Forcer la mise à jour initiale du graphique
            if (typeof updateCountryChartForSelectedCountry === 'function' && charts.countryChart) {
                updateCountryChartForSelectedCountry(charts.countryChart, window.currentCountryId);
            }
        } else {
            console.warn("WARN: La variable 'euStatesData' n'est pas définie ou est vide.");
        }

        dashboardCountrySelect.addEventListener('change', (event) => {
            window.currentCountryId = event.target.value;
            console.log("DEBUG: Pays sélectionné (principal):", window.currentCountryId);
            if (typeof updateCountryChartForSelectedCountry === 'function' && charts.countryChart) {
                updateCountryChartForSelectedCountry(charts.countryChart, window.currentCountryId);
            } else {
                console.warn("WARN: updateCountryChartForSelectedCountry() non définie ou graphique principal non trouvé.");
            }
        });
    } else {
        console.warn("WARN: dashboardCountrySelect ou profils manquants.");
    }

    // L'ancienne variable `tabButtons` ne correspondait à aucun élément dans votre HTML.
    if (navButtons) {
        navButtons.forEach(button => {
            button.addEventListener("click", () => {
                // L'attribut `data-tab` du bouton (ex: "euro-tab") est passé à showTab.
                // La fonction showTab se chargera d'afficher le div avec l'ID correspondant.
                showTab(button.getAttribute("data-tab"));
            });
        });
        console.log("LOG: Écouteurs d'événements pour les onglets de navigation activés.");
    } else {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (typeof updateCarousel === 'function') {
                    updateCarousel(index);
                } else {
                    console.warn("WARN: updateCarousel() n'est pas définie lors du clic sur le point du carrousel.");
                }
            });
        });
    }
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (typeof updateCarousel === 'function') {
            updateCarousel(currentSlide - 1);
        } else {
            console.warn("WARN: updateCarousel() n'est pas définie lors du clic sur le bouton précédent.");
        }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (typeof updateCarousel === 'function') {
            updateCarousel(currentSlide + 1);
        } else {
            console.warn("WARN: updateCarousel() n'est pas définie lors du clic sur le bouton suivant.");
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (typeof handleSwipe === 'function') {
                handleSwipe();
            } else {
                console.warn("WARN: handleSwipe() n'est pas définie lors de la fin du balayage.");
            }
        }, { passive: true });
    }

    if (excelFile) {
        excelFile.addEventListener('change', (event) => {
            if (typeof handleFile === 'function') {
                handleFile(event);
            } else {
                console.warn("WARN: handleFile() n'est pas définie lors du changement de fichier excel.");
            }
        });
    }
    if (generateGroupsBtn) {
        generateGroupsBtn.addEventListener('click', () => {
            if (typeof allocateManualGroups === 'function') {
                allocateManualGroups();
            } else {
                console.warn("WARN: allocateManualGroups() n'est pas définie lors du clic sur le bouton de génération de groupes.");
            }
        });
    } else {
        console.warn("WARN: generateGroupsBtn non trouvé. Vérifiez l'ID du bouton de génération des groupes.");
    }
    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', () => {
            if (typeof prepareAndDownloadGroupsCSV === 'function') {
                prepareAndDownloadGroupsCSV();
            } else {
                console.warn("WARN: prepareAndDownloadGroupsCSV() n'est pas définie lors du clic sur le bouton de téléchargement CSV.");
            }
        });
    }


    if (dashboardToggle) dashboardToggle.addEventListener('click', (event) => { // <-- Ajout de 'event' ici
        if (event) event.stopPropagation(); // <-- Ajouter cette ligne (si le dashboardToggle est imbriqué)
        if (typeof toggleDashboard === 'function') {
            toggleDashboard();
        } else {
            console.warn("WARN: toggleDashboard() n'est pas définie lors du clic sur le bouton d'activation du dashboard.");
        }
    });
    if (closeDashboardBtn) {
        closeDashboardBtn.addEventListener('click', (event) => { // <-- Ajout de 'event' ici
            console.log("DEBUG: Clic sur le bouton de fermeture du Dashboard (X).");
            if (event) event.stopPropagation(); // <-- Ajouter cette ligne
            if (typeof toggleDashboard === 'function') {
                toggleDashboard();
            } else {
                console.warn("WARN: toggleDashboard() n'est pas définie lors du clic sur le bouton de fermeture du dashboard.");
            }
        });
    }

    if (closeFullscreenModalBtn) {
        closeFullscreenModalBtn.addEventListener('click', () => {
            fullscreenChartModal.style.display = 'none';
            fullscreenChartContainer.innerHTML = '';
            currentZoomedChartId = null;
        });
    }



    const chartsContainer = document.getElementById('chartsContainer');
    if (chartsContainer) {
        chartsContainer.addEventListener('click', (event) => {
            const canvas = event.target.closest('canvas');
            if (canvas && charts[canvas.id]) {
                if (typeof openFullscreenChart === 'function') {
                    openFullscreenChart(canvas.id);
                } else {
                    console.warn("WARN: openFullscreenChart() n'est pas définie.");
                }
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDashboardFullscreen);
    if (modal)    modal.addEventListener('click', (e) => { if (e.target === modal) closeDashboardFullscreen(); });

    // --- 1)  NEW SAFE-LOADER ----------------------------------------------------
    async function loadScenario(scenarioId) {
        const file = scenarioId === 1 ? '/json/scenario1.json' : '/json/scenario2.json';
        const res  = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${file}`);
        const json = await res.json();          // ← root is now an object
        return json.directive;                  // ← return the array we actually need
    }
    // ---------------------------------------------------------------------------

    // --- 2)  OLD PROMISE.ALL  (keep the rest of the code untouched) -------------
    try {
        [scenario1Data, scenario2Data] = await Promise.all([
            loadScenario(1).then(arr => ({ scenario: 1, directive: arr })),
            loadScenario(2).then(arr => ({ scenario: 2, directive: arr }))
        ]);

        console.log('✅ Scenarios re-mapped to legacy structure');
        populateDirectivesTable(scenario1TableBody, scenario1Data);
        populateDirectivesTable(scenario2TableBody, scenario2Data);
    } catch (e) {
        console.error('❌ Impossible de charger les scénarios :', e);
    }

    selectScenarioBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const scenarioId = parseInt(event.target.dataset.scenarioId);
            window.selectedScenarioId = scenarioId;
            currentScenario = scenarioId;

            if (scenarioId === 1) {
                window.selectedScenarioName = scenario1Data.directive.nom;
                window.selectedScenarioOverview = scenario1Data.directive.orientation;
                currentScenarioData = scenario1Data;
            } else if (scenarioId === 2) {
                window.selectedScenarioName = scenario2Data.directive.nom;
                window.selectedScenarioOverview = scenario2Data.directive.orientation;
                currentScenarioData = scenario2Data;
            } else {
                console.error("Scénario ID inconnu:", scenarioId);
                return;
            }
            window.selectedDirectiveId = null;
            window.selectedDirectiveDescription = '';
            if (typeof setScenarioSelectionState === 'function') {
                setScenarioSelectionState(scenarioId);
            } else {
                console.warn("WARN: setScenarioSelectionState() n'est pas définie.");
            }
            if (typeof updateLaunchButtonState === 'function') {
                updateLaunchButtonState();
            } else {
                console.warn("WARN: updateLaunchButtonState() n'est pas définie.");
            }
            if (typeof updateSimulatorInputsDisplay === 'function') {
                updateSimulatorInputsDisplay();
            } else {
                console.warn("WARN: updateSimulatorInputsDisplay() n'est pas définie.");
            }
            console.log(`Scénario ${scenarioId} sélectionné: ${window.selectedScenarioName}`);
        });
    });

    if (drawScenarioBtn) {
        drawScenarioBtn.addEventListener('click', () => {
            const randomScenarioId = Math.random() < 0.5 ? 1 : 2;
            const targetBtn = document.querySelector(`.select-scenario-btn[data-scenario-id="${randomScenarioId}"]`);
            if (targetBtn) targetBtn.click();
        });
    }

    if (drawDirectiveBtn) {
        drawDirectiveBtn.addEventListener('click', () => {
            const targetScenarioData = window.selectedScenarioId === 1 ? scenario1Data : window.selectedScenarioId === 2 ? scenario2Data : null;
            if (!targetScenarioData) {
                alert("Veuillez d'abord sélectionner un scénario.");
                return;
            }
            const availableDirectives = targetScenarioData.directive.amendements.filter(d => d.type === 'parlement' || d.type === 'conseil');
            if (availableDirectives.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableDirectives.length);
                const randomDirective = availableDirectives[randomIndex];
                if (typeof handleDirectiveSelection === 'function') {
                    handleDirectiveSelection(window.selectedScenarioId, randomDirective.id, randomDirective.description);
                } else {
                    console.warn("WARN: handleDirectiveSelection() n'est pas définie.");
                }
            } else {
                alert("Aucune directive disponible pour le tirage au sort dans le scénario sélectionné.");
            }
        });
    }

    if (launchSimulationBtn) {
        launchSimulationBtn.addEventListener('click', () => {
            if (window.selectedScenarioId === null || window.selectedDirectiveId === null) {
                alert("Veuillez sélectionner un scénario et une directive avant de lancer la simulation.");
                return;
            }

            launchSimulationBtn.classList.add('loading');
            launchSimulationBtn.disabled = true;
            document.body.style.overflow = 'hidden';

            if (typeof showTransitionPage === 'function') {
                showTransitionPage();
            }

            if (selectedScenarioElement) {
                selectedScenarioElement.textContent = `Scénario : ${window.selectedScenarioName || 'Non défini'}`;
            }
            if (selectedDirectiveElement) {
                selectedDirectiveElement.textContent = `Directive : ${window.selectedDirectiveDescription || 'Non définie'}`;
            }

            if (scenarioDescription && objectivesList) {
                if (window.selectedScenarioId === 1) {
                    scenarioDescription.textContent = `Vous allez participer à la négociation d'une directive européenne majeure visant à accélérer la transition énergétique tout en maintenant la compétitivité économique.`;
                    objectivesList.innerHTML = `
                    <li>Réduire les émissions de CO₂ d'au moins 55% d'ici 2030</li>
                    <li>Maintenir une croissance économique stable</li>
                    <li>Préserver la cohésion sociale entre les États membres</li>
                    <li>Assurer la sécurité énergétique de l'Union</li>
                    <li>Trouver un équilibre entre régulation et innovation</li>
                `;
                } else if (window.selectedScenarioId === 2) {
                    scenarioDescription.textContent = `Vous allez participer à la négociation d'une directive européenne majeure visant à renforcer la stabilité géopolitique et la sécurité de l'Union face aux nouveaux défis internationaux.`;
                    objectivesList.innerHTML = `
                    <li>Renforcer la position géopolitique de l'Union</li>
                    <li>Maintenir des relations diplomatiques stables</li>
                    <li>Assurer la sécurité intérieure face aux nouvelles menaces</li>
                    <li>Préserver les valeurs démocratiques européennes</li>
                    <li>Trouver un équilibre entre souveraineté et coopération</li>
                `;
                }
            }

            const loadingProgress = document.getElementById('loadingProgress');
            if (loadingProgress) {
                loadingProgress.style.width = '0%';
                setTimeout(() => { loadingProgress.style.width = '100%'; }, 200);
            }

            currentScenario = window.selectedScenarioId;
            currentScenarioData = window.selectedScenarioId === 1 ? scenario1Data : scenario2Data;

            setTimeout(() => {
                if (typeof showMainContent === 'function') {
                    showMainContent();
                }

                /* >>>>>>>  SYNCHRONISATION DES SLIDERS  <<<<<<< */
                buildSyncedInputs('dashboardControls',  currentScenario);
                buildSyncedInputs('fullscreenControls', currentScenario);

                setTimeout(() => {
                    if (typeof simulate === 'function') {
                        simulate();
                    }
                    if (simulateBtn) {
                        setTimeout(() => simulateBtn.click(), 100);
                    }
                }, 300);
                /* >>>>>>>  FIN SYNCHRONISATION  <<<<<<< */

                launchSimulationBtn.classList.remove('loading');
                launchSimulationBtn.disabled = false;
                document.body.style.overflow = 'auto';
                if (loadingProgress) loadingProgress.style.width = '0%';
            }, 1500);
        });
    }

    if (typeof updateCarousel === 'function') {
        updateCarousel(0);
    } else {
        console.warn("WARN: updateCarousel() n'est pas définie à l'initialisation.");
    }

    if (typeof setScenarioSelectionState === 'function') {
        setScenarioSelectionState(null);
    } else {
        console.warn("WARN: setScenarioSelectionState() n'est pas définie à l'initialisation.");
    }
    if (typeof updateLaunchButtonState === 'function') {
        updateLaunchButtonState();
    } else {
        console.warn("WARN: updateLaunchButtonState() n'est pas définie à l'initialisation.");
    }
    if (typeof showTab === 'function') {
        showTab("simulator-tab");
    } else {
        console.warn("WARN: showTab() n'est pas définie à l'initialisation.");
    }
});