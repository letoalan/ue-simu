import { AppState, ChartInstances, simulationYears, profiles, euStatesData } from '../../../state/index.js';
import { simulateCountry } from '../simulator/engine/index.js';

let ficheData = null;
let statsData = null;
let map = null;
let geoJsonLayer = null;

// Configuration des graphiques par scénario
const chartConfig = {
    1: {
        pib_eu: 'PIB (%)',
        gini_eu: 'Gini',
        co2_eu: 'CO₂/hab (t)',
        veb_eu: 'VEB',
        mapping: { pib_eu: 'arr1', gini_eu: 'arr2', co2_eu: 'arr3', veb_eu: 'arr4' }
    },
    2: {
        pib_growth_eu: 'Croissance (%)',
        normandie_eu: 'Stabilité',
        vdem_eu: 'V-Dem',
        idh_eu: 'IDH',
        mapping: { pib_growth_eu: 'arr1', normandie_eu: 'arr2', vdem_eu: 'arr3', idh_eu: 'arr4' }
    }
};

function getImagePath(relativePath) {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    if (hostname.includes('github.io')) {
        if (pathname.includes('/ue-simu/')) {
            return `/ue-simu${relativePath}`;
        } else {
            const pathParts = pathname.split('/').filter(part => part !== '');
            if (pathParts.length > 0) {
                return `/${pathParts[0]}${relativePath}`;
            }
        }
        return relativePath;
    }
    return `.${relativePath}`;
}

function getDirectiveTitle(data) {
    if (data?.directive?.title) {
        return data.directive.title;
    }
    const { selectedDirectiveId, currentScenarioData } = AppState;
    const directiveInfo = currentScenarioData?.directive.find(d => d.id === selectedDirectiveId);
    return directiveInfo?.nom || "Titre non disponible";
}

function getAmendments(data) {
    // Gestion des deux structures de fichiers
    if (Array.isArray(data)) {
        // Structure cou_s1-d1.json - extraire tous les amendements uniques des pays
        const allAmendments = new Map();
        data.forEach(country => {
            if (country.positions_amendements) {
                country.positions_amendements.forEach(amend => {
                    if (!allAmendments.has(amend.amendement)) {
                        allAmendments.set(amend.amendement, {
                            id: amend.amendement,
                            origine: amend.origine,
                            titre: amend.titre
                        });
                    }
                });
            }
        });
        return Array.from(allAmendments.values());
    } else {
        // Structure s1-d1.json classique
        return data?.commission?.impacts_amendements || [];
    }
}

function getCountries(data) {
    // Gestion des deux structures de fichiers
    if (Array.isArray(data)) {
        // Structure cou_s1-d1.json - le tableau contient directement les pays
        return data;
    } else {
        // Structure s1-d1.json classique
        return data?.countries || [];
    }
}

async function loadFicheData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Fiche États: Scénario ou Directive non sélectionné.");
        return false;
    }

    // Essayer d'abord le fichier cou_s1-d1.json
    const couUrl = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/cou_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    const classicUrl = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/s${currentScenarioId}-d${selectedDirectiveId}.json`;

    console.log("Essai de chargement fiche cou:", couUrl);

    try {
        // Essayer d'abord le fichier cou
        let response = await fetch(couUrl);
        if (response.ok) {
            ficheData = await response.json();
            console.log("Fichier cou chargé avec succès:", ficheData);
            return true;
        }

        // Fallback sur le fichier classique
        console.log("Fichier cou non trouvé, essai classique:", classicUrl);
        response = await fetch(classicUrl);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        ficheData = await response.json();
        console.log("Fichier classique chargé avec succès:", ficheData);
        return true;
    } catch (error) {
        console.error("Impossible de charger les données de la fiche États:", error);
        const container = document.getElementById('fiches-etats-text');
        if (container) {
            container.innerHTML = "<p style='color: red;'>Erreur: Impossible de charger les données pour cette fiche.</p>";
        }
        return false;
    }
}

async function loadStatsData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) return false;

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/stats${currentScenarioId}d${selectedDirectiveId}.json`;
    console.log("Chargement stats:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Fichier de stats non trouvé à l'URL: ${url}. Utilisation des données du scénario principal.`);
            const directive = AppState.currentScenarioData.directive.find(d => d.id === selectedDirectiveId);
            if (directive) {
                statsData = {
                    valeurs_prevues: directive.statistiques_depart,
                    amendements: directive.amendements.map(a => ({ id: a.id, valeurs_prevues: a.impact }))
                };
                console.log("Données de repli chargées:", statsData);
                return true;
            }
            throw new Error(`Données de repli non trouvées pour la directive ${selectedDirectiveId}`);
        }
        statsData = await response.json();
        console.log("Données statistiques chargées:", statsData);
        return true;
    } catch (error) {
        console.error("Impossible de charger les données de statistiques pour la fiche:", error);
        statsData = null;
        return false;
    }
}

