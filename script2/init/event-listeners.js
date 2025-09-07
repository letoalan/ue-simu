import { AppState, DOMRefs, ChartInstances, chartIdsToClone, euStatesData, partis, lobbies } from '../state/index.js';
import { startTransition } from '../chronology/2-transition/index.js';
import { init as initMainInterface } from '../chronology/3-main/index.js';

/**
 * Attache les écouteurs d'événements globaux ou qui coordonnent plusieurs modules.
 * @param {object} DOMRefs - L'objet contenant les références DOM.
 */
export function attachGlobalEventListeners(DOMRefs) {
    // --- Lancement de la simulation principale ---
    if (DOMRefs.launchSimulationBtn) {
        DOMRefs.launchSimulationBtn.addEventListener('click', async () => {
            if (AppState.currentScenarioId === null || AppState.selectedDirectiveId === null) {
                alert('Veuillez sélectionner un scénario et une directive.');
                return;
            }
            console.log("Lancement de la simulation...");
            await startTransition(2000); // Durée de 2 secondes
            if (DOMRefs.carouselContainer) DOMRefs.carouselContainer.style.display = 'none';

            // CORRECTIF : Le conteneur parent (#mainContent de index.html) doit aussi être rendu visible.
            const mainContentWrapper = document.getElementById('mainContent');
            if (mainContentWrapper) {
                mainContentWrapper.style.display = 'block';
            }

            if (DOMRefs.mainContent) {
                DOMRefs.mainContent.style.display = 'block';
                document.body.style.overflow = 'auto';
            }
            initMainInterface(DOMRefs);
            console.log("Interface principale initialisée.");
        });
    }

    // --- Tableau de bord (Dashboard) ---
    if (DOMRefs.dashboardToggle) {
        DOMRefs.dashboardToggle.addEventListener('click', () => toggleDashboard(true, DOMRefs));
    }
    if (DOMRefs.closeDashboardBtn) {
        DOMRefs.closeDashboardBtn.addEventListener('click', () => toggleDashboard(false, DOMRefs));
    }
    if (DOMRefs.dbSimulateBtn) {
        DOMRefs.dbSimulateBtn.addEventListener('click', () => {
            // On délègue l'action au bouton de simulation principal, qui contient toute la logique.
            if (DOMRefs.simulateBtn) {
                DOMRefs.simulateBtn.click();
            }
            // Une fois la simulation principale terminée et les graphiques mis à jour, on clone les nouvelles versions.
            cloneCharts(DOMRefs);
        });
    }

    // --- Mode Plein Écran (Fullscreen) ---
    if (DOMRefs.chartsContainer) {
        DOMRefs.chartsContainer.addEventListener('click', (e) => {
            const chartWrapper = e.target.closest('.canvas-container');
            if (chartWrapper) {
                const canvas = chartWrapper.querySelector('canvas');
                if (canvas && canvas.id) {
                    openFullscreen(canvas.id, DOMRefs);
                }
            }
        });
    }
    if (DOMRefs.dashboardFullscreenCloseBtn) {
        DOMRefs.dashboardFullscreenCloseBtn.addEventListener('click', () => closeFullscreen(DOMRefs));
    }
}

// --- Fonctions de gestion de l'UI (internes à ce module) ---

function toggleDashboard(show, DOMRefs) {
    if (!DOMRefs.dashboardPanel) return;
    console.log(`Tableau de bord: ${show ? 'ouverture' : 'fermeture'}`);
    DOMRefs.dashboardPanel.classList.toggle('open', show);
    document.body.classList.toggle('dashboard-locked', show);
    document.body.style.overflow = show ? 'hidden' : 'auto';

    if (show) {
        updateDashboardParams(DOMRefs);
        cloneCharts(DOMRefs);
    }
}

