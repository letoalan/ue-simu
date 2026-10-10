import { charts, simulationYears, currentScenario, profiles, partis, lobbies, DOMRefs, chartIdsToClone } from '../../../../state/index.js';
import { plotEU, plotCountry, plotPolitique, createLobbyChart, showScore } from './index.js';
import { simulate } from '../engine/index.js';
import { getNumericValue } from '../inputs.js';

export function cloneCharts() {
    console.log('🚀 CLONE-CHARTS-START');

    const container = document.getElementById('clonedDashboardCharts');
    if (!container) {
        console.error('❌ Conteneur #clonedDashboardCharts introuvable');
        return;
    }

    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(400px, 1fr))';
    container.style.gap = '20px';
    container.style.padding = '20px';
    container.style.minHeight = '500px';

    /* ---------- 1. Valeurs par défaut ---------- */
    if (!window.currentCountryId || !profiles[window.currentCountryId])
        window.currentCountryId = 'DE';

    if (!window.currentParti || !partis[window.currentParti])
        window.currentParti = Object.keys(partis)[0] || 'PPE';

    if (!window.currentLobbyId || !lobbies[window.currentLobbyId])
        window.currentLobbyId = Object.keys(lobbies)[0] || 'BIG_TECH';

    /* ---------- 2. Titre dynamique ---------- */
    const buildTitle = (id) => {
        switch (id) {
            case 'countryChart':
                const country = Object.values(profiles).find(p => p.code === window.currentCountryId);
                return `Évolution des indicateurs – ${country ? country.name : window.currentCountryId}`;
            case 'politiqueChart':
                return `Projections politiques – ${partis[window.currentParti]?.nom || window.currentParti}`;
            case 'lobbyChart':
                return `Évolution du lobby : ${lobbies[window.currentLobbyId]?.nom || window.currentLobbyId}`;
            default:
                return charts[id]?.config?.options?.plugins?.title?.text || id;
        }
    };

    /* ---------- 3. Helper : synchronise le plein-écran ---------- */
    const syncZoomTitle = (chartId) => {
        if (window._fullChart) {
            window._fullChart.options.plugins.title.text = buildTitle(chartId);
            window._fullChart.update();
        }
    };

    /* ---------- 4. Boucle de clonage ---------- */
    chartIdsToClone.forEach(chartId => {
        const original = charts[chartId];
        if (!original || !original.config) {
            console.warn(`⚠️ Graphique '${chartId}' absent ou corrompu`);
            return;
        }

        /* --- Wrapper --- */
        const wrap = document.createElement('div');
        wrap.className = 'dashboard-chart cloned-chart-wrapper';
        wrap.style.position = 'relative';
        wrap.style.border = '1px solid #e0e0e0';
        wrap.style.borderRadius = '8px';
        wrap.style.padding = '15px';
        wrap.style.backgroundColor = '#fff';
        wrap.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

        /* --- Titre --- */
        const title = document.createElement('div');
        title.className = 'chart-title';
        title.textContent = buildTitle(chartId);
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '15px';
        title.style.color = '#1a237e';
        wrap.appendChild(title);

        /* --- Canvas --- */
        const canvas = document.createElement('canvas');
        canvas.id = `cloned-${chartId}`;
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.cssText = 'width:100%; height:300px;';
        wrap.appendChild(canvas);

        /* --- Chart.js safe create --- */
        let chartInst;
        try {
            chartInst = new Chart(canvas, {
                type: original.config.type,
                data: JSON.parse(JSON.stringify(original.data)),
                options: {
                    ...original.options,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        ...original.options.plugins,
                        title: {
                            display: true,
                            text: buildTitle(chartId),
                            font: { size: 14, weight: 'bold' }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: { font: { size: 12 } }
                        }
                    }
                }
            });
            console.log(`✅ Clone '${chartId}' OK`);
        } catch (e) {
            console.error(`💥 Échec clone '${chartId}'`, e);
            return;
        }

        /* --- 4a. Sélecteurs dynamiques --- */

        /* COUNTRY SELECTOR */
        if (chartId === 'countryChart') {
            const sel = document.createElement('select');
            sel.className = 'chart-selector';
            sel.id = `selector-${chartId}`;
            sel.style.cssText = 'width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;';

            Object.values(profiles).forEach(country => {
                const opt = document.createElement('option');
                opt.value = country.code;
                opt.textContent = country.name;
                sel.appendChild(opt);
            });

            sel.value = window.currentCountryId;
            sel.onchange = (e) => {
                window.currentCountryId = e.target.value;
                updateCountryChartForSelectedCountry();

                if (charts.countryChart) {
                    charts.countryChart.update();
                }

                const newTitle = buildTitle('countryChart');
                title.textContent = newTitle;

                if (chartInst) {
                    chartInst.data = JSON.parse(JSON.stringify(charts.countryChart.data));
                    chartInst.options.plugins.title.text = newTitle;
                    chartInst.update();
                }

                syncZoomTitle('countryChart');
            };
            wrap.insertBefore(sel, canvas);
        }

        /* POLITIQUE SELECTOR */
        if (chartId === 'politiqueChart') {
            const sel = document.createElement('select');
            sel.className = 'chart-selector';
            sel.id = `selector-${chartId}`;
            sel.style.cssText = 'width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;';

            Object.keys(partis).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = `${key} - ${partis[key].nom}`;
                sel.appendChild(opt);
            });

            sel.value = window.currentParti;
            sel.onchange = (e) => {
                window.currentParti = e.target.value;
                updatePolitiqueChartForSelectedParty();

                if (charts.politiqueChart) {
                    charts.politiqueChart.update();
                }

                const newTitle = buildTitle('politiqueChart');
                title.textContent = newTitle;

                if (chartInst) {
                    chartInst.data = JSON.parse(JSON.stringify(charts.politiqueChart.data));
                    chartInst.options.plugins.title.text = newTitle;
                    chartInst.update();
                }

                syncZoomTitle('politiqueChart');
            };
            wrap.insertBefore(sel, canvas);
        }

        /* LOBBY SELECTOR */
        if (chartId === 'lobbyChart') {
            const sel = document.createElement('select');
            sel.className = 'chart-selector';
            sel.id = `selector-${chartId}`;
            sel.style.cssText = 'width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;';

            Object.keys(lobbies).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = lobbies[key].nom;
                sel.appendChild(opt);
            });

            sel.value = window.currentLobbyId;
            sel.onchange = (e) => {
                window.currentLobbyId = e.target.value;
                updateLobbyChartForSelectedLobby();

                if (charts.lobbyChart) {
                    charts.lobbyChart.update();
                }

                const newTitle = buildTitle('lobbyChart');
                title.textContent = newTitle;

                if (chartInst) {
                    chartInst.data = JSON.parse(JSON.stringify(charts.lobbyChart.data));
                    chartInst.options.plugins.title.text = newTitle;
                    chartInst.update();
                }

                syncZoomTitle('lobbyChart');
            };
            wrap.insertBefore(sel, canvas);
        }

        /* --- 5. Clic vers zoom plein-écran --- */
        wrap.style.cursor = 'pointer';
        wrap.title = 'Cliquer pour agrandir';
        wrap.addEventListener('click', (e) => {
            if (e.target.tagName !== 'SELECT') {
                console.log(`🖱️ Zoom demandé pour ${chartId}`);
                openDashboardFullscreen(chartId);
            }
        });

        container.appendChild(wrap);
    });

    console.log('🏁 CLONE-CHARTS-DONE');
}

