/* ===========================================================
   chronology/3-main/simulator/charts/index.js
   Chart.js – toutes les fonctions de tracé
   =========================================================== */

import { state } from '../../../../state/index.js';

/* ------------------------------------------------------------
   Fonction utilitaire – cycle de vie Chart.js
------------------------------------------------------------ */
export function createOrUpdateChart(chartId, type, data, options) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    if (window.charts?.[chartId]) window.charts[chartId].destroy();

    const chart = new Chart(ctx, { type, data, options });
    (window.charts ||= {})[chartId] = chart;
    return chart;
}

/* ------------------------------------------------------------
   1.  EU
------------------------------------------------------------ */
export function plotEU(years, data, scenario) {
    const datasets = scenario === 1
        ? [
            { label: 'Croissance (%)',  data: data.arr1, borderColor: '#1976d2', yAxisID: 'y3' },
            { label: 'Gini',            data: data.arr2, borderColor: '#ff9800', yAxisID: 'y2' },
            { label: 'CO₂/hab (t)',     data: data.arr3, borderColor: '#388e3c', yAxisID: 'y3' },
            { label: 'VEB',             data: data.arr4, borderColor: '#8e24aa', yAxisID: 'y'  },
            { label: 'Satisfaction (0-1)', data: data.satisArr, borderColor: '#d32f2f', yAxisID: 'y2' }
        ]
        : [
            { label: 'Croissance (%)',  data: data.arr1, borderColor: '#1976d2', yAxisID: 'y3' },
            { label: 'Normandie',       data: data.arr2, borderColor: '#ff9800', yAxisID: 'y'  },
            { label: 'V-Dem',           data: data.arr3, borderColor: '#388e3c', yAxisID: 'y2' },
            { label: 'IDH',             data: data.arr4, borderColor: '#8e24aa', yAxisID: 'y2' },
            { label: 'Satisfaction (0-1)', data: data.satisArr, borderColor: '#d32f2f', yAxisID: 'y2' }
        ];

    createOrUpdateChart('euChart', 'line', {
        labels: years,
        datasets
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
    });
}

/* ------------------------------------------------------------
   2.  Pays
------------------------------------------------------------ */
export function plotCountry(years, data, scenario) {
    const country = state.EU_STATES_DATA.find(s => s.code === state.get.currentCountry());
    if (!country) return;

    plotEU(years, data, scenario); // même structure, titre adapté
    const chart = window.charts.countryChart;
    if (chart) chart.options.plugins.title.text = `Évolution – ${country.name}`;
}

/* ------------------------------------------------------------
   3.  Partis
------------------------------------------------------------ */
export function plotPolitique(years, data, parti) {
    const p = state.POLITICAL_PARTIES_DATA.find(p => p.code === state.get.currentParti());
    if (!p) return;

    const datasets = [
        { label: 'Députés',            data: parti.mepsArr,        borderColor: p.color,  stepped: true },
        { label: 'Commissaires',       data: parti.commissairesArr, borderColor: '#888',   stepped: true },
        { label: 'Conseil (% États)',  data: parti.conseilArr,    borderColor: '#1976d2', stepped: true },
        { label: 'Présidence (%)',     data: parti.presArr,       borderColor: '#FFD700', stepped: true },
        { label: 'Satisfaction (%)',   data: parti.satisfactionArr, borderColor: '#d32f2f' }
    ];

    createOrUpdateChart('politiqueChart', 'line', {
        labels: years,
        datasets
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: `Projections – ${p.name}` } }
    });
}

/* ------------------------------------------------------------
   4.  Lobbies
------------------------------------------------------------ */
export function plotLobby(years, data, lobby) {
    const l = state.LOBBY_GROUPS_DATA.find(l => l.code === state.get.currentLobby());
    if (!l) return;

    const datasets = [
        { label: 'Réputation',         data: lobby.reputationArr,   borderColor: '#9c27b0' },
        { label: 'Influence États',    data: lobby.infEtatsArr,     borderColor: '#1976d2' },
        { label: 'Influence Parlement',data: lobby.infParlementArr, borderColor: '#388e3c' },
        { label: 'Influence Commission', data: lobby.infCommissionArr, borderColor: '#f57c00' }
    ];

    createOrUpdateChart('lobbyChart', 'line', {
        labels: years,
        datasets
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: `Évolution – ${l.name}` } },
        scales: { y: { beginAtZero: true, max: 100 } }
    });
}