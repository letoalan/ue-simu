import { ChartInstances, AppState, lobbies, simulationYears, partis } from '../../../../state/index.js';

/**
 * Crée ou met à jour un graphique Chart.js sur un canvas donné.
 * Gère la destruction de l'instance précédente si elle existe.
 * @param {string} chartId L'ID du canvas HTML pour le graphique.
 * @param {string} type Le type de graphique (ex: 'line', 'bar').
 * @param {object} data Les données du graphique.
 * @param {object} options Les options de configuration du graphique.
 * @returns {Chart|null} La nouvelle instance du graphique Chart.js, ou null en cas d'erreur.
 */
export function createOrUpdateChart(chartId, type, data, options) {
    const ctx = document.getElementById(chartId);
    if (!ctx) {
        console.error(`ERREUR: Canvas '${chartId}' non trouvé.`);
        return null;
    }

    if (ChartInstances[chartId]) {
        ChartInstances[chartId].destroy();
    }

    const newChartInstance = new Chart(ctx, { type, data, options });
    ChartInstances[chartId] = newChartInstance;
    return newChartInstance;
}

export function plotEU(years, euData, scenario) {
    let datasets = [];
    let scales = {};

    if (scenario === 1) {
        datasets = [
            { label: "Croissance (%)", data: euData.arr1, borderColor: "#1976d2", yAxisID: 'y3' },
            { label: "Gini", data: euData.arr2, borderColor: "#ff9800", yAxisID: 'y2' },
            { label: "CO₂/hab (t)", data: euData.arr3, borderColor: "#388e3c", yAxisID: 'y3' },
            { label: "VEB", data: euData.arr4, borderColor: "#8e24aa", yAxisID: 'y' },
            { label: "Satisfaction (0-1)", data: euData.satisArr, borderColor: "#d32f2f", borderWidth: 4, yAxisID: 'y2' }
        ];
        scales = {
            y: { beginAtZero: true, min: 0, max: 100, title: { display: true, text: 'VEB' } },
            y2: { position: 'right', beginAtZero: true, min: 0, max: 1, title: { display: true, text: 'Gini & Satisfaction' }, grid: { drawOnChartArea: false } },
            y3: { position: 'right', beginAtZero: true, min: 0, max: 20, title: { display: true, text: 'Croissance & CO₂' }, grid: { drawOnChartArea: false } }
        };
    } else {
        datasets = [
            { label: "Croissance (%)", data: euData.arr1, borderColor: "#1976d2", yAxisID: 'y3' },
            { label: "Normandie", data: euData.arr2, borderColor: "#ff9800", yAxisID: 'y' },
            { label: "V-Dem", data: euData.arr3, borderColor: "#388e3c", yAxisID: 'y2' },
            { label: "IDH", data: euData.arr4, borderColor: "#8e24aa", yAxisID: 'y2' },
            { label: "Satisfaction (0-1)", data: euData.satisArr, borderColor: "#d32f2f", borderWidth: 4, yAxisID: 'y2' }
        ];
        scales = {
            y: { beginAtZero: true, min: 0, max: 100, title: { display: true, text: 'Normandie' } },
            y2: { position: 'right', beginAtZero: true, min: 0, max: 1, title: { display: true, text: 'V-Dem, IDH & Satisfaction' }, grid: { drawOnChartArea: false } },
            y3: { position: 'right', beginAtZero: true, min: 0, max: 10, title: { display: true, text: 'Croissance (%)' }, grid: { drawOnChartArea: false } }
        };
    }

    datasets.forEach(ds => {
        ds.backgroundColor = ds.borderColor + '22';
        ds.borderWidth = ds.borderWidth || 2.5;
        ds.fill = false;
        ds.tension = 0.4;
    });

    createOrUpdateChart('euChart', 'line', { labels: years, datasets }, {
        responsive: true,
        plugins: { title: { display: true, text: 'Évolution des indicateurs européens' } },
        scales: scales
    });
}

