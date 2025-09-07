import { DOMRefs } from '../state/index.js';

/**
 * Charge un seul composant HTML et l'injecte dans son conteneur.
 * @param {string} url - Le chemin vers le fichier HTML.
 * @param {string} containerId - L'ID de l'élément conteneur.
 */
async function loadComponent(url, containerId) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const html = await res.text();
        const target = document.getElementById(containerId);
        if (target) {
            target.innerHTML = html;
        }
    } catch (err) {
        console.error(`⚠️ Impossible de charger ${url}`, err);
    }
}

/**
 * Charge tous les composants HTML de l'interface principale.
 */
export async function loadAllComponents() {
    // Étape 1: Charger la structure principale et les composants autonomes
    await Promise.all([
        loadComponent('components/1_carousel.html', 'carouselContainer'),
        loadComponent('components/2_transition.html', 'transitionContainer'),
        loadComponent('components/3_main_interface.html', 'mainContent'), // Le hub
        loadComponent('components/4_dashboard.html', 'presentation'),
        loadComponent('components/5_fullscreen_modal.html', 'dashboardFullscreenModal')
    ]);

    // Étape 2: Charger le contenu des onglets dans les conteneurs créés par le hub
    // Pour l'instant, uniquement l'onglet du simulateur.
    await Promise.all([
        loadComponent('components/maininterface/simulator.html', 'simulator-tab'),
        loadComponent('components/maininterface/euro.html', 'euro-tab'),
        loadComponent('components/maininterface/objectives.html', 'simulation-tab')
    ]);

    // Gérer la visibilité initiale des conteneurs principaux
    const carouselContainer = document.getElementById('carouselContainer');
    const transitionContainer = document.getElementById('transitionContainer');
    const mainContent = document.getElementById('mainContent');

    if (carouselContainer) carouselContainer.style.display = 'flex';
    if (transitionContainer) transitionContainer.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
}

/**
 * Collecte toutes les références DOM importantes après le chargement des composants
 * et les stocke dans l'objet DOMRefs partagé.
 * @returns {object} L'objet DOMRefs rempli.
 */
