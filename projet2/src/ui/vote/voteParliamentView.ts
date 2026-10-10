import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { PARTIES_PROFILES } from '../../data/parties';
import type { PartyCode } from '../../domain/types';
import type { VoteChoice, VoteStepData, VoteStoreState, VoteCalculationResult } from '../../state/store';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

let parliamentChartInstance: Chart | null = null;

/**
 * Génère le fragment HTML pour la colonne du Parlement Européen
 */
export function renderParliamentCardHtml(
  calc: VoteCalculationResult,
  step: VoteStepData,
  vState: VoteStoreState
): string {
  return `
    <div class="card legislative-card">
      <div class="card-header" style="margin-bottom:12px; border-bottom:1px solid var(--color-border); padding-bottom:10px;">
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1.2rem;">🇪🇺</span>
            <h3 class="card-title" style="font-size:1.05rem;">Parlement Européen</h3>
          </div>
          <span style="font-size:0.78rem; color:var(--color-text-muted);">${calc.parliamentRuleText}</span>
        </div>
        <span class="badge ${calc.parliamentPassed ? 'badge-success-solid' : 'badge-danger-solid'}">
          ${calc.parliamentPassed ? 'Majorité Atteinte' : 'Majorité Insuffisante'}
        </span>
      </div>

      <!-- Hémicycle Chart.js & KPI sièges -->
      <div style="background:var(--color-surface-hover); border-radius:var(--radius-md); padding:12px; margin-bottom:14px; display:flex; flex-direction:column; align-items:center; border:1px solid var(--color-border); gap:8px;">
        <div style="width:100%; height:130px; position:relative; display:flex; justify-content:center; align-items:center;">
          <canvas id="parliamentChartCanvas"></canvas>
          <div style="position:absolute; bottom:10px; text-align:center;">
            <div style="font-size:1.3rem; font-weight:800; color:var(--color-primary-dark);">${calc.seatsPour}</div>
            <div style="font-size:0.72rem; color:var(--color-text-muted);">sièges Pour / 611</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-around; width:100%; font-size:0.78rem;">
          <span style="color:#10b981; font-weight:700;">Pour : ${calc.seatsPour}</span>
          <span style="color:#f59e0b; font-weight:700;">Abst : ${calc.seatsAbstention}</span>
          <span style="color:#ef4444; font-weight:700;">Contre : ${calc.seatsContre}</span>
        </div>

        <!-- Jauge Sièges Parlement (Seuil ≥ 306 / 611) -->
        <div style="width:100%; margin-top:4px;">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:3px;">
            <span style="font-weight:600;">Majorité absolue (seuil ≥ 306 sièges) :</span>
            <b style="color:${calc.seatsPour >= 306 ? 'var(--color-success)' : 'var(--color-primary)'}; font-size:0.85rem;">
              ${calc.seatsPour} / 611 (${((calc.seatsPour / 611) * 100).toFixed(0)}%)
              ${calc.seatsPour >= 306 ? ' ✓ Validé' : ' (manque ' + Math.max(0, 306 - calc.seatsPour) + ')'}
            </b>
          </div>
          <div class="progress-bar-track" style="height:16px;">
            <div class="progress-bar-fill ${calc.seatsPour >= 306 ? 'fill-green' : 'fill-blue'}" style="width:${Math.min(100, (calc.seatsPour / 611) * 100)}%;"></div>
            <div class="progress-bar-threshold" style="left:50.08%;" title="Seuil requis : 306 sièges (50% + 1)">
              <span class="threshold-label">Seuil 306</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Raccourcis rapides Parlement -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted);">Votes des 6 Groupes Parlementaires</span>
        <div style="display:flex; gap:6px;">
          <button class="btn-micro" id="btnPartyAllPour">Tous Pour 👍</button>
          <button class="btn-micro" id="btnPartyAllContre">Tous Contre 👎</button>
        </div>
      </div>

      <!-- Tableau des votes du Parlement -->
      <div class="vote-table-container">
        <table class="vote-mini-table">
          <thead>
            <tr>
              <th>Groupe</th>
              <th>Sièges</th>
              <th style="text-align:right;">Vote</th>
            </tr>
          </thead>
          <tbody>
            ${['PPE', 'SDE', 'RENEW', 'VERT', 'ECR', 'GUE'].map(p => {
              const party = PARTIES_PROFILES[p as PartyCode];
              const currentVote: VoteChoice = vState.partyVotes[step.id]?.[p as PartyCode] || 'abstention';
              const meps = party.base.meps;

              return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="width:12px; height:12px; border-radius:3px; background:${party.couleur}; display:inline-block;"></span>
                      <b>${party.nom.split('(')[0].trim()}</b>
                    </div>
                  </td>
                  <td style="font-size:0.78rem; color:var(--color-text-muted);">
                    ${meps} sièges
                  </td>
                  <td style="text-align:right;">
                    <div class="vote-toggle-group">
                      <button class="vote-pill ${currentVote === 'pour' ? 'active-pour' : ''}" data-type="party" data-actor="${p}" data-choice="pour" title="Pour">👍</button>
                      <button class="vote-pill ${currentVote === 'abstention' ? 'active-abst' : ''}" data-type="party" data-actor="${p}" data-choice="abstention" title="Abstention">✋</button>
                      <button class="vote-pill ${currentVote === 'contre' ? 'active-contre' : ''}" data-type="party" data-actor="${p}" data-choice="contre" title="Contre">👎</button>
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

/**
 * Initialisation de l'hémicycle demi-camembert Chart.js
 */
export function initParliamentHemicycle(calc: VoteCalculationResult): void {
  const canvas = document.getElementById('parliamentChartCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  if (parliamentChartInstance) {
    parliamentChartInstance.destroy();
    parliamentChartInstance = null;
  }

  parliamentChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Pour', 'Abstention', 'Contre'],
      datasets: [{
        data: [calc.seatsPour, calc.seatsAbstention, calc.seatsContre],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90,
      circumference: 180,
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label} : ${ctx.raw} sièges (${Math.round(((ctx.raw as number) / calc.seatsTotal) * 100)}%)`
          }
        }
      }
    }
  });
}
