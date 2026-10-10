import { Chart } from 'chart.js';
import type { SimulationResult, CountryCode } from '../../domain/types';
import { COUNTRIES_PROFILES } from '../../data/countries';
import { destroyChart, registerChart } from './chartBase';

/**
 * Graphique de la réaction d'un État Membre (haute lisibilité)
 */
export function renderCountryChart(
  canvasId: string,
  result: SimulationResult,
  country: CountryCode
): Chart | null {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const years = result.years.map(String);
  const countryData = result.countries[country];
  if (!countryData) return null;

  const isS1 = result.scenarioId === 1;
  const common = { borderWidth: 2.8, tension: 0.25, pointRadius: 2.5, pointHoverRadius: 6 };

  const datasets = isS1
    ? [
        { label: 'Croissance (%)', data: countryData.series.croiss, borderColor: '#2563eb', ...common },
        { label: 'Inégalités Gini (×10)', data: countryData.series.gini.map(v => v * 10), borderColor: '#eab308', ...common },
        { label: 'CO₂ (t/hab)', data: countryData.series.co2, borderColor: '#ef4444', ...common },
        { label: 'Bien-être VEB (/10)', data: countryData.series.veb.map(v => v / 10), borderColor: '#10b981', ...common }
      ]
    : [
        { label: 'Normandie (/10)', data: countryData.series.normandie.map(v => v / 10), borderColor: '#0284c7', ...common },
        { label: 'V-Dem (×10)', data: countryData.series.vdem.map(v => v * 10), borderColor: '#8b5cf6', ...common },
        { label: 'PIB (%)', data: countryData.series.pib, borderColor: '#2563eb', ...common },
        { label: 'IDH (×10)', data: countryData.series.idh.map(v => v * 10), borderColor: '#10b981', ...common }
      ];

  const prof = COUNTRIES_PROFILES[country];
  const netGain = countryData.netGainVsReference !== undefined ? Math.round(countryData.netGainVsReference * 100) : 0;

  const chart = new Chart(canvas, {
    type: 'line',
    data: { labels: years, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11, weight: 600 } } },
        title: {
          display: true,
          text: `${prof ? prof.name : country} — Score : ${countryData.scoreSucces}/100 (Gain net : ${netGain >= 0 ? '+' : ''}${netGain}%)`,
          font: { size: 12, weight: 700 }
        },
        tooltip: {
          padding: 8,
          cornerRadius: 6,
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(2)}`
          }
        }
      },
      scales: {
        y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.06)' } },
        x: { grid: { display: false } }
      }
    }
  });

  registerChart(canvasId, chart);
  return chart;
}
