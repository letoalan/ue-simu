import type { SimulationResult } from '../../domain/types';

/**
 * 5. Génération du tableau HTML accessible des données de simulation
 */
export function generateDataTableHtml(result: SimulationResult): string {
  const isS1 = result.scenarioId === 1;
  const headers = isS1
    ? ['Année', 'PIB (%)', 'Gini', 'CO₂ (t)', 'VEB (%)']
    : ['Année', 'Normandie', 'V-Dem', 'PIB (%)', 'IDH'];

  let html = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  const s1Croiss = result.euSeries['croiss'] || result.euSeries['pib'] || [];
  const s1Gini = result.euSeries['gini'] || [];
  const s1Co2 = result.euSeries['co2'] || [];
  const s1Veb = result.euSeries['veb'] || [];

  const s2Norm = result.euSeries['normandie'] || [];
  const s2Vdem = result.euSeries['vdem'] || [];
  const s2Pib = result.euSeries['pib'] || [];
  const s2Idh = result.euSeries['idh'] || [];

  result.years.forEach((year, i) => {
    const row = isS1
      ? [
          year,
          (s1Croiss[i] ?? 0).toFixed(2),
          (s1Gini[i] ?? 0).toFixed(3),
          (s1Co2[i] ?? 0).toFixed(2),
          (s1Veb[i] ?? 0).toFixed(1)
        ]
      : [
          year,
          (s2Norm[i] ?? 0).toFixed(2),
          (s2Vdem[i] ?? 0).toFixed(3),
          (s2Pib[i] ?? 0).toFixed(2),
          (s2Idh[i] ?? 0).toFixed(3)
        ];

    html += `
      <tr>
        ${row.map(val => `<td>${val}</td>`).join('')}
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}
