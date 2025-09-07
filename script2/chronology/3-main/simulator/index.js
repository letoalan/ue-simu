import { AppState, euStatesData, partis as partisData, lobbies as lobbiesData, profiles, simulationYears } from '../../../state/index.js';
import { buildInputs, setupInputSynchronization } from './inputs.js';
import { runFullSimulation, simulateCountry } from './engine/index.js';
import { createLobbyChart, plotCountry, plotPolitique, showScore, plotEU } from './charts/index.js';

/**
 * Initialise le module du simulateur.
 * @param {object} DOMRefs - Les références DOM collectées globalement.
 */
export function init(DOMRefs) {
    console.log("Initialisation du module Simulateur.");

    // Construire les inputs
    buildInputs();
    setupInputSynchronization();

    // Configurer les événements
    setupSimulatorEvents(DOMRefs);

    // Peupler les sélecteurs
    populateSelectors(DOMRefs);
}

function setupSimulatorEvents(DOMRefs) {
    // Bouton de simulation
    if (DOMRefs.simulateBtn) {
        DOMRefs.simulateBtn.addEventListener('click', runSimulationAndUpdateUI);
    }

    // Sélecteur de pays
    if (DOMRefs.dashboardCountrySelect) {
        DOMRefs.dashboardCountrySelect.addEventListener('change', e => {
            AppState.selectCountry(e.target.value);
            runSimulationAndUpdateUI(); // Relancer une simulation complète pour mettre à jour le pays
        });
    }

    // Sélecteur de parti
    if (DOMRefs.partiSelect) {
        DOMRefs.partiSelect.addEventListener('change', () => {
            AppState.selectParty(DOMRefs.partiSelect.value);
            updatePolitiqueUI(); // Met à jour juste l'UI politique, pas besoin de resimuler
        });
    }

    // Sélecteur de lobby
    if (DOMRefs.globalLobbySelectElement) {
        DOMRefs.globalLobbySelectElement.addEventListener('change', (e) => {
            AppState.selectLobby(e.target.value);
            createLobbyChart(); // Met à jour juste le graphique des lobbies
        });
    }
}

/**
 * Orchestrator function that runs the simulation and updates all UI elements.
 */
function runSimulationAndUpdateUI() {
    console.log("UI Controller: Lancement de la simulation et mise à jour des graphiques.");

    // 1. Run the simulation engine to get all calculated data
    const simulationResults = runFullSimulation();

    if (!simulationResults) {
        console.error("La simulation a échoué. La mise à jour de l'UI est annulée.");
        return;
    }

    const { euData, localStatsUE } = simulationResults;

    // 2. Update all charts and UI elements with the new data
    plotEU(simulationYears, euData, AppState.currentScenarioId);
    showScore(euData.satisArr, "succes");

    updatePolitiqueUI(); // This function already calls plotPolitique
    createLobbyChart();
    updateCountryChartForSelectedCountry(localStatsUE);

    console.log("UI Controller: Mise à jour des graphiques terminée.");
}

function populateSelectors(DOMRefs) {
    populateCountrySelect(DOMRefs.dashboardCountrySelect);
    populatePartiSelect(DOMRefs.partiSelect);
    populateLobbySelect(DOMRefs.globalLobbySelectElement);
}

function populateCountrySelect(selectElement) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    euStatesData.forEach(country => {
        const opt = document.createElement('option');
        opt.value = country.code;
        opt.textContent = country.name;
        selectElement.appendChild(opt);
    });

    selectElement.value = AppState.currentCountryId;
}

function populatePartiSelect(selectElement) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    Object.entries(partisData).forEach(([key, value]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = value.nom;
        selectElement.appendChild(opt);
    });

    selectElement.value = AppState.currentPartyId;
}

function populateLobbySelect(selectElement) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    Object.entries(lobbiesData).forEach(([key, value]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = value.nom;
        selectElement.appendChild(opt);
    });

    selectElement.value = AppState.currentLobbyId;
}

function updateCountryChartForSelectedCountry(statsUE) {
    const countryProfile = profiles[AppState.currentCountryId];
    if (!countryProfile) {
        console.error(`Profil de pays non trouvé pour ${AppState.currentCountryId}`);
        return;
    }

    if (!statsUE) {
        console.warn("statsUE non fourni à updateCountryChartForSelectedCountry. Le graphique ne sera pas mis à jour.");
        return;
    }

    const euInputsForCountry = AppState.currentScenarioId === 1
        ? { pib: statsUE.pibArr[0], gini: statsUE.giniArr[0], co2: statsUE.co2Arr[0], veb: statsUE.vebArr[0] }
        : { normandie: statsUE.stabArr[0], vdem: statsUE.demArr[0], pib: statsUE.pibArr[0], idh: statsUE.idhArr[0] };

    const countryData = simulateCountry(countryProfile, euInputsForCountry, AppState.currentScenarioId);
    plotCountry(simulationYears, countryData, countryProfile, AppState.currentScenarioId);
    showScore(countryData.satisArr, "succesCountry");
}

function updatePolitiqueUI() {
    const parti = partisData[AppState.currentPartyId];
    if (!parti || !parti.satisfactionArr || parti.mepsArr.length < 10) {
        console.warn(`Données pour le parti ${AppState.currentPartyId} non disponibles.`);
        return;
    }

    document.getElementById('partiSatisfaction').textContent = `${Math.round(parti.satisfaction)}%`;
    document.getElementById('partiMEPs').textContent = `${parti.mepsArr[4]} → ${parti.mepsArr[9]}`;
    document.getElementById('partiConseil').textContent = `${parti.conseilArr[4]}% → ${parti.conseilArr[9]}%`;
    document.getElementById('partiCommissaires').textContent = `${parti.commissairesArr[4]} → ${parti.commissairesArr[9]}`;
    document.getElementById('partiPresidence').textContent = `${Math.round(parti.presArr[4])}% → ${Math.round(parti.presArr[9])}%`;
    document.getElementById('scoreVictoire').innerHTML = `<b>Score de victoire du parti :</b> ${parti.victoire} / 100`;

    plotPolitique(simulationYears, parti);
}