import { DOMRefs, currentScenario, scenario1Data, scenario2Data, statsUE } from '../../../../state/index.js';
import { cloneCharts, closeDashboardFullscreen } from '../charts/clone.js';
import { setupInputSynchronization, updateSimulatorInputsDisplay } from '../inputs.js';
import { simulate } from '../engine/index.js';

export function toggleDashboard() {
    console.log("DEBUG: toggleDashboard() appelée");

    const dashboardPanel = document.getElementById('dashboardContainer');
    if (!dashboardPanel) {
        console.error("ERREUR: Élément 'dashboardContainer' non trouvé");
        return;
    }

    const isOpening = !dashboardPanel.classList.contains('open');
    dashboardPanel.classList.toggle('open');
    document.body.classList.toggle('dashboard-locked', isOpening);

    if (isOpening) {
        // Logique d'ouverture
        document.body.style.overflow = 'hidden';
        setupDashboardMode();
        cloneCharts();
        console.log("DEBUG: Dashboard ouvert");
    } else {
        // Logique de fermeture
        document.body.style.overflow = 'auto';
        console.log("DEBUG: Dashboard fermé");
    }
}

export function setupDashboardMode() {
    console.log("DEBUG-DASHBOARD-SETUP: Configuration du dashboard pour le scénario", currentScenario);

    const currentScenarioData = currentScenario === 1 ? scenario1Data : scenario2Data;

    if (!currentScenarioData || !currentScenarioData.directive) {
        console.error("ERREUR-DASHBOARD-SETUP: Données du scénario manquantes");
        return;
    }

    // Mettre à jour le titre du dashboard
    const dashboardTitle = document.getElementById('dashboardScenarioDisplay');
    if (dashboardTitle) {
        dashboardTitle.textContent = getScenarioDisplayName(currentScenario);
    }

    // Mettre à jour les paramètres du dashboard
    updateDashboardParams(currentScenario, currentScenarioData, statsUE);

    // Mettre à jour l'affichage des inputs du simulateur principal
    updateSimulatorInputsDisplay();

    // Configurer la synchronisation des inputs
    setupInputSynchronization();

    console.log("LOG-DASHBOARD-SETUP: Configuration terminée");
}

function getScenarioDisplayName(scenarioId) {
    return scenarioId === 1
        ? "Développement Durable et Cohésion Sociale"
        : "Stabilité Géopolitique et Croissance Économique";
}

export function updateDashboardParams(scenarioId, scenarioData, statsUEData = null) {
    console.log("DEBUG-DASHBOARD-PARAMS: Mise à jour des paramètres pour le scénario", scenarioId);

    const isPostSimulation = statsUEData && statsUEData.pibArr && statsUEData.pibArr.length > 0;
    const effectiveStats = getEffectiveStats(scenarioId, scenarioData, statsUEData, isPostSimulation);

    // Mettre à jour les libellés et valeurs
    updateDashboardLabelsAndValues(scenarioId, effectiveStats);

    console.log("LOG-DASHBOARD-PARAMS: Paramètres mis à jour");
}

function getEffectiveStats(scenarioId, scenarioData, statsUEData, isPostSimulation) {
    if (isPostSimulation) {
        return getPostSimulationStats(scenarioId, statsUEData);
    } else {
        return getInitialStats(scenarioId, scenarioData);
    }
}

function getPostSimulationStats(scenarioId, statsUEData) {
    const getLast = (arr) => (arr && arr.length > 0) ? arr[arr.length - 1] : undefined;

    if (scenarioId === 1) {
        return {
            pib: getLast(statsUEData.pibArr),
            gini: getLast(statsUEData.giniArr),
            co2: getLast(statsUEData.co2Arr),
            veb: getLast(statsUEData.vebArr),
            normandie: getLast(statsUEData.stabArr),
            vdem: getLast(statsUEData.demArr),
            pib_growth: getLast(statsUEData.pibArr),
            idh: getLast(statsUEData.idhArr)
        };
    } else {
        return {
            pib: getLast(statsUEData.pibArr),
            gini: getLast(statsUEData.giniArr),
            co2: getLast(statsUEData.co2Arr),
            veb: getLast(statsUEData.vebArr),
            normandie: getLast(statsUEData.stabArr),
            vdem: getLast(statsUEData.demArr),
            pib_growth: getLast(statsUEData.pibArr),
            idh: getLast(statsUEData.idhArr)
        };
    }
}

function getInitialStats(scenarioId, scenarioData) {
    const startStats = scenarioData.directive?.statistiques_depart || {};

    if (scenarioId === 1) {
        return {
            pib: startStats.pib_eu,
            gini: startStats.gini_eu,
            co2: startStats.co2_eu,
            veb: startStats.veb_eu,
            normandie: 80, // Valeur par défaut
            vdem: 0.85,   // Valeur par défaut
            pib_growth: 1.5, // Valeur par défaut
            idh: 0.92     // Valeur par défaut
        };
    } else {
        return {
            pib: 2.0,     // Valeur par défaut
            gini: 0.3,    // Valeur par défaut
            co2: 4.0,     // Valeur par défaut
            veb: 80,      // Valeur par défaut
            normandie: startStats.normandie_eu,
            vdem: startStats.vdem_eu,
            pib_growth: startStats.pib_growth_eu,
            idh: startStats.idh_eu
        };
    }
}

