import { store, isFinanceUnlocked } from '../../state/store';
import { renderFinanceAssessmentHtml } from './financeAssessmentView';
import { renderFinanceControlsHtml } from './financeControlsView';
import { renderFinanceChartsHtml } from './financeCharts';
import { renderFinanceVoteHtml } from './financeVoteView';
import { renderLockedFinanceView } from './financeLockedView';
import { calculateFinancialBreakdown } from '../../simulation/financeEngine';
import type { ContributionKey, AllocationKey } from '../../domain/financeTypes';

export async function renderFinanceView(container: HTMLElement): Promise<void> {
  const state = store.getState();
  const isUnlocked = isFinanceUnlocked(state);

  if (!isUnlocked) {
    renderLockedFinanceView(container, state);
    return;
  }

  if (!state.costAssessment) {
    await store.initFinance();
  }

  const s = store.getState();
  const assessment = s.costAssessment;
  const proposal = s.financialProposal;
  if (!assessment || !proposal) {
    container.innerHTML = '<div class="card"><p>Données financières indisponibles.</p></div>';
    return;
  }

  const directiveTitle = s.selectedDirective?.nom ?? 'Pacte vert innovant';
  const breakdown = calculateFinancialBreakdown(proposal, assessment);
  const reserveFund = Math.round(proposal.envelope * proposal.reserveRate * 100) / 100;

  container.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 10px; display: flex; flex-direction: column; gap: 16px;">
      
      <!-- Étape 1 : Évaluation des Besoins -->
      ${renderFinanceAssessmentHtml(assessment, directiveTitle)}

      <!-- Étape 2 : Négociation (Contrôles à gauche, Graphiques à droite) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
        <div>
          ${renderFinanceControlsHtml(proposal, assessment)}
        </div>
        <div>
          ${renderFinanceChartsHtml(breakdown, proposal.envelope, reserveFund)}
        </div>
      </div>

      <!-- Étape 3 : Vote Budgétaire et Propagation -->
      ${renderFinanceVoteHtml(proposal, assessment, breakdown, s.financialAgreement ?? null)}
    </div>
  `;

  attachFinanceEvents(container);
}

function attachFinanceEvents(container: HTMLElement): void {
  // Slider Enveloppe
  const inputEnv = container.querySelector('#inputEnvelope') as HTMLInputElement | null;
  inputEnv?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    const label = container.querySelector('#val-envelope');
    if (label) label.textContent = `${val} Mds €`;
    store.updateFinancialProposal({ envelope: val });
  });

  // Sélecteur Clé de contribution
  container.querySelector('#selectContribKey')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value as ContributionKey;
    store.updateFinancialProposal({ contributionKey: val });
  });

  // Sélecteur Clé d'allocation
  container.querySelector('#selectAllocKey')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value as AllocationKey;
    store.updateFinancialProposal({ allocationKey: val });
  });

  // Slider Réserve
  container.querySelector('#inputReserve')?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    const label = container.querySelector('#val-reserve');
    if (label) label.textContent = `${Math.round(val * 100)}%`;
    store.updateFinancialProposal({ reserveRate: val });
  });

  // Slider Cofinancement
  container.querySelector('#inputCofin')?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    const label = container.querySelector('#val-cofin');
    if (label) label.textContent = `${Math.round(val * 100)}%`;
    store.updateFinancialProposal({ cofinancingRate: val });
  });

  // Bouton Voter
  container.querySelector('#btnVoteFinance')?.addEventListener('click', () => {
    store.voteFinancialAgreement();
    renderFinanceView(container);
  });

  // Bouton Réajuster / Réviser
  container.querySelector('#btnRenegotiateFinance')?.addEventListener('click', () => {
    store.resetFinancialAgreement();
    renderFinanceView(container);
  });

  // Bouton Propager au Simulateur
  container.querySelector('#btnApplyFinanceToSim')?.addEventListener('click', () => {
    store.recomputeSimulation();
    store.setActiveTab('simulator');
  });
}
