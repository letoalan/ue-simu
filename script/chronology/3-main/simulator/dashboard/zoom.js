import { charts, simulationYears, currentScenario, profiles, partis, lobbies, DOMRefs } from '../../../../state/index.js';
import { simulate } from '../engine/index.js';
import { getNumericValue } from '../inputs.js';

let currentZoomedChartId = null;

export function openDashboardFullscreen(chartId) {
    console.log('🔍 openDashboardFullscreen appelée avec', chartId);

    const modal = document.getElementById('dashboardFullscreenMode');
    const canvas = document.getElementById('dashboardFullscreenCanvas');
    const ctrlBox = document.getElementById('fullscreenControls');

    if (!modal || !canvas || !ctrlBox) {
        console.error('❌ Modal, canvas ou contrôles introuvables');
        return;
    }

    const originalChart = charts[chartId];
    if (!originalChart) {
        console.error('❌ Graphique source absent');
        return;
    }

    currentZoomedChartId = chartId;

    /* 1. Nettoyage */
    ctrlBox.innerHTML = '';
    if (window._fullChart) {
        window._fullChart.destroy();
        window._fullChart = null;
    }

    /* 2. Construction des contrôles */
    buildFullscreenControls(ctrlBox, chartId);

    /* 3. Copie propre du graphique */
    try {
        window._fullChart = new Chart(canvas, {
            type: originalChart.config.type,
            data: JSON.parse(JSON.stringify(originalChart.data)),
            options: {
                ...originalChart.config.options,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    ...originalChart.config.options.plugins,
                    title: {
                        display: true,
                        text: getFullscreenTitle(chartId),
                        font: { size: 20, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { font: { size: 14 } }
                    }
                }
            }
        });
        console.log('✅ Zoom Chart créé pour', chartId);
    } catch (err) {
        console.error('💥 Erreur création zoom', err);
        return;
    }

    /* 4. Affichage */
    modal.style.display = 'flex';
    modal.style.zIndex = '9999';
    document.body.style.overflow = 'hidden';

    /* 5. Animation d'entrée */
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
}

function getFullscreenTitle(chartId) {
    switch (chartId) {
        case 'countryChart':
            const country = Object.values(profiles).find(p => p.code === window.currentCountryId);
            return `Évolution détaillée – ${country ? country.name : window.currentCountryId}`;
        case 'politiqueChart':
            return `Projections politiques détaillées – ${partis[window.currentParti]?.nom || window.currentParti}`;
        case 'lobbyChart':
            return `Analyse détaillée du lobby : ${lobbies[window.currentLobbyId]?.nom || window.currentLobbyId}`;
        case 'euChart':
            return `Vue détaillée des indicateurs européens - ${getScenarioDisplayName()}`;
        default:
            return `Vue détaillée - ${chartId}`;
    }
}

function getScenarioDisplayName() {
    return currentScenario === 1
        ? "Développement Durable"
        : "Stabilité Géopolitique";
}

function buildFullscreenControls(container, chartId) {
    console.log('🛠️ Construction des contrôles pour', chartId);

    // 1. Contrôles de paramètres
    buildParameterControls(container, chartId);

    // 2. Séparateur
    const separator = document.createElement('hr');
    separator.style.margin = '15px 0';
    separator.style.border = 'none';
    separator.style.borderTop = '1px solid #ddd';
    container.appendChild(separator);

    // 3. Sélecteur dynamique (si applicable)
    buildDynamicSelector(container, chartId);

    // 4. Séparateur
    const separator2 = document.createElement('hr');
    separator2.style.margin = '15px 0';
    separator2.style.border = 'none';
    separator2.style.borderTop = '1px solid #ddd';
    container.appendChild(separator2);

    // 5. Boutons d'action
    buildActionButtons(container, chartId);
}