function updateCountryChartForSelectedCountry() {
    const countryProfile = profiles[window.currentCountryId];
    if (!countryProfile) return;

    let euInputsForCountrySimulation = {};

    if (currentScenario === 1) {
        euInputsForCountrySimulation = {
            pib: getNumericValue('pib_eu', countryProfile.dev.init.croiss),
            gini: getNumericValue('gini_eu', countryProfile.dev.init.gini),
            co2: getNumericValue('co2_eu', countryProfile.dev.init.co2),
            veb: getNumericValue('veb_eu', countryProfile.dev.init.veb)
        };
    } else {
        euInputsForCountrySimulation = {
            normandie: getNumericValue('normandie_eu', countryProfile.geo.init.normandie),
            vdem: getNumericValue('vdem_eu', countryProfile.geo.init.vdem),
            pib: getNumericValue('pib_growth_eu', countryProfile.geo.init.pib),
            idh: getNumericValue('idh_eu', countryProfile.geo.init.idh)
        };
    }

    const simulatedData = simulateCountry(countryProfile, euInputsForCountrySimulation, currentScenario);
    plotCountry(simulationYears, simulatedData, countryProfile, currentScenario);
}

function updatePolitiqueChartForSelectedParty() {
    const parti = partis[window.currentParti];
    if (!parti) return;

    plotPolitique(simulationYears, null, parti);
}

