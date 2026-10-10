import { store } from '../../state/store';
import { renderEUChart, renderCountryChart } from '../charts/charts';
import { renderHemicycle } from '../charts/hemicycleChart';
import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { openPedagogyModal } from '../pedagogy/pedagogyModal';
import type { CountryCode, PartyCode } from '../../domain/types';

let isPresentationModeActive = false;
let presSecondView: 'country' | 'parliament' = 'country';

export function isPresentationMode(): boolean {
  return isPresentationModeActive;
}

export function togglePresentationMode(): void {
  isPresentationModeActive = !isPresentationModeActive;
  renderPresentationOverlay();
}

store.subscribe(() => {
  if (isPresentationModeActive) renderPresentationOverlay();
});

export function renderPresentationOverlay(): void {
  const existing = document.getElementById('presentationOverlay');
  if (!isPresentationModeActive) {
    if (existing) existing.remove();
    document.body.classList.remove('presentation-mode-active');
    return;
  }

  document.body.classList.add('presentation-mode-active');
  const state = store.getState();
  const sim = state.simulationResult;
  const isS1 = state.scenarioId === 1;
  const directiveNom = state.selectedDirective?.nom ?? (isS1 ? 'Pacte vert innovant' : 'Initiative sécurité');

  let overlay = existing;
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'presentationOverlay';
    overlay.className = 'presentation-overlay';
    document.body.appendChild(overlay);
  }

  const scoreUE = sim.euScoreSucces;
  const gainNet = sim.euNetGainVsReference !== undefined ? Math.round(sim.euNetGainVsReference * 100) : 0;
  const satFin = Math.round((sim.euSatisfaction[9] ?? 0.5) * 100);

  overlay.innerHTML = `
    <div class="presentation-inner">
      <div class="presentation-header">
        <div>
          <span class="badge badge-commission" style="font-size: 0.85rem;">📽️ Mode Projection Classe</span>
          <h1 style="font-size: 1.5rem; font-weight: 900; margin: 4px 0; color: var(--color-primary);">
            Directive : ${directiveNom}
          </h1>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn btn-secondary btn-sm" id="btnPresPedagogy" style="font-weight: 700;">
            💡 Décrypter
          </button>
          <button class="btn btn-danger btn-sm" id="btnExitPresentation" style="font-weight: 700;">
            ✕ Quitter la Présentation
          </button>
        </div>
      </div>

      <div class="presentation-kpi-bar">
        <div class="pres-kpi-item">
          <span class="pres-kpi-label">Score de Réussite Global UE</span>
          <span class="pres-kpi-val" style="color: var(--color-primary);">${scoreUE} / 100</span>
        </div>
        <div class="pres-kpi-item">
          <span class="pres-kpi-label">Satisfaction Européenne (2034)</span>
          <span class="pres-kpi-val" style="color: var(--color-success);">${satFin} %</span>
        </div>
        <div class="pres-kpi-item">
          <span class="pres-kpi-label">Gain Net face au Statu Quo</span>
          <span class="pres-kpi-val" style="color: ${gainNet >= 0 ? '#16a34a' : '#dc2626'};">
            ${gainNet >= 0 ? '+' : ''}${gainNet} %
          </span>
        </div>
      </div>

      <div class="presentation-charts-grid">
        <div class="card presentation-chart-card">
          <h2 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 8px;">
            1. Trajectoire Globale de l'Union (Moyenne Pondérée 266M hab)
          </h2>
          <div style="flex: 1; min-height: 280px; position: relative;">
            <canvas id="presChartEU"></canvas>
          </div>
        </div>

        <div class="card presentation-chart-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="btn btn-sm ${presSecondView === 'country' ? 'btn-primary' : 'btn-secondary'}" id="btnPresViewCountry" style="padding: 2px 8px; font-size: 0.8rem;">
                🏛️ Zoom Pays
              </button>
              <button class="btn btn-sm ${presSecondView === 'parliament' ? 'btn-primary' : 'btn-secondary'}" id="btnPresViewParl" style="padding: 2px 8px; font-size: 0.8rem;">
                🇪🇺 Hémicycle (720s)
              </button>
            </div>
            ${presSecondView === 'country' ? `
              <select class="form-select form-select-sm" id="selectPresCountry" style="width: auto; font-weight: 700;">
                ${Object.values(COUNTRIES_META).map(c => `
                  <option value="${c.code}" ${state.selectedCountry === c.code ? 'selected' : ''}>
                    ${c.name} (${c.population} M hab)
                  </option>
                `).join('')}
              </select>
            ` : `
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">Majorité : 361 sièges</span>
            `}
          </div>
          <div style="flex: 1; min-height: 280px; position: relative; display: flex; align-items: center; justify-content: center;">
            ${presSecondView === 'country' ? '<canvas id="presChartCountry"></canvas>' : '<div id="presHemicycle" style="width: 100%;"></div>'}
          </div>
        </div>
      </div>

      <div class="presentation-toolbar">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted);">Contrôles directs :</span>
          <select class="form-select form-select-sm" id="selectPresParty" style="width: auto;">
            ${Object.values(PARTIES_PROFILES).map(p => `
              <option value="${p.code}" ${state.selectedParty === p.code ? 'selected' : ''}>
                ${p.code} — ${p.nom.split('(')[0].trim()}
              </option>
            `).join('')}
          </select>
          <button class="btn btn-secondary btn-sm" id="btnPresSeed">
            🎲 Aléa PRNG (#${state.seed})
          </button>
        </div>
      </div>
    </div>
  `;

  renderEUChart('presChartEU', sim);
  if (presSecondView === 'country') {
    renderCountryChart('presChartCountry', sim, state.selectedCountry);
  } else {
    renderHemicycle('presHemicycle', sim, state.selectedParty);
  }

  attachPresentationEvents(overlay);
}

function attachPresentationEvents(overlay: HTMLElement): void {
  overlay.querySelector('#btnExitPresentation')?.addEventListener('click', togglePresentationMode);
  overlay.querySelector('#btnPresPedagogy')?.addEventListener('click', () => openPedagogyModal(presSecondView === 'country' ? 'eu' : 'party'));

  overlay.querySelector('#btnPresViewCountry')?.addEventListener('click', () => {
    presSecondView = 'country';
    renderPresentationOverlay();
  });
  overlay.querySelector('#btnPresViewParl')?.addEventListener('click', () => {
    presSecondView = 'parliament';
    renderPresentationOverlay();
  });

  overlay.querySelector('#selectPresCountry')?.addEventListener('change', (e) => {
    store.selectCountry((e.target as HTMLSelectElement).value as CountryCode);
    renderPresentationOverlay();
  });

  overlay.querySelector('#selectPresParty')?.addEventListener('change', (e) => {
    store.selectParty((e.target as HTMLSelectElement).value as PartyCode);
    renderPresentationOverlay();
  });

  overlay.querySelector('#btnPresSeed')?.addEventListener('click', () => {
    store.setSeed(Math.floor(Math.random() * 10000));
    renderPresentationOverlay();
  });
}
