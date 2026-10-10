import { Chart } from 'chart.js';
import type { SimulationResult } from '../../domain/types';
import { destroyChart, registerChart } from './chartBase';

/**
 * 1. Graphique de la trajectoire globale de l'Union Européenne (haute lisibilité)
 */
export function renderEUChart(
  canvasId: string,
  result: SimulationResult
): Chart | null {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const years = result.years.map(String);
  const isS1 = result.scenarioId === 1;
  const common = { borderWidth: 2.8, tension: 0.25, pointRadius: 2.5, pointHoverRadius: 6 };
  let datasets: any[] = [];

  if (isS1) {
    const croiss = result.euSeries['croiss'] || result.euSeries['pib'] || [];
    const gini = result.euSeries['gini'] || [];
    const co2 = result.euSeries['co2'] || [];
    const veb = result.euSeries['veb'] || [];

    datasets = [
      {
        label: 'Croissance PIB (%)',
        data: croiss,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        ...common
      },
      {
        label: 'Inégalités Gini (×10)',
        data: gini.map((v: number) => v * 10),
        borderColor: '#eab308',
        backgroundColor: 'transparent',
        ...common
      },
      {
        label: 'Émissions CO₂ (t/hab)',
        data: co2,
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        ...common
      },
      {
        label: 'Bien-être VEB (/10)',
        data: veb.map((v: number) => v / 10),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        ...common
      }
    ];
  } else {
    const normandie = result.euSeries['normandie'] || [];
    const vdem = result.euSeries['vdem'] || [];
    const pib = result.euSeries['pib'] || [];
    const idh = result.euSeries['idh'] || [];

    datasets = [
      {
        label: 'Indice Normandie Sécurité (/10)',
        data: normandie.map((v: number) => v / 10),
        borderColor: '#0284c7',
        ...common
      },
      {
        label: 'Démocratie V-Dem (×10)',
        data: vdem.map((v: number) => v * 10),
        borderColor: '#8b5cf6',
        ...common
      },
      {
        label: 'Croissance PIB (%)',
        data: pib,
        borderColor: '#2563eb',
        ...common
      },
      {
        label: 'Développement IDH (×10)',
        data: idh.map((v: number) => v * 10),
        borderColor: '#10b981',
        ...common
      }
    ];
  }

  const chart = new Chart(canvas, {
    type: 'line',
    data: { labels: years, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, font: { size: 12, weight: 600 } }
        },
        tooltip: {
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(2)}`
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.06)' },
          title: { display: true, text: 'Échelle normalisée' }
        }
      }
    }
  });

  registerChart(canvasId, chart);
  return chart;
}