function updateLobbyChartForSelectedLobby() {
    createLobbyChart();
}

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

    /* 0-a. Helper local : titre dynamique */
    const buildTitle = (id) => {
        switch (id) {
            case 'countryChart':
                const country = Object.values(profiles).find(p => p.code === window.currentCountryId);
                return `Évolution – ${country ? country.name : window.currentCountryId}`;
            case 'politiqueChart':
                return `Projections – ${partis[window.currentParti]?.nom || window.currentParti}`;
            case 'lobbyChart':
                return `Lobby – ${lobbies[window.currentLobbyId]?.nom || window.currentLobbyId}`;
            default:
                return originalChart.config?.options?.plugins?.title?.text || id;
        }
    };

    /* 1. Nettoyage */
    ctrlBox.innerHTML = '';
    if (window._fullChart) {
        window._fullChart.destroy();
        window._fullChart = null;
    }

    /* 2-a. 4 sliders synchronisés */
    buildFullscreenInputs('fullscreenControls', currentScenario);

    /* 2-b. Bouton « Simuler » */
    const btn = document.createElement('button');
    btn.textContent = 'Simuler';
    btn.style.cssText = 'margin-top:8px;padding:8px 16px;font-size:14px;background:#1976d2;color:white;border:none;border-radius:4px;cursor:pointer;';
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

    /* 2-c. Sélecteur dynamique */
    const selector = getSelectorFor(chartId);
    if (selector) {
        const sel = document.createElement('select');
        sel.id = 'fullscreenDynamicSelect';
        sel.style.cssText = 'margin-top:12px;padding:8px;width:100%;border:1px solid #ccc;border-radius:4px;';

        selector.data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = selector.key ? item[selector.key] : item;
            opt.textContent = selector.key ? item[selector.label] : selector.label(item);
            sel.appendChild(opt);
        });

        sel.value = chartId === 'countryChart' ? window.currentCountryId :
            chartId === 'politiqueChart' ? (window.currentParti || 'PPE') :
                (window.currentLobbyId || 'BIG_TECH');

        sel.addEventListener('change', (e) => {
            const val = e.target.value;
            let newTitle = '';

            if (chartId === 'countryChart') {
                window.currentCountryId = val;
                updateCountryChartForSelectedCountry();
                if (charts.countryChart) charts.countryChart.update();
                newTitle = `Évolution – ${Object.values(profiles).find(p => p.code === val)?.name || val}`;
            } else if (chartId === 'politiqueChart') {
                window.currentParti = val;
                updatePolitiqueChartForSelectedParty();
                if (charts.politiqueChart) charts.politiqueChart.update();
                newTitle = `Politiques – ${partis[val]?.nom || val}`;
            } else {
                window.currentLobbyId = val;
                updateLobbyChartForSelectedLobby();
                if (charts.lobbyChart) charts.lobbyChart.update();
                newTitle = `Lobby – ${lobbies[val]?.nom || val}`;
            }

            if (window._fullChart) {
                window._fullChart.data = JSON.parse(JSON.stringify(charts[chartId].data));
                window._fullChart.options.plugins.title.text = newTitle;
                window._fullChart.update();
            }
        });
        ctrlBox.appendChild(sel);
    }

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
                    legend: { display: true, position: 'top' },
                    title: {
                        display: true,
                        text: buildTitle(chartId),
                        font: { size: 18, weight: 'bold' }
                    }
                }
            }
        });
        console.log('✅ Zoom Chart créé pour', chartId);
    } catch (err) {
        console.error('💥 Erreur création zoom', err);
    }

    /* 4. Affichage forcé et au-dessus de tout */
    modal.style.display = 'flex';
    modal.style.zIndex = '9999';
    document.body.style.overflow = 'hidden';
}

function getSelectorFor(chartId) {
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

function buildFullscreenInputs(containerId, scenario) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const isS1 = scenario === 1;
    const defs = isS1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const labels = isS1
        ? ['PIB UE (%)', 'Gini', 'CO₂ (t)', 'VEB (Mds €)']
        : ['Indice Normandie', 'Démocratie (V-Dem)', 'Croissance UE (%)', 'IDH'];

    defs.forEach((key, index) => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '8px';
        label.innerHTML = `
            <span style="display:block; margin-bottom:4px; font-weight:bold;">${labels[index]}:</span>
            <input type="number" id="${containerId}_${key}" step="${isS1 ? (index === 1 ? '0.01' : '0.1') : '0.01'}" 
                   style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">
        `;
        container.appendChild(label);

        const input = label.querySelector('input');
        const mainInput = document.getElementById(key);
        input.value = mainInput ? mainInput.value : getDefaultValue(key, isS1);

        input.addEventListener('input', () => {
            const val = parseFloat(input.value);
            if (mainInput) mainInput.value = val;
            syncSingleKey(key, val, containerId);
        });
    });
}

function getDefaultValue(key, isS1) {
    const defaults = {
        'pib_eu': 2.0,
        'gini_eu': 0.3,
        'co2_eu': 4.0,
        'veb_eu': 80,
        'normandie_eu': 80,
        'vdem_eu': 0.85,
        'pib_growth_eu': 1.5,
        'idh_eu': 0.92
    };
    return defaults[key] || 0;
}

function syncSingleKey(key, value, excludeContainerId) {
    ['dashboardControls', 'fullscreenControls'].forEach(id => {
        if (id === excludeContainerId) return;
        const tgt = document.getElementById(`${id}_${key}`);
        if (tgt && parseFloat(tgt.value) !== value) {
            tgt.value = value;
        }
    });

    const mainSimulatorKeys = currentScenario === 1
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

export function closeDashboardFullscreen() {
    const modal = document.getElementById('dashboardFullscreenMode');
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (window._fullChart) {
        window._fullChart.destroy();
        window._fullChart = null;
    }
}