function updateDashboardLabelsAndValues(scenarioId, effectiveStats) {
    const updateInputLabel = (labelId, text) => {
        const element = document.getElementById(labelId);
        if (element) element.textContent = text;
    };

    const updateInput = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.value = (value !== undefined && value !== null) ? value : '';
    };

    if (scenarioId === 1) {
        // Scénario 1: Développement Durable
        updateInputLabel('param1InputLabel', 'PIB (%):');
        updateInputLabel('param2InputLabel', 'Gini:');
        updateInputLabel('param3InputLabel', 'CO₂ (t):');
        updateInputLabel('param4InputLabel', 'VEB:');

        updateInput('param1Input', effectiveStats.pib);
        updateInput('param2Input', effectiveStats.gini);
        updateInput('param3Input', effectiveStats.co2);
        updateInput('param4Input', effectiveStats.veb);
    } else {
        // Scénario 2: Géopolitique
        updateInputLabel('param1InputLabel', 'Normandie:');
        updateInputLabel('param2InputLabel', 'V-Dem:');
        updateInputLabel('param3InputLabel', 'Croissance (%):');
        updateInputLabel('param4InputLabel', 'IDH:');

        updateInput('param1Input', effectiveStats.normandie);
        updateInput('param2Input', effectiveStats.vdem);
        updateInput('param3Input', effectiveStats.pib_growth);
        updateInput('param4Input', effectiveStats.idh);
    }
}

// Gestion des événements du dashboard
export function setupDashboardEvents() {
    console.log("DEBUG-DASHBOARD-EVENTS: Configuration des événements");

    // Bouton de simulation du dashboard
    const dbSimulateBtn = document.getElementById('dbSimulateBtn');
    if (dbSimulateBtn) {
        dbSimulateBtn.addEventListener('click', handleDashboardSimulation);
    }

    // Bouton de fermeture du dashboard
    const closeDashboardBtn = document.getElementById('closeDashboardBtn');
    if (closeDashboardBtn) {
        closeDashboardBtn.addEventListener('click', () => toggleDashboard());
    }

    // Bouton de fermeture du mode plein écran
    const dashboardFullscreenCloseBtn = document.getElementById('dashboardFullscreenCloseBtn');
    if (dashboardFullscreenCloseBtn) {
        dashboardFullscreenCloseBtn.addEventListener('click', closeDashboardFullscreen);
    }

    console.log("LOG-DASHBOARD-EVENTS: Événements configurés");
}

function handleDashboardSimulation() {
    console.log("DEBUG-DASHBOARD-SIM: Lancement de la simulation depuis le dashboard");

    const dbSimulateBtn = document.getElementById('dbSimulateBtn');
    if (dbSimulateBtn) {
        // Effet visuel de clic
        dbSimulateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            dbSimulateBtn.style.transform = '';
        }, 150);
    }

    // Lancer la simulation
    simulate();

    // Mettre à jour les graphiques clonés
    setTimeout(() => {
        if (typeof cloneCharts === 'function') {
            cloneCharts();
        }
    }, 100);

    console.log("LOG-DASHBOARD-SIM: Simulation terminée");
}

// Fonction pour lire les valeurs actuelles du dashboard
export function readDashboardInputs() {
    const scenario = currentScenario;

    if (scenario === 1) {
        return {
            pib_eu: parseFloat(document.getElementById('param1Input').value) || 0,
            gini_eu: parseFloat(document.getElementById('param2Input').value) || 0,
            co2_eu: parseFloat(document.getElementById('param3Input').value) || 0,
            veb_eu: parseFloat(document.getElementById('param4Input').value) || 0
        };
    } else {
        return {
            normandie_eu: parseFloat(document.getElementById('param1Input').value) || 0,
            vdem_eu: parseFloat(document.getElementById('param2Input').value) || 0,
            pib_growth_eu: parseFloat(document.getElementById('param3Input').value) || 0,
            idh_eu: parseFloat(document.getElementById('param4Input').value) || 0
        };
    }
}

// Fonction pour basculer la visibilité du dashboard
export function setDashboardVisibility(visible) {
    const dashboardPanel = document.getElementById('dashboardContainer');
    if (!dashboardPanel) return;

    if (visible) {
        dashboardPanel.classList.add('open');
        document.body.classList.add('dashboard-locked');
        document.body.style.overflow = 'hidden';
        setupDashboardMode();
        cloneCharts();
    } else {
        dashboardPanel.classList.remove('open');
        document.body.classList.remove('dashboard-locked');
        document.body.style.overflow = 'auto';
    }
}

// Export des fonctions principales
export { toggleDashboard, setupDashboardMode, setupDashboardEvents };

// Initialisation lors du chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG-DASHBOARD-INIT: Initialisation du module dashboard");
    setupDashboardEvents();
});