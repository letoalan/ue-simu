import { Chart } from 'chart.js';
import type { SandboxComparisonResult, SandboxScope } from '../../simulation/sandboxEngine';
import { destroyChart, registerChart } from './chartBase';
import { buildSandboxChartPayload, type MetricDef } from './chartsSandboxDatasets';

export { buildSandboxChartPayload, type MetricDef };

/**
 * Rendu du graphique comparatif Chart.js (Baseline en tirets vs Sandbox amendée en plein)
 * Supporte la vue UE Globale ou les acteurs spécifiques (États, Partis, Lobbies).
 */
export function renderSandboxComparisonChart(
  canvasId: string,
  comparison: SandboxComparisonResult,
  scope: SandboxScope = { actorType: 'eu', countryCode: 'FR', partyCode: 'PPE', lobbyCode: 'BIG_TECH' },
  focusMetric: string = 'all'
): Chart | null {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const { baselineResult } = comparison;
  const years = baselineResult.years.map(String);
  const { title: chartTitle, metrics } = buildSandboxChartPayload(comparison, scope);

  const activeMetrics = focusMetric === 'all'
    ? metrics
    : metrics.filter(m => m.key === focusMetric);

  const datasets: any[] = [];

  for (const m of activeMetrics) {
    // Courbe de référence (initiale)
    datasets.push({
      label: `${m.label} [Réf.]`,
      data: m.baseData,
      borderColor: 'rgba(148, 163, 184, 0.85)',
      borderWidth: 2,
      borderDash: [5, 4],
      pointRadius: 0,
      tension: 0.25,
      fill: false
    });

    // Courbe amendée (sandbox)
    datasets.push({
      label: `${m.label} [Amendé]`,
      data: m.amdData,
      borderColor: m.color,
      backgroundColor: focusMetric !== 'all' ? `${m.color}15` : 'transparent',
      borderWidth: 3.2,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.25,
      fill: focusMetric !== 'all'
    });
  }

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: years,
      datasets
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
          text: chartTitle,
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
          padding: 10,
          boxPadding: 4,
          usePointStyle: true
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  registerChart(canvasId, chart);
  return chart;
}
