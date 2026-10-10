import { store } from '../../state/store';
import { renderSimulatorControls } from './simulatorControls';
import {
  renderEUChart,
  renderCountryChart,
  renderLobbyChart,
  generateDataTableHtml
} from '../charts/charts';
import { renderHemicycle } from '../charts/hemicycleChart';
import { openPedagogyModal } from '../pedagogy/pedagogyModal';
import { openChartZoomModal } from './chartZoomModal';
import { togglePresentationMode } from './presentationMode';
import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';
import type { CountryCode, PartyCode, LobbyCode } from '../../domain/types';

export function renderSimulatorView(container: HTMLElement): void {
  const state = store.getState();
  const sim = state.simulationResult;
  const selectedDirective = state.selectedDirective;

  container.innerHTML = `
    <div class="main-layout">
      <!-- Colonne de Contrôles & Synthèse -->
      <div class="grid-2">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${renderSimulatorControls(state, selectedDirective, sim)}
        </div>

        <!-- Graphique Global UE -->
        <div class="card" style="display: flex; flex-direction: column;">
          <div class="card-header" style="flex-wrap: wrap; gap: 8px;">
            <div>
              <h2 class="card-title">Trajectoire Globale de l'Union Européenne</h2>
              <span style="font-size: 0.8rem; color: var(--color-text-muted);">Moyennes pondérées 2025-2034</span>
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="btn btn-primary btn-sm" id="btnTogglePresentation" title="Mode vidéoprojecteur pour la classe">
                📽️ Présentation
              </button>
              <button class="btn btn-secondary btn-sm btn-zoom" data-chart="eu" title="Agrandir ce graphique">
                🔍 Zoom
              </button>
              <button class="btn btn-secondary btn-sm btn-pedagogy" data-chart="eu">
                💡 Décrypter
              </button>
            </div>
          </div>
          <div class="chart-wrapper">
            <canvas id="chartEU"></canvas>
          </div>
        </div>
      </div>

      <!-- Grille des 3 Acteurs Clés (Pays, Parlement, Lobby) -->
      <div class="grid-3">
        <!-- 1. État Membre du Conseil -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title" style="font-size: 1rem;">1. État Membre (Conseil)</h3>
              <select class="form-select form-select-sm" id="selectCountry" style="margin-top: 4px; padding: 4px 8px; font-size: 0.85rem;">
                ${Object.values(COUNTRIES_META).map(c => `
                  <option value="${c.code}" ${state.selectedCountry === c.code ? 'selected' : ''}>
                    ${c.name} (${c.population} M hab)
                  </option>
                `).join('')}
              </select>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-secondary btn-sm btn-zoom" data-chart="country" title="Agrandir">🔍</button>
              <button class="btn btn-secondary btn-sm btn-pedagogy" data-chart="country" title="Décrypter">💡</button>
            </div>
          </div>
          <div class="chart-wrapper" style="height: 240px;">
            <canvas id="chartCountry"></canvas>
          </div>
        </div>

        <!-- 2. Hémicycle du Parlement Européen (720 Sièges) -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title" style="font-size: 1rem;">2. Parlement Européen (720 sièges)</h3>
              <select class="form-select form-select-sm" id="selectParty" style="margin-top: 4px; padding: 4px 8px; font-size: 0.85rem;">
                ${Object.values(PARTIES_PROFILES).map(p => `
                  <option value="${p.code}" ${state.selectedParty === p.code ? 'selected' : ''}>
                    ${p.code} — ${p.nom.split('(')[0].trim()}
                  </option>
                `).join('')}
              </select>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-secondary btn-sm btn-zoom" data-chart="party" title="Agrandir">🔍</button>
              <button class="btn btn-secondary btn-sm btn-pedagogy" data-chart="party" title="Décrypter">💡</button>
            </div>
          </div>
          <div id="hemicycleContainer" style="width: 100%; min-height: 240px; display: flex; align-items: center; justify-content: center;"></div>
        </div>

        <!-- 3. Lobby & Société Civile -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title" style="font-size: 1rem;">3. Lobby Sectoriel</h3>
              <select class="form-select form-select-sm" id="selectLobby" style="margin-top: 4px; padding: 4px 8px; font-size: 0.85rem;">
                ${Object.values(LOBBIES_PROFILES).map(l => `
                  <option value="${l.code}" ${state.selectedLobby === l.code ? 'selected' : ''}>
                    ${l.nom}
                  </option>
                `).join('')}
              </select>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-secondary btn-sm btn-zoom" data-chart="lobby" title="Agrandir">🔍</button>
              <button class="btn btn-secondary btn-sm btn-pedagogy" data-chart="lobby" title="Décrypter">💡</button>
            </div>
          </div>
          <div class="chart-wrapper" style="height: 240px;">
            <canvas id="chartLobby"></canvas>
          </div>
        </div>
      </div>

      <!-- Données Numériques Détaillées -->
      <div class="card">
        <details>
          <summary style="font-weight: 700; cursor: pointer; color: var(--color-primary); padding: 4px 0;">
            📊 Voir le tableau des données brutes de simulation (2025-2034)
          </summary>
          <div style="margin-top: 14px;">
            ${generateDataTableHtml(sim)}
          </div>
        </details>
      </div>
    </div>
  `;

  renderEUChart('chartEU', sim);
  renderCountryChart('chartCountry', sim, state.selectedCountry);
  renderHemicycle('hemicycleContainer', sim, state.selectedParty);
  renderLobbyChart('chartLobby', sim, state.selectedLobby);

  attachSimulatorEvents(container);
}

function attachSimulatorEvents(container: HTMLElement): void {
  container.querySelectorAll('.form-range').forEach(input => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const key = target.getAttribute('data-key');
      const val = parseFloat(target.value);
      if (key) {
        const valLabel = container.querySelector(`#val-${key}`);
        if (valLabel) valLabel.textContent = val.toFixed(target.step.includes('.') ? target.step.split('.')[1].length : 0);
        store.updateInput(key, val);
      }
    });
  });

  container.querySelector('#selectCountry')?.addEventListener('change', (e) => store.selectCountry((e.target as HTMLSelectElement).value as CountryCode));
  container.querySelector('#selectParty')?.addEventListener('change', (e) => store.selectParty((e.target as HTMLSelectElement).value as PartyCode));
  container.querySelector('#selectLobby')?.addEventListener('change', (e) => store.selectLobby((e.target as HTMLSelectElement).value as LobbyCode));
  container.querySelector('#btnRerollSeed')?.addEventListener('click', () => store.setSeed(Math.floor(Math.random() * 10000)));
  container.querySelector('#btnTogglePresentation')?.addEventListener('click', () => togglePresentationMode());
  container.querySelector('#btnSimGoToFinance')?.addEventListener('click', async () => {
    await store.initFinance();
    store.setActiveTab('finance');
  });
  container.querySelector('#btnSimGoToVote')?.addEventListener('click', () => {
    store.setActiveTab('vote');
  });

  container.querySelectorAll('.btn-pedagogy').forEach(btn => {
    btn.addEventListener('click', () => {
      const chartKey = btn.getAttribute('data-chart') as any;
      if (chartKey) openPedagogyModal(chartKey);
    });
  });

  container.querySelectorAll('.btn-zoom').forEach(btn => {
    btn.addEventListener('click', () => {
      const chartKey = btn.getAttribute('data-chart') as any;
      if (chartKey) openChartZoomModal(chartKey);
    });
  });
}
