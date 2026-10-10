import type { FinancialAgreement, CountryFinancialBreakdown } from '../../domain/financeTypes';
import { evaluateCouncilVote, evaluateParliamentVote } from '../../simulation/financeEngine';
import type { FinancialProposal, CostAssessment } from '../../domain/financeTypes';
import type { CountryCode } from '../../domain/types';

export function renderFinanceVoteHtml(
  proposal: FinancialProposal,
  assessment: CostAssessment,
  breakdown: Record<CountryCode, CountryFinancialBreakdown>,
  agreement: FinancialAgreement | null
): string {
  const council = evaluateCouncilVote(breakdown);
  const parliament = evaluateParliamentVote(proposal, assessment);
  const isVoted = agreement !== null;
  const isAdopted = agreement?.adopted ?? false;

  return `
    <div class="card" style="border-top: 4px solid ${isVoted ? (isAdopted ? '#10b981' : '#ef4444') : 'var(--color-primary)'};">
      <div class="card-header" style="flex-wrap: wrap; gap: 8px;">
        <div>
          <span class="badge badge-conseil" style="font-size: 0.75rem;">Phase B — Étape 3 : Vote Budgétaire</span>
          <h2 class="card-title" style="font-size: 1.15rem; margin-top: 4px;">
            Co-décision Budgétaire (Conseil & Parlement)
          </h2>
        </div>
        ${isVoted ? `
          <span class="badge ${isAdopted ? 'badge-success-solid' : 'badge-danger-solid'}" style="font-size: 0.85rem; padding: 4px 10px;">
            ${isAdopted ? 'Accord Financier Adopté ✓' : 'Accord Rejeté ✗'}
          </span>
        ` : ''}
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 16px;">
        
        <!-- Conseil des ministres -->
        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #2563eb;">
          <div style="font-weight: 700; color: #2563eb; margin-bottom: 6px;">1. Conseil de l'Union Européenne</div>
          <div style="font-size: 0.82rem; margin-bottom: 4px;">
            États favorables : <b>${council.statesPour} / 6</b> (Requis : 4)
          </div>
          <div style="font-size: 0.82rem; margin-bottom: 8px;">
            Population représentée : <b>${council.popPourPct}%</b> (Requis : 65%)
          </div>
          <div>
            <span class="badge ${council.passed ? 'badge-success-solid' : 'badge-danger-solid'}" style="font-size: 0.75rem;">
              ${council.passed ? 'Majorité qualifiée atteinte ✓' : 'Majorité qualifiée bloquée ✗'}
            </span>
          </div>
        </div>

        <!-- Parlement européen -->
        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;">
          <div style="font-weight: 700; color: #f59e0b; margin-bottom: 6px;">2. Parlement Européen (720 sièges)</div>
          <div style="font-size: 0.82rem; margin-bottom: 4px;">
            Députés favorables : <b>${parliament.votesPour} / 720</b>
          </div>
          <div style="font-size: 0.82rem; margin-bottom: 8px;">
            Seuil de majorité : <b>361 voix</b>
          </div>
          <div>
            <span class="badge ${parliament.passed ? 'badge-success-solid' : 'badge-danger-solid'}" style="font-size: 0.75rem;">
              ${parliament.passed ? 'Majorité parlementaire acquise ✓' : 'Opposition majoritaire ✗'}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions de vote et propagation -->
      <div style="display: flex; gap: 10px; align-items: center; justify-content: flex-end; flex-wrap: wrap;">
        ${!isVoted ? `
          <button class="btn btn-primary" id="btnVoteFinance" style="padding: 10px 20px; font-weight: 700; box-shadow: var(--shadow-md);">
            🗳️ Mettre aux Voix l'Accord Financier
          </button>
        ` : isAdopted ? `
          <button class="btn btn-secondary" id="btnRenegotiateFinance">
            ✏️ Réviser le compromis
          </button>
          <button class="btn btn-primary" id="btnApplyFinanceToSim" style="padding: 10px 20px; font-weight: 700; background: #10b981; border-color: #10b981; box-shadow: var(--shadow-md);">
            🚀 Propager au Simulateur avec Financement
          </button>
        ` : `
          <span style="font-size: 0.82rem; color: #ef4444; font-weight: 700;">
            Le compromis a échoué. Ajustez l'enveloppe ou les clés pour rallier une majorité.
          </span>
          <button class="btn btn-secondary" id="btnRenegotiateFinance">
            🔄 Réajuster les paramètres
          </button>
        `}
      </div>
    </div>
  `;
}