function setupMap() {
    if (map) return;
    const mapContainer = document.getElementById('fiches-etats-map');
    if (!mapContainer) return;

    map = L.map(mapContainer, {
        center: [50, 10],
        zoom: 3.5,
        scrollWheelZoom: false,
        dragging: false,
        zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
}

function populateSelectors() {
    const countryMenu = document.getElementById('fiches-etats-menu');
    const directiveMenu = document.getElementById('fiches-etats-directive-menu');

    if (!countryMenu || !directiveMenu || !ficheData) return;

    countryMenu.innerHTML = euStatesData.map(state => `<option value="${state.code}">${state.name}</option>`).join('');

    const directiveTitle = getDirectiveTitle(ficheData);
    const amendments = getAmendments(ficheData);
    directiveMenu.innerHTML = `<option value="directive">Vue générale : ${directiveTitle}</option>`;
    amendments.forEach(amend => {
        directiveMenu.innerHTML += `<option value="${amend.id}">Amendement ${amend.id} (${amend.origine || 'N/A'})</option>`;
    });
}

/**
 * Affiche la carte d'information textuelle enrichie pour les États.
 */
function renderEtatCard(countryCode, selection) {
    const textContainer = document.getElementById('fiches-etats-text');
    if (!textContainer) return;

    const countries = getCountries(ficheData);
    const countryInfo = euStatesData.find(s => s.code === countryCode);
    const countryName = countryInfo ? countryInfo.name : countryCode;

    // Recherche du pays selon la structure
    let countryData;
    if (Array.isArray(ficheData)) {
        // Structure cou_s1-d1.json - recherche par actor_id ou nom
        countryData = countries.find(c =>
            c.actor_id?.toLowerCase() === countryCode.toLowerCase() ||
            c.nom?.toLowerCase() === countryName.toLowerCase()
        );
    } else {
        // Structure classique - recherche par nom
        countryData = countries.find(c => c.nom?.toLowerCase() === countryName.toLowerCase());
    }

    // Image de fond (drapeau)
    const photoUrl = countries.length ?
        getImagePath(`/medias/images/flags/${countryName.toLowerCase()}.jpg`) :
        getImagePath('/medias/images/flags/eu.jpg');

    if (!countryData) {
        textContainer.style.backgroundImage = `url('${photoUrl}')`;
        textContainer.innerHTML = `<p>Données non disponibles pour ${countryName}.</p>`;
        return;
    }

    let html = '';

    if (selection === 'directive') {
        // ========== AFFICHAGE DIRECTIVE (harmonisé avec commission/partis/lobbies) ==========
        html = `
            <h3>${countryData.nom}</h3>
            <p><strong>Rôle européen :</strong> ${countryData.role_europeen || 'Non précisé'}</p>
        `;

        // Enjeux de la directive
        if (countryData.enjeux_directive && countryData.enjeux_directive.length > 0) {
            html += `
                <h4>📋 Enjeux de la directive</h4>
                <ul>
                    ${countryData.enjeux_directive.map(enjeu => `<li>${enjeu}</li>`).join('')}
                </ul>
            `;
        }

        // Impacts attendus
        if (countryData.impacts_directive && countryData.impacts_directive.length > 0) {
            html += `
                <h4>💼 Impacts attendus</h4>
                <ul>
                    ${countryData.impacts_directive.map(impact => `<li>${impact}</li>`).join('')}
                </ul>
            `;
        }

    } else {
        // ========== AFFICHAGE AMENDEMENT (harmonisé) ==========
        const amendData = countryData.positions_amendements?.find(a => a.amendement === selection);

        if (amendData) {
            // Codes couleur pour les positions
            const positionColor = getPositionColor(amendData.position) || '#2196f3';
            const positionEmoji = getPositionEmoji(amendData.position);
            const amendTitle = amendData.titre || `Amendement ${amendData.amendement}`;

            html = `
                <h3>${countryData.nom}</h3>
                <h4>${amendTitle}</h4>
                <div style="background: linear-gradient(135deg, ${positionColor}22, ${positionColor}11); padding: 15px; border-radius: 8px; border-left: 4px solid ${positionColor};">
                    <p><strong>Position de l'État :</strong> ${positionEmoji} <span style="color: ${positionColor}; font-weight: bold;">${amendData.position}</span></p>
                </div>
            `;

            // Priorité
            if (amendData.priorite || amendData.priorité) {
                const priority = amendData.priorite || amendData.priorité;
                html += `<p><strong>Priorité :</strong> ${getPriorityDisplay(priority)} ${priority}</p>`;
            }

            // Origine
            if (amendData.origine) {
                html += `<p><strong>Origine :</strong> ${amendData.origine}</p>`;
            }

            // Description
            if (amendData.description) {
                html += `<h4>📝 Description</h4><p>${amendData.description}</p>`;
            }

            // Justification
            if (amendData.justification) {
                html += `<h4>💬 Justification</h4><p>${amendData.justification}</p>`;
            }

            // Impact analysé
            if (amendData.impact_analyse) {
                html += `<h4>📈 Impact analysé</h4><p>${amendData.impact_analyse}</p>`;
            }

            // Arguments clés
            if (countryData.éléments_d_argumentaire && countryData.éléments_d_argumentaire.length > 0) {
                const topArgs = countryData.éléments_d_argumentaire.slice(0, 3);
                html += `
                    <h4>🗣️ Arguments clés</h4>
                    <ul>
                        ${topArgs.map(arg => `<li>${arg}</li>`).join('')}
                    </ul>
                `;
            }

        } else {
            html = `
                <h3>${countryData.nom}</h3>
                <h4>Amendement ${selection}</h4>
                <p>Aucune position spécifique pour cet amendement.</p>
            `;
        }
    }

    // Injection du HTML
    textContainer.style.backgroundImage = `url('${photoUrl}')`;
    textContainer.innerHTML = html;
}

// NOUVEAU: Fonctions pour le code couleur des positions (harmonisation)
function getPositionColor(position) {
    const colors = {
        'FAVORABLE': '#4caf50',
        'FAVORABLE_CONDITIONNEL': '#8bc34a',
        'NEUTRE': '#9e9e9e',
        'DEFAVORABLE_PARTIEL': '#ff9800',
        'DEFAVORABLE': '#f44336'
    };
    return colors[position] || '#9e9e9e';
}

function getPositionEmoji(position) {
    const emojis = {
        'FAVORABLE': '🟢',
        'FAVORABLE_CONDITIONNEL': '🟡',
        'NEUTRE': '⚪',
        'DEFAVORABLE_PARTIEL': '🟠',
        'DEFAVORABLE': '🔴'
    };
    return emojis[position] || '⚪';
}

function getPriorityDisplay(priority) {
    const displays = {
        'très_haute': '🔴🔴🔴',
        'haute': '🔴🔴',
        'moyenne': '🟡',
        'basse': '⚪',
        'faible': '⚪'
    };
    return displays[priority] || priority;
}

function renderEtatChart(countryCode, selection) {
    const canvas = document.getElementById('fiches-etats-chart');
    if (!canvas) return;

    if (ChartInstances.fichesEtatsChart) {
        ChartInstances.fichesEtatsChart.destroy();
    }

    const { currentScenarioId } = AppState;
    const countryProfile = profiles[countryCode];

    if (!statsData || !countryProfile) {
        console.error("Données de statistiques ou profil de pays manquant pour le graphique.");
        return;
    }

    let inputValues = {};
    let simulationTitle = '';

    if (selection !== 'directive') {
        const amendment = statsData.amendements.find(a => a.id === selection);
        inputValues = amendment?.valeurs_prevues || statsData.valeurs_prevues;
        simulationTitle = amendment
            ? `Projection sur 10 ans (${countryCode} avec Amend. ${amendment.id})`
            : `Projection sur 10 ans (${countryCode} - Amendement ${selection} non trouvé)`;
    } else {
        inputValues = statsData.valeurs_prevues;
        simulationTitle = `Projection sur 10 ans (${countryCode} - Directive Initiale)`;
    }

    console.log("Input values pour simulation:", inputValues);

    // Vérifier que les valeurs d'entrée sont correctement formatées
    const formattedInputValues = {};
    Object.keys(inputValues).forEach(key => {
        formattedInputValues[key] = typeof inputValues[key] === 'number'
            ? inputValues[key]
            : parseFloat(inputValues[key]) || 0;
    });

    const simulationResults = simulateCountry(countryProfile, formattedInputValues, currentScenarioId);
    if (!simulationResults) {
        console.error("La simulation pour le graphique de l'État a échoué.");
        return;
    }

    console.log("Résultats de simulation:", simulationResults);

    const labels = simulationYears;
    const config = chartConfig[currentScenarioId];
    const colors = ['#1a237e', '#1976d2', '#03a9f4', '#81d4fa'];
    const datasets = [];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: simulationTitle },
            legend: { position: 'top' }
        },
        scales: {}
    };

    // Configuration pour le scénario 1 (Développement durable)
    if (currentScenarioId === 1) {
        Object.keys(config).forEach((key) => {
            if (key === 'mapping') return;

            const dataKey = config.mapping[key];
            const dataset = {
                label: config[key],
                data: simulationResults[dataKey],
                tension: 0.1,
            };

            if (key === 'pib_eu') {
                dataset.yAxisID = 'y';
                dataset.borderColor = colors[0];
                dataset.backgroundColor = `${colors[0]}33`;
            } else if (key === 'gini_eu') {
                dataset.yAxisID = 'y1';
                dataset.borderColor = '#e91e63';
                dataset.backgroundColor = '#e91e6333';
            } else if (key === 'co2_eu') {
                dataset.yAxisID = 'y2';
                dataset.borderColor = colors[1];
                dataset.backgroundColor = `${colors[1]}33`;
            } else if (key === 'veb_eu') {
                dataset.yAxisID = 'y3';
                dataset.borderColor = colors[2];
                dataset.backgroundColor = `${colors[2]}33`;
            }
            datasets.push(dataset);
        });

        datasets.push({
            label: `Satisfaction ${countryCode} (%)`,
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y4',
            tension: 0.1
        });

        chartOptions.scales = {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Croissance PIB (%)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0.2,
                max: 0.6,
                title: { display: true, text: 'Indice de Gini', color: '#e91e63' },
                ticks: { color: '#e91e63' },
                grid: { drawOnChartArea: false }
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 20,
                title: { display: true, text: 'CO₂/hab (t)' },
                grid: { drawOnChartArea: false }
            },
            y3: {
                type: 'linear',
                display: true,
                position: 'left',
                offset: true,
                min: 0,
                max: 100,
                title: { display: true, text: 'VEB' },
                grid: { drawOnChartArea: false }
            },
            y4: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 100,
                title: { display: true, text: 'Satisfaction (%)' },
                grid: { drawOnChartArea: false }
            }
        };

    }
    // Configuration pour le scénario 2 (Géopolitique)
    else if (currentScenarioId === 2) {
        Object.keys(config).forEach((key, i) => {
            if (key === 'mapping') return;

            const dataKey = config.mapping[key];
            const dataset = {
                label: config[key],
                data: simulationResults[dataKey],
                borderColor: colors[i % colors.length],
                backgroundColor: `${colors[i % colors.length]}33`,
                tension: 0.1,
            };

            if (key === 'normandie_eu') {
                dataset.yAxisID = 'y';
            } else if (key === 'vdem_eu') {
                dataset.yAxisID = 'y1';
            } else if (key === 'idh_eu') {
                dataset.yAxisID = 'y2';
            } else if (key === 'pib_growth_eu') {
                dataset.yAxisID = 'y3';
            }

            datasets.push(dataset);
        });

        datasets.push({
            label: `Satisfaction ${countryCode} (%)`,
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y4',
            tension: 0.1
        });

        chartOptions.scales = {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                min: 0,
                max: 100,
                title: { display: true, text: 'Stabilité (%)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 1,
                title: { display: true, text: 'V-Dem' },
                grid: { drawOnChartArea: false }
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 1,
                title: { display: true, text: 'IDH' },
                grid: { drawOnChartArea: false }
            },
            y3: {
                type: 'linear',
                display: true,
                position: 'left',
                offset: true,
                min: -2,
                max: 4,
                title: { display: true, text: 'Croissance PIB (%)' },
                grid: { drawOnChartArea: false }
            },
            y4: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 100,
                title: { display: true, text: 'Satisfaction (%)' },
                grid: { drawOnChartArea: false }
            }
        };
    }

    ChartInstances.fichesEtatsChart = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: chartOptions
    });
}

