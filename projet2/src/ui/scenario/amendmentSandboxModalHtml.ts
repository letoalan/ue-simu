import type { Directive } from '../../domain/types';
import type { SandboxScope, SandboxComparisonResult, ActorKPISummary } from '../../simulation/sandboxEngine';
import { renderEntitySelectorHtml, renderMetricFilterButtons } from './amendmentSandboxSelectorsHtml';
import { renderSandboxPartySplitHtml } from './amendmentSandboxPartySplitHtml';

export { renderEntitySelectorHtml, renderMetricFilterButtons };

export function renderSandboxModalHtml(
  state: any,
  comparison: SandboxComparisonResult,
  actorSummary: ActorKPISummary,
  currentScope: SandboxScope,
  currentFocusMetric: string,
  directive: Directive
): string {
  const isS1 = state.scenarioId === 1;
  const count = state.selectedAmendments.size;
  const total = directive.amendements?.length || 0;
  const scoreClass = actorSummary.scoreDelta > 0 ? 'positive' : actorSummary.scoreDelta < 0 ? 'negative' : 'neutral';
  const scoreSign = actorSummary.scoreDelta > 0 ? '+' : '';

  return `
    <div class="sandbox-modal-overlay" id="sandboxOverlay">
      <div class="sandbox-modal-content" role="dialog" aria-modal="true" aria-labelledby="sandboxModalTitle">
        <!-- En-tête -->
        <div class="sandbox-modal-header">
          <div class="sandbox-modal-title-box">
            <h2 class="sandbox-modal-title" id="sandboxModalTitle">
              <span>🔬</span>
              <span>Bac à Sable : D${directive.id} — ${directive.nom}</span>
            </h2>
            <div class="sandbox-modal-subtitle">
              ${isS1 ? '🌱 S1 : Climat' : '🛡️ S2 : Géopolitique'}
              • <b>${count}/${total}</b> amendement(s)
              • Cible : <b style="color:var(--color-primary);">${actorSummary.actorName}</b>
            </div>
          </div>
          <button class="audio-close-btn" id="btnSandboxCloseHeader" title="Fermer la modale" aria-label="Fermer">✕</button>
        </div>

        <!-- Corps -->
        <div class="sandbox-modal-body">
          <!-- Sélecteur d'acteurs -->
          <div class="sandbox-actor-selector-bar">
            <div class="sandbox-actor-tabs" role="tablist" aria-label="Échelle de simulation">
              <button class="sandbox-actor-tab ${currentScope.actorType === 'eu' ? 'active' : ''}" data-actor-type="eu" role="tab" aria-selected="${currentScope.actorType === 'eu'}">
                🌐 UE Globale
              </button>
              <button class="sandbox-actor-tab ${currentScope.actorType === 'country' ? 'active' : ''}" data-actor-type="country" role="tab" aria-selected="${currentScope.actorType === 'country'}">
                🌍 États (Conseil)
              </button>
              <button class="sandbox-actor-tab ${currentScope.actorType === 'party' ? 'active' : ''}" data-actor-type="party" role="tab" aria-selected="${currentScope.actorType === 'party'}">
                🇪🇺 Groupes (PE)
              </button>
              <button class="sandbox-actor-tab ${currentScope.actorType === 'lobby' ? 'active' : ''}" data-actor-type="lobby" role="tab" aria-selected="${currentScope.actorType === 'lobby'}">
                💼 Lobbies & Société
              </button>
            </div>

            <div class="sandbox-entity-selector-wrap">
              ${renderEntitySelectorHtml(currentScope)}
            </div>
          </div>

          <!-- Grille des Deltas KPI -->
          <div class="sandbox-kpi-grid">
            ${actorSummary.kpiDeltas.map(kpi => {
              const sign = kpi.delta > 0 ? '+' : '';
              const pillClass = kpi.delta === 0 ? 'neutral' : kpi.isPositiveForEU ? 'positive' : 'negative';
              const arrow = kpi.delta > 0 ? '▲' : kpi.delta < 0 ? '▼' : '•';
              const formattedCurrent = kpi.unit === '%' ? kpi.amendedVal.toFixed(1) : (kpi.unit === 'pts' || kpi.unit === '/100' || kpi.unit === 'sièges') ? Math.round(kpi.amendedVal) : kpi.amendedVal.toFixed(2);
              const formattedBase = kpi.unit === '%' ? kpi.baselineVal.toFixed(1) : (kpi.unit === 'pts' || kpi.unit === '/100' || kpi.unit === 'sièges') ? Math.round(kpi.baselineVal) : kpi.baselineVal.toFixed(2);
              const formattedDelta = kpi.unit === '%' ? (kpi.delta).toFixed(1) : (kpi.unit === 'pts' || kpi.unit === '/100' || kpi.unit === 'sièges') ? Math.round(kpi.delta) : kpi.delta.toFixed(2);

              return `
                <div class="sandbox-kpi-card">
                  <span class="sandbox-kpi-label">${kpi.label}</span>
                  <div class="sandbox-kpi-values">
                    <span class="sandbox-kpi-current">${formattedCurrent} ${kpi.unit}</span>
                    <span class="sandbox-kpi-base" title="Valeur initiale sans amendement">${formattedBase}</span>
                  </div>
                  <span class="sandbox-delta-pill ${pillClass}">
                    ${arrow} ${sign}${formattedDelta} ${kpi.unit}
                  </span>
                </div>
              `;
            }).join('')}

            <div class="sandbox-kpi-card" style="border-left: 3px solid var(--color-primary);">
              <span class="sandbox-kpi-label">${actorSummary.scoreLabel}</span>
              <div class="sandbox-kpi-values">
                <span class="sandbox-kpi-current" style="color:var(--color-primary);">${actorSummary.scoreAmended}/100</span>
                <span class="sandbox-kpi-base" title="Score initial">${actorSummary.scoreBaseline}</span>
              </div>
              <span class="sandbox-delta-pill ${scoreClass}">
                ${actorSummary.scoreDelta > 0 ? '▲' : actorSummary.scoreDelta < 0 ? '▼' : '•'} ${scoreSign}${actorSummary.scoreDelta} pts
              </span>
            </div>
          </div>

          <!-- Section Graphique / Visualisation -->
          ${currentScope.actorType === 'party'
            ? renderSandboxPartySplitHtml(currentScope.partyCode, comparison)
            : `
              <div class="sandbox-chart-section">
                <div class="sandbox-chart-header">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-weight:700; font-size:0.92rem; color:var(--color-text-main);">
                      📈 Trajectoire 2025-2034 (${actorSummary.actorName})
                    </span>
                    <span style="font-size:0.75rem; color:var(--color-text-muted);">
                      (Pointillés : Réf. | Plein : Sandbox)
                    </span>
                  </div>
                  <div class="sandbox-metric-filter-bar" role="group" aria-label="Filtre d'indicateurs">
                    ${renderMetricFilterButtons(currentScope, currentFocusMetric, isS1)}
                  </div>
                </div>
                <div class="sandbox-chart-wrapper">
                  <canvas id="chartSandboxComparison"></canvas>
                </div>
              </div>
            `}

          <!-- Amendements -->
          <div class="sandbox-amendments-section">
            <div class="sandbox-amendments-title">
              <span>Bascule en direct des amendements négociés</span>
              <span style="font-size:0.75rem; color:var(--color-text-muted);">
                Impact instantané sur ${actorSummary.actorName}
              </span>
            </div>
            <div class="sandbox-amendments-grid">
              ${(directive.amendements || []).map(a => {
                const isSelected = state.selectedAmendments.has(a.id);
                return `
                  <label class="sandbox-amendment-item ${isSelected ? 'is-selected' : ''}" for="modal-chk-${a.id}">
                    <input
                      type="checkbox"
                      id="modal-chk-${a.id}"
                      data-modal-amd-id="${a.id}"
                      ${isSelected ? 'checked' : ''}
                      style="accent-color:var(--color-primary); width:16px; height:16px; cursor:pointer;"
                    />
                    <div style="flex:1; overflow:hidden;">
                      <span style="font-weight:700;">${a.id}</span>
                      <span style="color:var(--color-text-muted); font-size:0.78rem;">(${a.origine || a.type})</span> :
                      <span title="${a.description}">${a.description}</span>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <div class="sandbox-modal-footer">
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btnSandboxReset">
              🔄 Rétablir la référence (0 amendement)
            </button>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btnSandboxGoToSimulator">
              📊 Grand Simulateur
            </button>
            <button class="btn btn-primary btn-sm" id="btnSandboxGoToVote">
              🗳️ Conclure et Voter ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
