import { AppState } from '../../../state/index.js';

export function buildInputs() {
    console.log("Construction des inputs du simulateur");
    // Cette fonction est conservée pour la structure, mais la logique de mise à jour
    // de l'affichage est maintenant appelée depuis un module parent (3-main/index.js)
    // pour un meilleur contrôle du flux d'initialisation.
}

export function setupInputSynchronization() {
    console.log("Configuration de la synchronisation des inputs");

    const scenario = AppState.currentScenarioId;
    const mainSimulatorKeys = scenario === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const dashboardInputIds = ['param1Input', 'param2Input', 'param3Input', 'param4Input'];

    dashboardInputIds.forEach((dashboardId, index) => {
        const mainId = mainSimulatorKeys[index];
        const dashboardInput = document.getElementById(dashboardId);
        const mainInput = document.getElementById(mainId);

        if (!dashboardInput || !mainInput) return;

        // Synchronisation Dashboard -> Simulateur Principal
        dashboardInput.addEventListener('input', () => {
            mainInput.value = dashboardInput.value;
        });

        // Synchronisation Simulateur Principal -> Dashboard
        mainInput.addEventListener('input', () => {
            dashboardInput.value = mainInput.value;
        });
    });
}

export function syncSingleKey(key, value, excludeContainerId) {
    // Synchroniser avec les autres conteneurs
    ['dashboardControls', 'fullscreenControls'].forEach(id => {
        if (id === excludeContainerId) return;
        const targetInput = document.getElementById(`${id}_${key}`);
        if (targetInput && parseFloat(targetInput.value) !== value) {
            targetInput.value = value;
        }
    });

    // Synchroniser avec les inputs principaux du dashboard
    const mainSimulatorKeys = AppState.currentScenarioId === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const keyIndex = mainSimulatorKeys.indexOf(key);
    if (keyIndex !== -1) {
        const dashboardParamId = `param${keyIndex + 1}Input`;
        const dashboardParamInput = document.getElementById(dashboardParamId);
        if (dashboardParamInput && parseFloat(dashboardParamInput.value) !== value) {
            dashboardParamInput.value = value;
        }
    }
}

export function updateSimulatorInputsDisplay() {
    const scenario = AppState.currentScenarioId;
    const scenario1ParamsDiv = document.getElementById('scenario1');
    const scenario2ParamsDiv = document.getElementById('scenario2');
    const scenarioDisplayDiv = document.getElementById('scenario-display');

    if (!scenario1ParamsDiv || !scenario2ParamsDiv || !scenarioDisplayDiv) return;

    if (scenario === 1) {
        scenario1ParamsDiv.style.display = 'block';
        scenario2ParamsDiv.style.display = 'none';
        scenarioDisplayDiv.textContent = `Scénario choisi : ${AppState.currentScenarioName || 'Développement Durable et Cohésion Sociale'}`;
        updateChartLabels(1);
    } else {
        scenario1ParamsDiv.style.display = 'none';
        scenario2ParamsDiv.style.display = 'block';
        scenarioDisplayDiv.textContent = `Scénario choisi : ${AppState.currentScenarioName || 'Stabilité Géopolitique et Croissance Économique'}`;
        updateChartLabels(2);
    }
}

function updateChartLabels(scenarioId) {
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
    const currentScenarioDataRef = AppState.currentScenarioData;

    // Mettre à jour les labels et valeurs
    Object.entries(currentInputLabels).forEach(([id, label]) => {
        const labelElement = document.querySelector(`label[for="${id}"]`);
        const inputElement = document.getElementById(id);

        if (labelElement && inputElement) {
            const tooltipSpan = labelElement.querySelector('.tooltiptext');
            const tooltipContent = tooltipSpan ? `<span class="tooltiptext">${tooltipSpan.innerHTML}</span>` : '';
            labelElement.innerHTML = `${label}${tooltipContent}`;

            const startStats = currentScenarioDataRef?.directive?.[0]?.statistiques_depart;
            if (startStats?.[id] !== undefined) {
                inputElement.value = startStats[id];
            }
        }
    });
}

export function getNumericValue(id, defaultValue) {
    const element = document.getElementById(id);
    if (element) {
        const value = parseFloat(element.value);
        return isNaN(value) ? defaultValue : value;
    }
    return defaultValue;
}

export function normalize(value, min, max) {
    if (max === min) return 0.5;
    return (value - min) / (max - min);
}