export function plotCountry(years, data, country, scenario) {
    let datasets = [];
    let scales = {};

    if (scenario === 1) {
        datasets = [
            { label: "Croissance (%)", data: data.arr1, borderColor: "#1976d2", yAxisID: 'y3' },
            { label: "Gini", data: data.arr2, borderColor: "#ff9800", yAxisID: 'y2' },
            { label: "CO₂/hab (t)", data: data.arr3, borderColor: "#388e3c", yAxisID: 'y3' },
            { label: "VEB", data: data.arr4, borderColor: "#8e24aa", yAxisID: 'y' },
            { label: "Satisfaction (0-1)", data: data.satisArr, borderColor: "#d32f2f", borderWidth: 4, yAxisID: 'y2' }
        ];
        scales = {
            y: { beginAtZero: true, min: 0, max: 100, title: { display: true, text: 'VEB' } },
            y2: { position: 'right', beginAtZero: true, min: 0, max: 1, title: { display: true, text: 'Gini & Satisfaction' }, grid: { drawOnChartArea: false } },
            y3: { position: 'right', beginAtZero: true, min: 0, max: 20, title: { display: true, text: 'Croissance & CO₂' }, grid: { drawOnChartArea: false } }
        };
    } else {
        datasets = [
            { label: "Croissance (%)", data: data.arr1, borderColor: "#1976d2", yAxisID: 'y3' },
            { label: "Normandie", data: data.arr2, borderColor: "#ff9800", yAxisID: 'y' },
            { label: "V-Dem", data: data.arr3, borderColor: "#388e3c", yAxisID: 'y2' },
            { label: "IDH", data: data.arr4, borderColor: "#8e24aa", yAxisID: 'y2' },
            { label: "Satisfaction (0-1)", data: data.satisArr, borderColor: "#d32f2f", borderWidth: 4, yAxisID: 'y2' }
        ];
        scales = {
            y: { beginAtZero: true, min: 0, max: 100, title: { display: true, text: 'Normandie' } },
            y2: { position: 'right', beginAtZero: true, min: 0, max: 1, title: { display: true, text: 'V-Dem, IDH & Satisfaction' }, grid: { drawOnChartArea: false } },
            y3: { position: 'right', beginAtZero: true, min: 0, max: 10, title: { display: true, text: 'Croissance (%)' }, grid: { drawOnChartArea: false } }
        };
    }

    datasets.forEach(ds => {
        ds.backgroundColor = ds.borderColor + '22';
        ds.borderWidth = ds.borderWidth || 2.5;
        ds.fill = false;
        ds.tension = 0.4;
    });

    createOrUpdateChart('countryChart', 'line', { labels: years, datasets }, {
        responsive: true,
        plugins: { title: { display: true, text: `Évolution des indicateurs – ${country.name}` } },
        scales: scales
    });
}

export function plotPolitique(years, parti) {
    if (!parti || !parti.satisfactionArr) return;

    const datasets = [
        { label: 'Satisfaction (%)', data: parti.satisfactionArr, borderColor: '#d32f2f', borderDash: [10, 5], borderWidth: 3, yAxisID: 'y2' },
        { label: 'Députés', data: parti.mepsArr, borderColor: parti.couleur, borderWidth: 3, stepped: true, yAxisID: 'y' },
        { label: 'Commissaires', data: parti.commissairesArr, borderColor: '#888', borderWidth: 2, stepped: true, yAxisID: 'y' },
        { label: 'Conseil (% États)', data: parti.conseilArr, borderColor: '#1976d2', borderWidth: 2, stepped: true, yAxisID: 'y2' },
        { label: 'Présidence (%)', data: parti.presArr, borderColor: '#FFD700', borderWidth: 2, stepped: true, yAxisID: 'y2' }
    ];

    datasets.forEach(ds => {
        ds.backgroundColor = ds.borderColor + '22';
        ds.fill = false;
        ds.tension = 0.4;
    });

    createOrUpdateChart('politiqueChart', 'line', { labels: years, datasets }, {
        responsive: true,
        plugins: { title: { display: true, text: `Projections politiques - ${parti.nom}` } },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Députés / Commissaires' } },
            y2: { position: 'right', beginAtZero: true, min: 0, max: 100, title: { display: true, text: '% Satisfaction/Conseil/Présidence' }, grid: { drawOnChartArea: false } }
        }
    });
}

