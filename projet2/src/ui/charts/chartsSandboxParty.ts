import { Chart } from 'chart.js';
import type { PartyCode } from '../../domain/types';
import type { SandboxComparisonResult } from '../../simulation/sandboxEngine';
import { destroyChart, registerChart } from './chartBase';

/**
 * Rendu spécifique du graphique de satisfaction d'un parti politique dans la Sandbox.
 * Affiche la courbe de référence vs courbe amendée de 2025 à 2034.
 */
export function renderSandboxPartySatisfactionChart(
  canvasId: string,
  comparison: SandboxComparisonResult,
  partyCode: PartyCode
): Chart | null {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const { baselineResult, amendedResult } = comparison;
  const years = baselineResult.years.map(String);
  const pKey = partyCode as keyof typeof baselineResult.parties;

  const baseSat = baselineResult.parties[pKey]?.satisfactionArr || [];
  const amdSat = amendedResult.parties[pKey]?.satisfactionArr || [];

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Satisfaction [Réf.]',
          data: baseSat,
          borderColor: 'rgba(148, 163, 184, 0.85)',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 0,
          tension: 0.25,
          fill: false
        },
        {
          label: 'Satisfaction [Amendé]',
          data: amdSat,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0.25,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: `Satisfaction du groupe ${partyCode} (2025-2034)`,
          font: { size: 12, weight: 'bold' }
        },
        legend: {
          position: 'top',
          labels: {
            boxWidth: 16,
            usePointStyle: true,
            font: { size: 11, weight: 'bold' }
          }
        },
        tooltip: {
          padding: 8,
          boxPadding: 4,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${Math.round(ctx.parsed.y ?? 0)}%`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            callback: (v) => `${v}%`,
            stepSize: 25
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  registerChart(canvasId, chart);
  return chart;
}
