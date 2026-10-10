import {
  Chart,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Enregistrement global des composants Chart.js requis
Chart.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Registre des instances pour destruction propre avant re-rendu
const chartRegistry: Map<string, Chart> = new Map();

export function destroyChart(canvasId: string): void {
  if (chartRegistry.has(canvasId)) {
    chartRegistry.get(canvasId)?.destroy();
    chartRegistry.delete(canvasId);
  }
}

export function registerChart(canvasId: string, instance: Chart): void {
  chartRegistry.set(canvasId, instance);
}