function openFullscreen(chartId, DOMRefs) {
    if (!DOMRefs.fullscreenModal || !DOMRefs.dashboardFullscreenCanvas || !DOMRefs.fullscreenControls) return;
    const originalChart = ChartInstances[chartId];
    if (!originalChart) {
        console.error(`Graphique source '${chartId}' non trouvé pour le mode plein écran.`);
        return;
    }

    console.log(`Ouverture du plein écran pour le graphique: ${chartId}`);
    DOMRefs.fullscreenModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // 1. Cloner le graphique dans le canvas du modal
    const fullscreenCanvas = DOMRefs.dashboardFullscreenCanvas;
    if (window._fullChart) window._fullChart.destroy();
    window._fullChart = new Chart(fullscreenCanvas, {
        type: originalChart.config.type,
        data: JSON.parse(JSON.stringify(originalChart.config.data)),
        options: {
            ...originalChart.config.options,
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    // 2. Nettoyer et préparer le conteneur des contrôles
    const controlsContainer = DOMRefs.fullscreenControls;
    controlsContainer.innerHTML = ''; // Nettoyer les anciens contrôles

    let selectorConfig;
    if (chartId === 'countryChart') selectorConfig = { data: euStatesData, key: 'code', label: 'name', stateKey: 'currentCountryId', setter: AppState.selectCountry };
    if (chartId === 'politiqueChart') selectorConfig = { data: Object.keys(partis), stateKey: 'currentPartyId', setter: AppState.selectParty };
    if (chartId === 'lobbyChart') selectorConfig = { data: Object.keys(lobbies), labelKey: 'nom', stateKey: 'currentLobbyId', setter: AppState.selectLobby };

    // 2a. Ajouter le sélecteur (pays/parti/lobby) s'il y a lieu
    if (selectorConfig) {
        const sel = document.createElement('select');
        sel.className = 'sim-selector fullscreen-selector';

        selectorConfig.data.forEach(item => {
            const opt = document.createElement('option');
            const value = selectorConfig.key ? item[selectorConfig.key] : item;
            const text = selectorConfig.labelKey ? lobbies[item][selectorConfig.labelKey] : (selectorConfig.label ? item[selectorConfig.label] : item);
            opt.value = value;
            opt.textContent = text;
            sel.appendChild(opt);
        });

        sel.value = AppState[selectorConfig.stateKey];

        sel.onchange = (e) => {
            // Mettre à jour l'état
            selectorConfig.setter(e.target.value);

            // Relancer la simulation principale pour mettre à jour les données de base
            if (DOMRefs.simulateBtn) {
                DOMRefs.simulateBtn.click();
            }

            // Mettre à jour le graphique en plein écran avec les nouvelles données
            setTimeout(() => {
                const updatedOriginalChart = ChartInstances[chartId];
                if (window._fullChart && updatedOriginalChart) {
                    window._fullChart.data = JSON.parse(JSON.stringify(updatedOriginalChart.data));
                    window._fullChart.options.plugins.title.text = updatedOriginalChart.options.plugins.title.text;
                    window._fullChart.update();
                }

                // AJOUT : Mettre à jour le dashboard s'il est ouvert
                if (DOMRefs.dashboardPanel && DOMRefs.dashboardPanel.classList.contains('open')) {
                    console.log("Dashboard est ouvert, mise à jour suite au changement de sélecteur.");
                    updateDashboardParams(DOMRefs);
                    cloneCharts(DOMRefs);
                }
            }, 100); // Léger délai pour laisser le temps au thread principal de finir la simulation
        };

        controlsContainer.appendChild(sel);
    }

    // 2b. Ajouter les 4 inputs de simulation principaux
    const simKeys = AppState.currentScenarioId === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    simKeys.forEach(key => {
        const mainInput = document.getElementById(key);
        if (!mainInput) return;

        const label = document.createElement('label');
        const mainLabel = document.querySelector(`label[for="${key}"]`);
        // Récupère le label principal pour la cohérence (ex: "PIB UE (croissance % initiale):")
        label.textContent = mainLabel ? mainLabel.textContent.split(':')[0] + ':' : key + ':';
        label.className = 'fullscreen-input-label';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `fs_${key}`; // préfixe "fs" pour fullscreen
        input.value = mainInput.value;
        input.step = mainInput.step || '0.1';
        input.min = mainInput.min || '0';
        input.max = mainInput.max || '100';
        input.className = 'fullscreen-input';

        label.appendChild(input);
        controlsContainer.appendChild(label);
    });

    // 2c. Ajouter le bouton "Simuler"
    const simBtn = document.createElement('button');
    simBtn.textContent = 'Relancer la simulation';
    simBtn.className = 'fullscreen-simulate-btn';
    simBtn.onclick = () => {
        // Mettre à jour les inputs principaux avec les valeurs du zoom
        simKeys.forEach(key => {
            const fsInput = document.getElementById(`fs_${key}`);
            const mainInput = document.getElementById(key);
            if (fsInput && mainInput) mainInput.value = fsInput.value;
        });

        // Déclencher la simulation principale
        if (DOMRefs.simulateBtn) DOMRefs.simulateBtn.click();

        // Mettre à jour le graphique en plein écran avec les nouvelles données
        setTimeout(() => {
            const updatedOriginalChart = ChartInstances[chartId];
            if (window._fullChart && updatedOriginalChart) {
                window._fullChart.data = JSON.parse(JSON.stringify(updatedOriginalChart.data));
                window._fullChart.update();
            }

            // AJOUT : Mettre à jour le dashboard s'il est ouvert
            if (DOMRefs.dashboardPanel && DOMRefs.dashboardPanel.classList.contains('open')) {
                console.log("Dashboard est ouvert, mise à jour suite à la simulation depuis le zoom.");
                updateDashboardParams(DOMRefs);
                cloneCharts(DOMRefs);
            }
        }, 100); // Léger délai pour laisser le temps au thread principal de finir la simulation
    };
    controlsContainer.appendChild(simBtn);
}

function closeFullscreen(DOMRefs) {
    if (!DOMRefs.fullscreenModal || !DOMRefs.fullscreenControls) return;
    console.log("Fermeture du plein écran.");
    DOMRefs.fullscreenModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Nettoyer le graphique et les contrôles
    if (window._fullChart) {
        window._fullChart.destroy();
        window._fullChart = null;
    }
    DOMRefs.fullscreenControls.innerHTML = ''; // Nettoie les contrôles
}

/**
 * Met à jour les labels et valeurs des inputs du dashboard en fonction du scénario actuel.
 */
function updateDashboardParams(DOMRefs) {
    const scenarioId = AppState.currentScenarioId;
    const dashboardTitle = document.getElementById('dashboardScenarioDisplay');
    if (dashboardTitle) {
        dashboardTitle.textContent = AppState.currentScenarioName;
    }

    const isS1 = scenarioId === 1;
    const labels = isS1 ? ['PIB (%)', 'Gini', 'CO2 (t)', 'VEB'] : ['Normandie', 'V-Dem', 'Croissance (%)', 'IDH'];
    const keys = isS1 ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu'] : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    for (let i = 1; i <= 4; i++) {
        const labelEl = document.getElementById(`param${i}InputLabel`);
        const inputEl = document.getElementById(`param${i}Input`);
        const mainInputEl = document.getElementById(keys[i - 1]);

        if (labelEl) labelEl.textContent = labels[i - 1] + ':';
        if (inputEl && mainInputEl) {
            inputEl.value = mainInputEl.value;
        }
    }
}

/**
 * Clone les graphiques principaux dans le tableau de bord.
 */
function cloneCharts(DOMRefs) {
    const container = DOMRefs.clonedDashboardCharts;
    if (!container) {
        console.error("Conteneur du dashboard '#clonedDashboardCharts' introuvable.");
        return;
    }
    container.innerHTML = '';

    chartIdsToClone.forEach(chartId => {
        const originalChart = ChartInstances[chartId];
        if (!originalChart) {
            console.warn(`Graphique original '${chartId}' non trouvé pour le clonage.`);
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'dashboard-chart cloned-chart-wrapper';

        // AJOUT : Rendre le wrapper cliquable pour le mode plein écran
        wrap.style.cursor = 'pointer';
        wrap.title = 'Cliquer pour agrandir';
        wrap.addEventListener('click', (e) => {
            // Empêcher le zoom si on clique sur le sélecteur
            if (e.target.tagName !== 'SELECT') {
                openFullscreen(chartId, DOMRefs);
            }
        });

        const canvas = document.createElement('canvas');
        wrap.appendChild(canvas);

        const clonedChart = new Chart(canvas, {
            type: originalChart.config.type,
            data: JSON.parse(JSON.stringify(originalChart.config.data)),
            options: {
                ...originalChart.config.options,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    ...originalChart.config.options.plugins,
                    legend: { display: false } // Masquer la légende pour gagner de la place
                }
            }
        });

        // Ajouter un sélecteur si nécessaire
        let selectorConfig;
        if (chartId === 'countryChart') selectorConfig = { data: euStatesData, key: 'code', label: 'name', stateKey: 'currentCountryId', setter: AppState.selectCountry };
        if (chartId === 'politiqueChart') selectorConfig = { data: Object.keys(partis), stateKey: 'currentPartyId', setter: AppState.selectParty };
        if (chartId === 'lobbyChart') selectorConfig = { data: Object.keys(lobbies), labelKey: 'nom', stateKey: 'currentLobbyId', setter: AppState.selectLobby };

        if (selectorConfig) {
            const sel = document.createElement('select');
            sel.className = 'sim-selector';
            selectorConfig.data.forEach(item => {
                const opt = document.createElement('option');
                const value = selectorConfig.key ? item[selectorConfig.key] : item;
                const text = selectorConfig.labelKey ? lobbies[item][selectorConfig.labelKey] : (selectorConfig.label ? item[selectorConfig.label] : item);
                opt.value = value;
                opt.textContent = text;
                sel.appendChild(opt);
            });
            sel.value = AppState[selectorConfig.stateKey];
            sel.onchange = (e) => {
                selectorConfig.setter(e.target.value);
                // On délègue l'action au bouton de simulation principal.
                if (DOMRefs.simulateBtn) {
                    DOMRefs.simulateBtn.click();
                }
                cloneCharts(DOMRefs);
            };
            wrap.appendChild(sel);
        }

        container.appendChild(wrap);
    });
}