function buildParameterControls(container, chartId) {
    const title = document.createElement('h3');
    title.textContent = 'Paramètres de simulation';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#1a237e';
    title.style.fontSize = '16px';
    container.appendChild(title);

    const isScenario1 = currentScenario === 1;
    const parameters = isScenario1
        ? [
            { id: 'pib_eu', label: 'PIB UE (%)', min: 0, max: 10, step: 0.1, defaultValue: 2.0 },
            { id: 'gini_eu', label: 'Indice Gini', min: 0.2, max: 0.6, step: 0.01, defaultValue: 0.3 },
            { id: 'co2_eu', label: 'CO₂/hab (t)', min: 2, max: 10, step: 0.1, defaultValue: 4.0 },
            { id: 'veb_eu', label: 'VEB (0-100)', min: 0, max: 100, step: 1, defaultValue: 80 }
        ]
        : [
            { id: 'normandie_eu', label: 'Stabilité Normandie', min: 0, max: 100, step: 1, defaultValue: 80 },
            { id: 'vdem_eu', label: 'Démocratie V-Dem', min: 0, max: 1, step: 0.01, defaultValue: 0.85 },
            { id: 'pib_growth_eu', label: 'Croissance (%)', min: -5, max: 10, step: 0.1, defaultValue: 1.5 },
            { id: 'idh_eu', label: 'IDH (0-1)', min: 0, max: 1, step: 0.01, defaultValue: 0.92 }
        ];

    parameters.forEach(param => {
        const controlGroup = document.createElement('div');
        controlGroup.style.marginBottom = '12px';

        const label = document.createElement('label');
        label.textContent = param.label;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '14px';
        label.style.color = '#333';

        const inputGroup = document.createElement('div');
        inputGroup.style.display = 'flex';
        inputGroup.style.alignItems = 'center';
        inputGroup.style.gap = '10px';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `fs_${param.id}`;
        input.min = param.min;
        input.max = param.max;
        input.step = param.step;
        input.value = getNumericValue(param.id, param.defaultValue);
        input.style.flex = '1';
        input.style.padding = '8px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.fontSize = '14px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = param.min;
        slider.max = param.max;
        slider.step = param.step;
        slider.value = input.value;
        slider.style.flex = '2';
        slider.style.height = '6px';
        slider.style.borderRadius = '3px';

        // Synchronisation input ↔ slider
        input.addEventListener('input', () => {
            slider.value = input.value;
            updateMainInput(param.id, parseFloat(input.value));
        });

        slider.addEventListener('input', () => {
            input.value = slider.value;
            updateMainInput(param.id, parseFloat(slider.value));
        });

        inputGroup.appendChild(input);
        inputGroup.appendChild(slider);
        controlGroup.appendChild(label);
        controlGroup.appendChild(inputGroup);
        container.appendChild(controlGroup);
    });
}

function updateMainInput(paramId, value) {
    const mainInput = document.getElementById(paramId);
    if (mainInput) {
        mainInput.value = value;
    }
}

function buildDynamicSelector(container, chartId) {
    const selectorConfig = getSelectorConfig(chartId);
    if (!selectorConfig) return;

    const title = document.createElement('h3');
    title.textContent = 'Sélection';
    title.style.margin = '15px 0 10px 0';
    title.style.color = '#1a237e';
    title.style.fontSize = '16px';
    container.appendChild(title);

    const select = document.createElement('select');
    select.id = 'fullscreenDynamicSelect';
    select.style.width = '100%';
    select.style.padding = '10px';
    select.style.border = '1px solid #ccc';
    select.style.borderRadius = '4px';
    select.style.fontSize = '14px';
    select.style.marginBottom = '15px';
    select.style.backgroundColor = '#fff';

    selectorConfig.data.forEach(item => {
        const option = document.createElement('option');
        option.value = selectorConfig.key ? item[selectorConfig.key] : item;
        option.textContent = selectorConfig.key ? item[selectorConfig.label] : selectorConfig.label(item);
        select.appendChild(option);
    });

    // Valeur par défaut
    select.value = getDefaultSelectorValue(chartId);

    select.addEventListener('change', (e) => {
        handleSelectorChange(chartId, e.target.value);
    });

    container.appendChild(select);
}

function getSelectorConfig(chartId) {
    switch (chartId) {
        case 'countryChart':
            return {
                data: Object.values(profiles),
                key: 'code',
                label: 'name'
            };
        case 'politiqueChart':
            return {
                data: Object.keys(partis),
                key: null,
                label: k => `${k} - ${partis[k].nom}`
            };
        case 'lobbyChart':
            return {
                data: Object.keys(lobbies),
                key: null,
                label: k => lobbies[k].nom
            };
        default:
            return null;
    }
}

function getDefaultSelectorValue(chartId) {
    switch (chartId) {
        case 'countryChart': return window.currentCountryId || 'DE';
        case 'politiqueChart': return window.currentParti || 'PPE';
        case 'lobbyChart': return window.currentLobbyId || 'BIG_TECH';
        default: return '';
    }
}

function handleSelectorChange(chartId, value) {
    console.log(`🔄 Sélecteur changé pour ${chartId}:`, value);

    switch (chartId) {
        case 'countryChart':
            window.currentCountryId = value;
            break;
        case 'politiqueChart':
            window.currentParti = value;
            break;
        case 'lobbyChart':
            window.currentLobbyId = value;
            break;
    }

    // Relancer la simulation pour mettre à jour les données
    runFullscreenSimulation();
}