export function collectAllDomReferences() {
    // On peuple l'objet DOMRefs importé depuis le state

    // --- Conteneurs principaux ---
    DOMRefs.carouselContainer = document.getElementById('carouselContainer');
    DOMRefs.transitionContainer = document.getElementById('transitionContainer');
    DOMRefs.mainContent = document.getElementById('mainScreen');
    DOMRefs.dashboardPanel = document.getElementById('dashboardContainer');
    DOMRefs.fullscreenModal = document.getElementById('dashboardFullscreenMode');

    // --- Module 1: Carrousel ---
    DOMRefs.carousel = document.getElementById('landing-carousel');
    DOMRefs.slides = document.querySelectorAll('.carousel-slide');
    DOMRefs.dots = document.querySelectorAll('.carousel-dot');
    DOMRefs.prevBtn = document.querySelector('.carousel-btn.prev');
    DOMRefs.nextBtn = document.querySelector('.carousel-btn.next');
    DOMRefs.launchSimulationBtn = document.getElementById('launchSimulationBtn');
    DOMRefs.selectScenarioBtns = document.querySelectorAll('.select-scenario-btn');
    DOMRefs.scenarioColumns = document.querySelectorAll('.scenario-column');
    DOMRefs.drawScenarioBtn = document.getElementById('drawScenarioBtn'); // AJOUT : Référence manquante
    DOMRefs.drawDirectiveBtn = document.getElementById('drawDirectiveBtn');
    DOMRefs.scenario1TableBody = document.querySelector('#scenario1Table tbody');
    DOMRefs.scenario2TableBody = document.querySelector('#scenario2Table tbody');
    DOMRefs.numParticipants = document.getElementById('numParticipants');
    DOMRefs.excelFile = document.getElementById('excelFile');
    DOMRefs.generateGroupsBtn = document.getElementById('generateGroupsBtn');
    DOMRefs.downloadCsvBtn = document.getElementById('downloadCsvBtn');
    DOMRefs.commissionMembers = document.getElementById('commissionMembers');
    DOMRefs.statesMembers = document.getElementById('statesMembers');
    DOMRefs.partiesMembers = document.getElementById('partiesMembers');
    DOMRefs.lobbiesMembers = document.getElementById('lobbiesMembers');

    // --- Module 2: Transition ---
    DOMRefs.loadingProgress = document.getElementById('loadingProgress');
    DOMRefs.selectedScenarioElement = document.getElementById('selected-scenario');
    DOMRefs.selectedDirectiveElement = document.getElementById('selected-directive');
    DOMRefs.scenarioDescription = document.querySelector('.scenario-description p');
    DOMRefs.objectivesList = document.querySelector('.objectives-list');

    // --- Module 3: Interface Principale, Simulateur & Dashboard ---
    DOMRefs.tabButtons = document.querySelectorAll('nav button[data-tab]');
    DOMRefs.tabContents = document.querySelectorAll('.tab-content');
    DOMRefs.simulateBtn = document.getElementById('simulButton');
    DOMRefs.partiSelect = document.getElementById('partiSelect');
    DOMRefs.dashboardCountrySelect = document.getElementById('countrySelect');
    DOMRefs.globalLobbySelectElement = document.getElementById('lobbySelect');
    DOMRefs.scenarioDisplayDiv = document.getElementById('scenario-display');
    DOMRefs.dashboardToggle = document.getElementById('dashboardToggle');
    DOMRefs.chartsContainer = document.getElementById('chartsContainer'); // Conteneur des graphiques pour le zoom
    DOMRefs.closeDashboardBtn = document.getElementById('closeDashboard');
    DOMRefs.dbSimulateBtn = document.getElementById('dbSimulateBtn');
    DOMRefs.dashboardFullscreenCloseBtn = document.getElementById('dashboardFullscreenCloseBtn');
    DOMRefs.fullscreenControls = document.getElementById('fullscreenControls');
    DOMRefs.dashboardFullscreenCanvas = document.getElementById('dashboardFullscreenCanvas');
    DOMRefs.clonedDashboardCharts = document.getElementById('clonedDashboardCharts'); // AJOUT : Référence manquante pour le dashboard

    // --- Module 3: Onglet Euro ---
    DOMRefs.euroSubNav = document.getElementById('euro-sub-nav');
    DOMRefs.histoireMenu = document.getElementById('histoire-menu');
    DOMRefs.histoirePhoto = document.getElementById('histoire-photo');
    DOMRefs.histoireText = document.getElementById('histoire-text');
    DOMRefs.institutionsMenu = document.getElementById('institutions-menu');
    DOMRefs.institutionsPhoto = document.getElementById('institutions-photo');
    DOMRefs.institutionsText = document.getElementById('institutions-text');
    DOMRefs.conseilMenu = document.getElementById('conseil-menu');
    DOMRefs.conseilPhoto = document.getElementById('conseil-photo');
    DOMRefs.conseilText = document.getElementById('conseil-text');
    DOMRefs.commissionMenu = document.getElementById('commission-menu');
    DOMRefs.commissionPhoto = document.getElementById('commission-photo');
    DOMRefs.commissionText = document.getElementById('commission-text');
    DOMRefs.conciliumMenu = document.getElementById('concilium-menu');
    DOMRefs.conciliumPhoto = document.getElementById('concilium-photo');
    DOMRefs.conciliumText = document.getElementById('concilium-text');
    DOMRefs.parlementMenu = document.getElementById('parlement-menu');
    DOMRefs.parlementPhoto = document.getElementById('parlement-photo');
    DOMRefs.parlementText = document.getElementById('parlement-text');
    DOMRefs.justiceMenu = document.getElementById('justice-menu');
    DOMRefs.justicePhoto = document.getElementById('justice-photo');
    DOMRefs.justiceText = document.getElementById('justice-text');
    DOMRefs.partisMenu = document.getElementById('partis-menu');
    DOMRefs.partisPhoto = document.getElementById('partis-photo');
    DOMRefs.partisText = document.getElementById('partis-text');
    DOMRefs.lobbiesMenu = document.getElementById('lobbies-menu');
    DOMRefs.lobbiesPhoto = document.getElementById('lobbies-photo');
    DOMRefs.lobbiesText = document.getElementById('lobbies-text');

    // --- Module 3: Onglet Objectifs ---
    DOMRefs.objectivesSubNav = document.getElementById('objectives-sub-nav');
    DOMRefs.comprehensionMenu = document.getElementById('comprehension-menu');
    DOMRefs.comprehensionPhoto = document.getElementById('comprehension-photo');
    DOMRefs.comprehensionText = document.getElementById('comprehension-text');

    console.table(Object.fromEntries(
        Object.entries(DOMRefs).map(([k, v]) => [k, v ? '✅' : '❌'])
    ));
    return DOMRefs;
}