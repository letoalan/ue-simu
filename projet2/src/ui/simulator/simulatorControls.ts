import type { Directive } from '../../domain/types';
import { INDICATORS_META } from '../../domain/indicators';
import { isFinanceUnlocked } from '../../state/store';

/**
 * Rendu du bloc des curseurs de politiques publiques et du score de réussite synthétique
 */
export function renderSimulatorControls(
  state: any,
  _selectedDirective: Directive | null,
  sim: any
): string {
  const isScenario1 = state.scenarioId === 1;
  const scoreSuccesGlobal = sim?.euScoreSucces ?? sim?.scoreSuccesGlobal ?? 0;
  const agreement = state.financialAgreement;

  const isVoteFinalized = isFinanceUnlocked(state);

  const financeBannerHtml = agreement?.adopted
    ? `<div class="card" style="padding:10px 14px; background:linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border-left:4px solid var(--color-success); margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.85rem; font-weight:700; color:#065f46;">💶 Fonds Communautaire Actif</span>
          <span class="badge" style="background:#059669; color:#fff; font-size:0.75rem;">Palier ${agreement.tier} • ${Math.round(agreement.coverageRatio * 100)}%</span>
        </div>
        <p style="font-size:0.78rem; color:#047857; margin:4px 0 0 0;">
          Enveloppe : <b>${agreement.envelope} Mds €</b> (Cofinancement ${Math.round(agreement.coFinancingRate * 100)}%)
        </p>
      </div>`
    : `<div class="card" style="padding:10px 14px; background:#f8fafc; border-left:4px solid var(--color-border); margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.82rem; font-weight:600; color:var(--color-text-muted);">
            🛡️ Moyens nationaux seuls ${!isVoteFinalized ? '(Vote non finalisé)' : ''}
          </span>
          ${!isVoteFinalized
            ? `<button class="btn btn-secondary btn-sm" id="btnSimGoToVote" style="padding:2px 8px; font-size:0.75rem;">Voter 🗳️</button>`
            : `<button class="btn btn-secondary btn-sm" id="btnSimGoToFinance" style="padding:2px 8px; font-size:0.75rem;">Négocier 💶</button>`
          }
        </div>
      </div>`;

  const controlKeys = isScenario1
    ? [
        { key: 'pib_eu', step: '0.1' },
        { key: 'gini_eu', step: '0.01' },
        { key: 'co2_eu', step: '0.1' },
        { key: 'veb_eu', step: '1' }
      ]
    : [
        { key: 'normandie_eu', step: '0.1' },
        { key: 'vdem_eu', step: '0.01' },
        { key: 'pib_growth_eu', step: '0.1' },
        { key: 'idh_eu', step: '0.01' }
      ];

  return `
    ${financeBannerHtml}

    <!-- Carte KPI du Score de Réussite -->
    <div class="kpi-card">
      <span class="kpi-title">Score de Réussite Global de l'UE</span>
      <div class="kpi-score">${scoreSuccesGlobal}<span style="font-size: 1.4rem;">/100</span></div>
      <span class="kpi-subtext">
        Moyenne pondérée des scores nationaux (démographie), parlementaires et sectoriels.
      </span>
    </div>

    <!-- Paramètres et Curseurs -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Curseurs de Politique Publique</h2>
        <span class="badge badge-commission">Horizon 2034</span>
      </div>
      
      <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 16px;">
        Ajustez les valeurs de départ de l'Union européenne pour observer les impacts en cascade :
      </p>

      <div class="controls-grid" style="display: flex; flex-direction: column; gap: 14px;">
        ${controlKeys.map(({ key, step }) => {
          const meta = (INDICATORS_META as any)[key];
          if (!meta) return '';
          const currentValue = state.inputs[key] ?? meta.min;

          return `
            <div class="form-group" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <label class="form-label" for="slider-${key}">
                  ${meta.name} (${meta.unit})
                </label>
                <b id="val-${key}" style="font-family: var(--font-mono); color: var(--color-primary);">
                  ${Number(currentValue).toFixed(step.includes('.') ? step.split('.')[1].length : 0)}
                </b>
              </div>
              <input 
                type="range" 
                id="slider-${key}" 
                class="form-range" 
                min="${meta.min}" 
                max="${meta.max}" 
                step="${step}" 
                value="${currentValue}"
                data-key="${key}"
              />
            </div>
          `;
        }).join('')}
      </div>

      <!-- Contrôles avancés (Graine PRNG) -->
      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 0.85rem; color: var(--color-text-muted);">
          Graine de simulation (PRNG) : <b>#${state.seed}</b>
        </div>
        <button class="btn btn-secondary btn-sm" id="btnRerollSeed" style="padding: 4px 10px; font-size: 0.8rem;">
          🎲 Aléas
        </button>
      </div>
    </div>
  `;
}
