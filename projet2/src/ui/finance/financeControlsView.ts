import type { CostAssessment, FinancialProposal } from '../../domain/financeTypes';
import { evaluateFinancialTier } from '../../simulation/financeEngine';

export function renderFinanceControlsHtml(proposal: FinancialProposal, assessment: CostAssessment): string {
  const b = assessment.bornes;
  const envTier = evaluateFinancialTier(proposal.envelope, b.enveloppeMin, b.enveloppeMax);
  const tierColor = envTier.tier === 'P4' ? '#ef4444' : envTier.tier === 'P3' ? '#10b981' : envTier.tier === 'P2' ? '#3b82f6' : '#64748b';

  return `
    <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
      <div class="card-header" style="flex-wrap: wrap; gap: 8px;">
        <div>
          <span class="badge badge-parlement" style="font-size: 0.75rem;">Phase B — Étape 2 : Négociation</span>
          <h2 class="card-title" style="font-size: 1.15rem; margin-top: 4px;">
            Paramètres du Fonds Européen
          </h2>
        </div>
        <span class="badge" style="background: ${tierColor}15; color: ${tierColor}; border: 1px solid ${tierColor}; font-weight: 800;">
          Palier ${envTier.tier} : ${envTier.label}
        </span>
      </div>

      <!-- 1. Enveloppe globale -->
      <div class="form-group" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <label style="font-weight: 700; font-size: 0.88rem;">Enveloppe Totale du Fonds</label>
          <span id="val-envelope" style="font-family: var(--font-mono); font-weight: 800; color: var(--color-primary); font-size: 1rem;">
            ${proposal.envelope} Mds €
          </span>
        </div>
        <input type="range" class="form-range" id="inputEnvelope"
               min="${b.enveloppeMin}" max="${b.enveloppeMax}" step="1" value="${proposal.envelope}">
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--color-text-muted);">
          <span>Min : ${b.enveloppeMin} Mds</span>
          <span>Cible : ${assessment.propositionReference.enveloppeProposee} Mds</span>
          <span>Max : ${b.enveloppeMax} Mds</span>
        </div>
      </div>

      <!-- 2. Clé de contribution (qui paie) -->
      <div class="form-group" style="margin-bottom: 0;">
        <label style="font-weight: 700; font-size: 0.88rem; margin-bottom: 4px; display: block;">
          Clé de Contribution (Qui verse au fonds ?)
        </label>
        <select class="form-select form-select-sm" id="selectContribKey">
          <option value="pib" ${proposal.contributionKey === 'pib' ? 'selected' : ''}>PIB (Capacité économique classique)</option>
          <option value="population" ${proposal.contributionKey === 'population' ? 'selected' : ''}>Démographie (Poids de la population)</option>
          <option value="mixed" ${proposal.contributionKey === 'mixed' ? 'selected' : ''}>Mixte (60% PIB + 40% Population)</option>
          <option value="equal" ${proposal.contributionKey === 'equal' ? 'selected' : ''}>Forfaitaire égalitaire (1/6 chacun)</option>
        </select>
      </div>

      <!-- 3. Clé d'allocation (qui reçoit) -->
      <div class="form-group" style="margin-bottom: 0;">
        <label style="font-weight: 700; font-size: 0.88rem; margin-bottom: 4px; display: block;">
          Clé d'Allocation (Qui perçoit l'aide ?)
        </label>
        <select class="form-select form-select-sm" id="selectAllocKey">
          <option value="needs" ${proposal.allocationKey === 'needs' ? 'selected' : ''}>Besoins résiduels d'actions (Proportionnel à G)</option>
          <option value="convergence" ${proposal.allocationKey === 'convergence' ? 'selected' : ''}>Solidarité & Convergence (Faveur Est/Sud)</option>
          <option value="mixed" ${proposal.allocationKey === 'mixed' ? 'selected' : ''}>Mixte (60% Besoins + 40% Convergence)</option>
          <option value="equal" ${proposal.allocationKey === 'equal' ? 'selected' : ''}>Forfaitaire égalitaire (1/6 chacun)</option>
        </select>
      </div>

      <!-- 4. Réserve & Cofinancement -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
            <label style="font-weight: 700;">Réserve</label>
            <span id="val-reserve" style="font-family: var(--font-mono); font-weight: 700;">${Math.round(proposal.reserveRate * 100)}%</span>
          </div>
          <input type="range" class="form-range" id="inputReserve" min="0" max="0.15" step="0.01" value="${proposal.reserveRate}">
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
            <label style="font-weight: 700;">Cofinancement</label>
            <span id="val-cofin" style="font-family: var(--font-mono); font-weight: 700;">${Math.round(proposal.cofinancingRate * 100)}%</span>
          </div>
          <input type="range" class="form-range" id="inputCofin" min="${b.cofinancementMin}" max="${b.cofinancementMax}" step="0.01" value="${proposal.cofinancingRate}">
        </div>
      </div>

      <!-- Rappel des attentes des acteurs -->
      <div style="background: var(--color-surface-hover); border-radius: var(--radius-sm); padding: 10px; font-size: 0.78rem; color: var(--color-text-muted);">
        <strong>🏛️ Rappel des mandats :</strong> Allemagne & Suède rejettent le palier P4 (frugalité). Pologne & Italie exigent au moins 60% de couverture. Le Parlement bloque en dessous de P2.
      </div>
    </div>
  `;
}
