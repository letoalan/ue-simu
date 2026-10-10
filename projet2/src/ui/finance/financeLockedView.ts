import type { AppStoreState } from '../../state/storeTypes';
import { store } from '../../state/store';

export function renderLockedFinanceView(container: HTMLElement, state: AppStoreState): void {
  const dNom = state.selectedDirective?.nom ?? 'Aucune directive sélectionnée';
  const hasDirective = Boolean(state.selectedDirective);
  const pkg = state.voteState?.stepStatus?.['package'];
  const isPackageVoted = Boolean(pkg?.validated);
  const isPackageRejected = Boolean(pkg?.validated && !pkg?.passed);

  const title = isPackageRejected
    ? 'Package législatif rejeté : aucun besoin de financement'
    : 'Adoption du Package Final requise';
  const explanation = isPackageRejected
    ? `Le Conseil ou le Parlement n'ont pas réuni la majorité qualifiée sur le compromis final. Le texte est <b>caduc</b> : sans directive adoptée, <b>le besoin de financement n'existe pas</b>.`
    : `En droit de l'Union européenne, un fonds de cofinancement (Phase B) ne peut être ouvert que si le <b>Package Final consolidé</b> est formellement voté et adopté par le Conseil et le Parlement.`;
  const icon = isPackageRejected ? '❌' : '🔒';
  const borderColor = isPackageRejected ? '#ef4444' : '#f59e0b';

  container.innerHTML = `
    <div style="max-width: 800px; margin: 40px auto; padding: 16px;">
      <div class="card" style="text-align: center; padding: 36px 24px; border-top: 4px solid ${borderColor}; box-shadow: var(--shadow-lg);">
        <div style="font-size: 3.2rem; margin-bottom: 12px; line-height: 1;">${icon}</div>
        <span class="badge" style="background: ${isPackageRejected ? '#fef2f2' : '#fef3c7'}; color: ${isPackageRejected ? '#991b1b' : '#92400e'}; border: 1px solid ${borderColor}; font-size: 0.8rem; margin-bottom: 14px;">
          Phase B — ${isPackageRejected ? 'Financement Inexistant' : 'Financement Verrouillé'}
        </span>
        <h2 style="font-size: 1.35rem; color: var(--color-primary-dark); margin: 0 0 10px 0;">
          ${title}
        </h2>
        <p style="font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.6; max-width: 620px; margin: 0 auto 20px auto;">
          ${explanation}
        </p>

        <!-- Statut actuel didactique -->
        <div style="background: var(--color-surface-hover); border-radius: var(--radius-md); padding: 16px; margin: 0 auto 24px auto; max-width: 580px; text-align: left; font-size: 0.85rem;">
          <div style="font-weight: 700; margin-bottom: 8px; color: var(--color-text-main);">
            📜 Directive : <span style="color: var(--color-primary);">${dNom}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; color: var(--color-text-muted);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${hasDirective ? '✅' : '⏳'}</span>
              <span>1. Choix de la proposition législative (${hasDirective ? 'Sélectionnée' : 'Non choisie'})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${!isPackageVoted ? '⏳' : isPackageRejected ? '❌' : '✅'}</span>
              <span>2. Vote solennel du Package Final (${!isPackageVoted ? 'En attente de vote' : isPackageRejected ? 'Rejeté par les institutions' : 'Adopté'})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${isPackageRejected ? '🚫' : '🔒'}</span>
              <span>3. Négociation budgétaire (${isPackageRejected ? 'Inexistante sans loi adoptée' : 'Déverrouillée après adoption du package'})</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btnGoToVoteLocked" style="box-shadow: var(--shadow-md);">
            ${isPackageRejected ? '🗳️ Retourner au vote du Package pour renégocier' : '🗳️ Aller voter le Package dans l\'hémicycle'}
          </button>
          <button class="btn btn-secondary" id="btnGoToDirectivesLocked">
            📜 Choisir une autre directive
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btnGoToVoteLocked')?.addEventListener('click', () => {
    store.setActiveTab('vote');
  });

  container.querySelector('#btnGoToDirectivesLocked')?.addEventListener('click', () => {
    store.setActiveTab('scenario');
  });
}
