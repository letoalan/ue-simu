import { COUNTRIES_META } from '../../data/countries';
import type { CountryCode } from '../../domain/types';
import { ALL_COUNTRY_CODES, type VoteChoice, type VoteStepData, type VoteStoreState, type VoteCalculationResult } from '../../state/store';

/**
 * Génère le fragment HTML pour la colonne du Conseil de l'Union Européenne
 */
export function renderCouncilCardHtml(
  calc: VoteCalculationResult,
  step: VoteStepData,
  vState: VoteStoreState
): string {
  return `
    <div class="card legislative-card">
      <div class="card-header" style="margin-bottom:12px; border-bottom:1px solid var(--color-border); padding-bottom:10px;">
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1.2rem;">🏛️</span>
            <h3 class="card-title" style="font-size:1.05rem;">Conseil de l'UE</h3>
          </div>
          <span style="font-size:0.78rem; color:var(--color-text-muted);">${calc.councilRuleText}</span>
        </div>
        <span class="badge ${calc.councilPassed ? 'badge-success-solid' : 'badge-danger-solid'}">
          ${calc.councilPassed ? 'MQ Atteinte' : 'MQ Insuffisante'}
        </span>
      </div>

      <!-- Jauges Conseil : Double seuil de Majorité Qualifiée -->
      <div class="council-gauges-container" style="background:var(--color-surface-hover); border-radius:var(--radius-md); padding:12px; margin-bottom:14px; display:flex; flex-direction:column; gap:12px; border:1px solid var(--color-border);">
        <!-- 1. Jauge Nombre d'États (Seuil 55% = 4/6 États) -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.83rem; margin-bottom:4px;">
            <span style="font-weight:600;">🏛️ États votant Pour (seuil ≥ 4/6) :</span>
            <b style="color:${calc.statesPour >= 4 ? 'var(--color-success)' : 'var(--color-primary)'}; font-size:0.88rem;">
              ${calc.statesPour} / 6 États (${((calc.statesPour / 6) * 100).toFixed(0)}%)
              ${calc.statesPour >= 4 ? ' ✓ Validé' : ' (manque ' + Math.max(0, 4 - calc.statesPour) + ')'}
            </b>
          </div>
          <div class="progress-bar-track" style="height:16px;">
            <div class="progress-bar-fill ${calc.statesPour >= 4 ? 'fill-green' : 'fill-blue'}" style="width:${Math.min(100, (calc.statesPour / 6) * 100)}%;"></div>
            <div class="progress-bar-threshold" style="left:66.66%;" title="Seuil requis : 4 États sur 6 (55%)">
              <span class="threshold-label">Seuil 4/6</span>
            </div>
          </div>
          <!-- Puces de statut des 6 États -->
          <div style="display:flex; justify-content:space-between; margin-top:8px; gap:4px; flex-wrap:wrap;">
            ${ALL_COUNTRY_CODES.map(c => {
              const v = vState.stateVotes[step.id]?.[c] ?? 'abstention';
              const color = v === 'pour' ? '#10b981' : v === 'contre' ? '#ef4444' : '#94a3b8';
              const icon = v === 'pour' ? '✓' : v === 'contre' ? '✗' : '–';
              return `
                <span style="display:inline-flex; align-items:center; gap:4px; padding:2px 7px; border-radius:4px; background:var(--color-surface); border:1px solid ${color}; font-weight:700; font-size:0.72rem; color:${color};" title="${COUNTRIES_META[c].name} : ${v.toUpperCase()}">
                  <img src="${COUNTRIES_META[c].flagUrl}" alt="${c}" style="width:13px; height:9px; border-radius:1px; object-fit:cover; display:inline-block;" />
                  <span>${c}</span>
                  <span>${icon}</span>
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Jauge Population (Seuil ≥ 65% = 172.9 M) -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.83rem; margin-bottom:4px;">
            <span style="font-weight:600;">👥 Population de l'UE (seuil ≥ 65%) :</span>
            <b style="color:${calc.popPct >= 65 ? 'var(--color-success)' : 'var(--color-primary)'}; font-size:0.88rem;">
              ${calc.popPour.toFixed(1)} / ${calc.popTotal.toFixed(1)} M (${calc.popPct.toFixed(1)}%)
              ${calc.popPct >= 65 ? ' ✓ Validé' : ' (manque ' + Math.max(0, 65 - calc.popPct).toFixed(1) + '%)'}
            </b>
          </div>
          <div class="progress-bar-track" style="height:16px;">
            <div class="progress-bar-fill ${calc.popPct >= 65 ? 'fill-green' : 'fill-blue'}" style="width:${Math.min(100, calc.popPct)}%;"></div>
            <div class="progress-bar-threshold" style="left:65%;" title="Seuil requis : 65% de la population">
              <span class="threshold-label">Seuil 65%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Raccourcis rapides Conseil -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted);">Votes des 6 États membres</span>
        <div style="display:flex; gap:6px;">
          <button class="btn-micro" id="btnCouncilAllPour">Tous Pour 👍</button>
          <button class="btn-micro" id="btnCouncilAllContre">Tous Contre 👎</button>
        </div>
      </div>

      <!-- Tableau des votes du Conseil -->
      <div class="vote-table-container">
        <table class="vote-mini-table">
          <thead>
            <tr>
              <th>État</th>
              <th>Pop.</th>
              <th style="text-align:right;">Vote</th>
            </tr>
          </thead>
          <tbody>
            ${['DE', 'FR', 'IT', 'PL', 'SE', 'HU'].map(c => {
              const meta = COUNTRIES_META[c as CountryCode];
              const currentVote: VoteChoice = vState.stateVotes[step.id]?.[c as CountryCode] || 'abstention';
              const pop = meta.population;
              const popShare = ((pop / calc.popTotal) * 100).toFixed(0);

              return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <img src="${meta.flagUrl}" alt="${meta.name}" style="width:20px; height:14px; object-fit:cover; border-radius:2px;" />
                      <b>${meta.name}</b>
                    </div>
                  </td>
                  <td style="font-size:0.78rem; color:var(--color-text-muted);">
                    ${pop} M (${popShare}%)
                  </td>
                  <td style="text-align:right;">
                    <div class="vote-toggle-group">
                      <button class="vote-pill ${currentVote === 'pour' ? 'active-pour' : ''}" data-type="state" data-actor="${c}" data-choice="pour" title="Pour">👍</button>
                      <button class="vote-pill ${currentVote === 'abstention' ? 'active-abst' : ''}" data-type="state" data-actor="${c}" data-choice="abstention" title="Abstention">✋</button>
                      <button class="vote-pill ${currentVote === 'contre' ? 'active-contre' : ''}" data-type="state" data-actor="${c}" data-choice="contre" title="Contre">👎</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