function buildActionButtons(container, chartId) {
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.gap = '10px';
    buttonGroup.style.marginTop = '15px';

    // Bouton Simuler
    const simulateBtn = createButton('🔄 Simuler', 'primary', () => {
        runFullscreenSimulation();
    });

    // Bouton Actualiser
    const refreshBtn = createButton('🔄 Actualiser', 'secondary', () => {
        refreshFullscreenChart();
    });

    // Bouton Fermer
    const closeBtn = createButton('❌ Fermer', 'danger', () => {
        closeDashboardFullscreen();
    });

    buttonGroup.appendChild(simulateBtn);
    buttonGroup.appendChild(refreshBtn);
    buttonGroup.appendChild(closeBtn);
    container.appendChild(buttonGroup);
}

function createButton(text, type, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '10px 15px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.flex = '1';
    button.style.transition = 'all 0.2s ease';

    switch (type) {
        case 'primary':
            button.style.backgroundColor = '#1976d2';
            button.style.color = 'white';
            break;
        case 'secondary':
            button.style.backgroundColor = '#f5f5f5';
            button.style.color = '#333';
            button.style.border = '1px solid #ddd';
            break;
        case 'danger':
            button.style.backgroundColor = '#d32f2f';
            button.style.color = 'white';
            break;
    }

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-1px)';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });

    button.addEventListener('click', onClick);

    return button;
}

export function runFullscreenSimulation() {
    console.log('🎯 Lancement de la simulation en mode plein écran');

    // Lire les valeurs des inputs du mode plein écran
    const scenario = currentScenario;
    const inputs = {};

    if (scenario === 1) {
        inputs.pib_eu = parseFloat(document.getElementById('fs_pib_eu').value) || 0;
        inputs.gini_eu = parseFloat(document.getElementById('fs_gini_eu').value) || 0;
        inputs.co2_eu = parseFloat(document.getElementById('fs_co2_eu').value) || 0;
        inputs.veb_eu = parseFloat(document.getElementById('fs_veb_eu').value) || 0;
    } else {
        inputs.normandie_eu = parseFloat(document.getElementById('fs_normandie_eu').value) || 0;
        inputs.vdem_eu = parseFloat(document.getElementById('fs_vdem_eu').value) || 0;
        inputs.pib_growth_eu = parseFloat(document.getElementById('fs_pib_growth_eu').value) || 0;
        inputs.idh_eu = parseFloat(document.getElementById('fs_idh_eu').value) || 0;
    }

    // Mettre à jour les inputs principaux
    Object.entries(inputs).forEach(([key, value]) => {
        const mainInput = document.getElementById(key);
        if (mainInput) {
            mainInput.value = value;
        }
    });

    // Lancer la simulation
    simulate();

    // Mettre à jour le graphique plein écran après un court délai
    setTimeout(() => {
        refreshFullscreenChart();
    }, 100);
}

function refreshFullscreenChart() {
    if (!currentZoomedChartId || !window._fullChart || !charts[currentZoomedChartId]) {
        return;
    }

    console.log('🔄 Actualisation du graphique plein écran:', currentZoomedChartId);

    try {
        window._fullChart.data = JSON.parse(JSON.stringify(charts[currentZoomedChartId].data));
        window._fullChart.options.plugins.title.text = getFullscreenTitle(currentZoomedChartId);
        window._fullChart.update();
        console.log('✅ Graphique actualisé');
    } catch (error) {
        console.error('❌ Erreur lors de l\'actualisation:', error);
    }
}

export function closeDashboardFullscreen() {
    console.log('🚪 Fermeture du mode plein écran');

    const modal = document.getElementById('dashboardFullscreenMode');
    if (!modal) return;

    // Animation de sortie
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.95)';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        if (window._fullChart) {
            window._fullChart.destroy();
            window._fullChart = null;
        }

        currentZoomedChartId = null;
        console.log('✅ Mode plein écran fermé');
    }, 300);
}

// Gestion de la fermeture par la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('dashboardFullscreenMode');
        if (modal && modal.style.display === 'flex') {
            closeDashboardFullscreen();
        }
    }
});

// Gestion du clic en dehors du modal pour fermer
document.addEventListener('click', (e) => {
    const modal = document.getElementById('dashboardFullscreenMode');
    if (modal && modal.style.display === 'flex' && e.target === modal) {
        closeDashboardFullscreen();
    }
});

console.log('✅ Module zoom.js chargé');