async function updateMap(countryCode) {
    if (!map) return;

    if (geoJsonLayer) {
        map.removeLayer(geoJsonLayer);
    }

    try {
        const countryName = euStatesData.find(s => s.code === countryCode).name.toLowerCase();
        const response = await fetch(`json/directives/fiches-acteurs/pays/${countryName}.json`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const geoJsonData = await response.json();

        geoJsonLayer = L.geoJson(geoJsonData, {
            style: {
                color: "#1a237e",
                weight: 2,
                opacity: 1,
                fillColor: "#1976d2",
                fillOpacity: 0.5
            }
        }).addTo(map);

        map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
    } catch (error) {
        console.error(`Impossible de charger le GeoJSON pour ${countryCode}:`, error);
        map.setView([50, 10], 3.5);
    }
}

function updateAllComponents() {
    const countryMenu = document.getElementById('fiches-etats-menu');
    const directiveMenu = document.getElementById('fiches-etats-directive-menu');
    if (!countryMenu || !directiveMenu) return;

    const countryCode = countryMenu.value;
    const selection = directiveMenu.value;

    updateMap(countryCode);
    renderEtatCard(countryCode, selection);
    renderEtatChart(countryCode, selection);
}

export async function initEtatsSubTab() {
    ficheData = null;
    statsData = null;

    const [ficheDataLoaded, statsDataLoaded] = await Promise.all([
        loadFicheData(),
        loadStatsData()
    ]);

    if (!ficheDataLoaded || !statsDataLoaded) {
        console.error("Échec du chargement des données pour l'onglet États.");
        return;
    }

    const countryMenu = document.getElementById('fiches-etats-menu');
    const directiveMenu = document.getElementById('fiches-etats-directive-menu');

    setupMap();
    populateSelectors();

    countryMenu.addEventListener('change', updateAllComponents);
    directiveMenu.addEventListener('change', updateAllComponents);

    updateAllComponents();
}