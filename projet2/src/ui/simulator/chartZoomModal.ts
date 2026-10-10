import { store } from '../../state/store';
import { renderEUChart, renderCountryChart, renderLobbyChart } from '../charts/charts';
import { renderHemicycle } from '../charts/hemicycleChart';
import { openPedagogyModal } from '../pedagogy/pedagogyModal';

let activeZoomChartKey: string | null = null;

store.subscribe(() => {
  if (activeZoomChartKey) {
    const state = store.getState();
    const sim = state.simulationResult;
    renderZoomChartCanvas(activeZoomChartKey, sim, state);
  }
});

export function openChartZoomModal(chartKey: 'eu' | 'country' | 'party' | 'lobby'): void {
  activeZoomChartKey = chartKey;
  const state = store.getState();
  const sim = state.simulationResult;

  const existing = document.getElementById('chartZoomModal');
  if (existing) existing.remove();

  const titleMap = {
    eu: "Trajectoire Globale de l'Union Européenne (Zoom Haute Résolution)",
    country: `Trajectoire Nationale : ${sim.countries[state.selectedCountry]?.name || state.selectedCountry}`,
    party: `Hémicycle du Parlement Européen (720 Sièges)`,
    lobby: `Groupe d'Intérêt : ${sim.lobbies[state.selectedLobby]?.nom || state.selectedLobby}`
  };

  const modal = document.createElement('div');
  modal.id = 'chartZoomModal';
  modal.className = 'modal-overlay zoom-modal-overlay';
  modal.innerHTML = `
    <div class="modal-content zoom-modal-content" style="max-width: 920px; width: 95vw; height: 90vh; max-height: 90vh; display: flex; flex-direction: column; padding: 20px; border-radius: var(--radius-lg);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; gap: 12px; flex-shrink: 0;">
        <div>
          <span class="badge badge-commission" style="font-size: 0.75rem;">Mode Zoom 2025-2034</span>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary); margin: 4px 0 0 0;">
            🔍 ${titleMap[chartKey]}
          </h2>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" id="btnZoomPedagogy" style="font-weight: 600;">
            💡 Décrypter
          </button>
          <button class="btn btn-secondary btn-sm" id="btnCloseZoomModal" style="min-height: 36px; min-width: 36px; padding: 4px; border-radius: 50%; font-size: 1.1rem;" aria-label="Fermer le zoom">
            ✕
          </button>
        </div>
      </div>

      <div style="flex: 1; min-height: 280px; position: relative; margin: 12px 0; display: flex; align-items: center; justify-content: center;">
        ${chartKey === 'party' ? '<div id="zoomHemicycle" style="width: 100%;"></div>' : '<canvas id="zoomCanvas"></canvas>'}
      </div>

      <div style="border-top: 1px solid var(--color-border); padding-top: 8px; flex-shrink: 0; overflow-x: auto;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-muted); display: block; margin-bottom: 4px;">
          Progression annuelle & Répartition détaillée :
        </span>
        ${renderZoomDataTable(chartKey, sim, state)}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  renderZoomChartCanvas(chartKey, sim, state);

  const close = () => {
    activeZoomChartKey = null;
    modal.remove();
  };
  modal.querySelector('#btnCloseZoomModal')?.addEventListener('click', close);
  modal.querySelector('#btnZoomPedagogy')?.addEventListener('click', () => openPedagogyModal(chartKey));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
  };
  document.addEventListener('keydown', onKey);
}

function renderZoomChartCanvas(chartKey: string, sim: any, state: any): void {
  if (chartKey === 'eu') renderEUChart('zoomCanvas', sim);
  else if (chartKey === 'country') renderCountryChart('zoomCanvas', sim, state.selectedCountry);
  else if (chartKey === 'party') renderHemicycle('zoomHemicycle', sim, state.selectedParty);
  else if (chartKey === 'lobby') renderLobbyChart('zoomCanvas', sim, state.selectedLobby);
}

function renderZoomDataTable(chartKey: string, sim: any, state: any): string {
  if (chartKey === 'party' && sim.parliament) {
    const groups = sim.parliament.groupList;
    return `
      <table class="table" style="font-size: 0.78rem; margin: 0; text-align: center;">
        <thead>
          <tr>
            <th style="text-align: left;">Groupe</th>
            <th>2025 (Départ)</th>
            <th>2034 (Projeté)</th>
            <th>Évolution</th>
            <th>Part de l'Hémicycle</th>
          </tr>
        </thead>
        <tbody>
          ${groups.map((g: any) => `
            <tr style="${g.code === state.selectedParty ? 'background: var(--color-surface-hover); font-weight: 700;' : ''}">
              <td style="text-align: left; display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${g.couleur}; display: inline-block;"></span>
                ${g.nom}
              </td>
              <td>${g.baseSeats}</td>
              <td style="font-weight: 800;">${g.currentSeats}</td>
              <td style="color: ${g.delta > 0 ? '#10b981' : g.delta < 0 ? '#ef4444' : '#64748b'}; font-weight: 700;">
                ${g.delta > 0 ? '+' : ''}${g.delta}
              </td>
              <td>${g.percent}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  const years = sim.years;
  if (chartKey === 'eu') {
    const isS1 = sim.scenarioId === 1;
    const series = isS1
      ? [{ label: 'PIB (%)', vals: sim.euSeries.croiss }, { label: 'CO₂ (t)', vals: sim.euSeries.co2 }, { label: 'VEB (/100)', vals: sim.euSeries.veb }, { label: 'Gini', vals: sim.euSeries.gini }]
      : [{ label: 'Normandie', vals: sim.euSeries.normandie }, { label: 'V-Dem', vals: sim.euSeries.vdem }, { label: 'PIB (%)', vals: sim.euSeries.pib }, { label: 'IDH', vals: sim.euSeries.idh }];

    return `
      <table class="table" style="font-size: 0.78rem; margin: 0; text-align: center;">
        <thead>
          <tr>
            <th style="text-align: left;">Série</th>
            ${years.map((y: number) => `<th>${y}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${series.map(s => `
            <tr>
              <td style="text-align: left; font-weight: 700;">${s.label}</td>
              ${(s.vals || []).map((v: number) => `<td>${Number(v).toFixed(2)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  return `<div style="font-size: 0.8rem; color: var(--color-text-muted);">Données synchronisées en temps réel (${years[0]} à ${years[9]}).</div>`;
}
