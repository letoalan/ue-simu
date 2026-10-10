import { Chart } from 'chart.js';
import type { SimulationResult, PartyCode, LobbyCode } from '../../domain/types';
import { destroyChart, registerChart } from './chartBase';

/**
 * Graphique de la dynamique des groupes politiques au Parlement
 */
export function renderPartyChart(
  canvasId: string,
  result: SimulationResult,
  party: PartyCode
): Chart | null {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const years = result.years.map(String);
  const pData = result.parties[party];
  if (!pData) return null;

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Sièges au Parlement',
          data: pData.mepsArr,
          backgroundColor: pData.couleur || '#2563eb',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: `${pData.nom} — Projection des sièges (MEPs)` }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Sièges' }
        }
      }
    }
  });

  registerChart(canvasId, chart);
  return chart;
}

/**
 * Graphique de l'influence des groupes d'intérêt et lobbies
 */
export function renderLobbyChart(
  canvasId: string,
  result: SimulationResult,
  lobby: LobbyCode
): Chart | null {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const years = result.years.map(String);
  const lData = result.lobbies[lobby];
  if (!lData) return null;

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Réputation',
          data: lData.reputationArr,
          borderColor: '#2563eb',
          tension: 0.2
        },
        {
          label: 'Influence États',
          data: lData.infEtatsArr,
          borderColor: '#d97706',
          borderWidth: 1.5,
          borderDash: [5, 5]
        },
        {
          label: 'Influence Parlement',
          data: lData.infParlementArr,
          borderColor: '#7c3aed',
          borderWidth: 1.5,
          borderDash: [5, 5]
        },
        {
          label: 'Influence Commission',
          data: lData.infCommissionArr,
          borderColor: '#047857',
          borderWidth: 1.5,
          borderDash: [3, 3]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } },
        title: { display: true, text: `${lData.nom} — Trajectoire d'influence` }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          title: { display: true, text: 'Score (0-100)' }
        }
      }
    }
  });

  registerChart(canvasId, chart);
  return chart;
}