export function showScore(satisArr, elementId) {
    const element = document.getElementById(elementId);
    if (!element || !satisArr || satisArr.length === 0) return;

    const adhInit = satisArr[0];
    const adhFin = satisArr[satisArr.length - 1];
    const ecart = adhFin - adhInit;

    const scoreSucces = (0.4 * adhFin + 0.4 * (1 - Math.abs(0.8 - adhFin)) + 0.2 * ecart) * 100;
    const icon = ecart > 0.1 ? "📈" : ecart < -0.1 ? "📉" : "➡️";

    element.innerHTML = `
        <div style="margin-bottom:4px;">
            <b>${icon} Score de réussite :</b> <span style="font-weight:600">${scoreSucces.toFixed(1)}/100</span>
        </div>
        <div style="font-size:0.94em; color:#555; line-height:1.4;">
            <div>• Niveau initial: ${(adhInit * 100).toFixed(1)}%</div>
            <div>• Niveau final: ${adhFin.toFixed(2)}%</div>
            <div>• Progression: ${ecart >= 0 ? "+" : ""}${(ecart * 100).toFixed(1)} points</div>
        </div>`;
}

/**
 * Crée ou met à jour le graphique des Lobbies.
 * Lit l'état actuel depuis AppState et les données de simulation depuis l'objet `lobbies`.
 */
export function createLobbyChart() {
    const selectedLobbyKey = AppState.currentLobbyId;
    const lobby = lobbies[selectedLobbyKey];

    if (!lobby) {
        console.error("Lobby non trouvé pour la clé :", selectedLobbyKey);
        return;
    }

    // Vérification que les données de simulation existent (générées par `simulerLobbies`)
    if (!lobby.reputationArr || lobby.reputationArr.length < simulationYears.length) {
        console.warn(`WARN: Données de simulation pour le lobby "${lobby.nom}" non disponibles. Le graphique ne sera pas tracé.`);
        if (ChartInstances.lobbyChart) {
            ChartInstances.lobbyChart.destroy();
            delete ChartInstances.lobbyChart;
        }
        return;
    }

    const datasets = [
        {
            label: 'Réputation',
            data: lobby.reputationArr,
            borderColor: '#9c27b0',
            backgroundColor: '#9c27b022',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        },
        {
            label: 'Influence États',
            data: lobby.infEtatsArr,
            borderColor: '#1976d2',
            backgroundColor: '#1976d222',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        },
        {
            label: 'Influence Parlement',
            data: lobby.infParlementArr,
            borderColor: '#388e3c',
            backgroundColor: '#388e3c22',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        },
        {
            label: 'Influence Commission',
            data: lobby.infCommissionArr,
            borderColor: '#f57c00',
            backgroundColor: '#f57c0022',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        }
    ];

    createOrUpdateChart('lobbyChart', 'line', {
        labels: simulationYears,
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
                max: 100
            }
        }
    });

    // Afficher le score
    showLobbyScore(lobby);
}

/**
 * Affiche les détails du score pour le lobby sélectionné.
 * @param {object} lobby - L'objet du lobby avec ses données de simulation.
 */
function showLobbyScore(lobby) {
    const scoreDiv = document.getElementById('lobbyScore');
    if (!scoreDiv) {
        console.error("Element 'lobbyScore' non trouvé.");
        return;
    }

    const lastYearIndex = simulationYears.length - 1;

    if (lobby.scoreDeReussite !== undefined && lobby.reputationArr?.length > lastYearIndex) {
        scoreDiv.innerHTML = `
            <h3>Score de Réussite: ${Math.round(lobby.scoreDeReussite)}%</h3>
            <div>Réputation Finale: ${lobby.reputationArr[lastYearIndex].toFixed(2)}</div>
            <div>Influence États Finale: ${lobby.infEtatsArr[lastYearIndex].toFixed(2)}</div>
            <div>Influence Parlement Finale: ${lobby.infParlementArr[lastYearIndex].toFixed(2)}</div>
            <div>Influence Commission Finale: ${lobby.infCommissionArr[lastYearIndex].toFixed(2)}</div>
        `;
    } else {
        scoreDiv.innerHTML = `<p>Données de score non disponibles.</p>`;
    }
}