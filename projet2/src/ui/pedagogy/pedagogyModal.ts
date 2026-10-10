import { store } from '../../state/store';
import { analyzeChartContext } from '../../pedagogy/chartAnalyzer';
import { getChartExplanatorySchema } from '../../pedagogy/chartExplanatorySchemas';

/**
 * Ouvre la modale de décryptage contextualisée d'un graphique en temps réel.
 * Accessible et vulgarisée pour les élèves de lycée général et professionnel.
 */
export function openPedagogyModal(chartKey: string): void {
  const state = store.getState();
  const analysis = analyzeChartContext(chartKey, state);
  const schemaHtml = getChartExplanatorySchema(chartKey, state);

  const existingModal = document.getElementById('pedagogyModal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.id = 'pedagogyModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modalPedagogyTitle');

  modal.innerHTML = `
    <div class="modal-content pedagogy-modal-content" style="max-width: 720px; border-radius: var(--radius-lg); padding: 22px;">
      <!-- En-tête -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 12px;">
        <div>
          <span class="badge badge-commission" style="font-size: 0.75rem; text-transform: uppercase; margin-bottom: 6px; display: inline-block;">
            ${analysis.badge}
          </span>
          <h2 id="modalPedagogyTitle" style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary); margin: 0;">
            💡 ${analysis.title}
          </h2>
        </div>
        <button id="btnCloseModal" class="btn btn-secondary btn-sm" style="min-height: 36px; min-width: 36px; padding: 4px; font-size: 1.1rem; border-radius: 50%;" aria-label="Fermer la modale">
          ✕
        </button>
      </div>

      <!-- Corps didactique -->
      <div class="pedagogy-modal-body" style="display: flex; flex-direction: column; gap: 16px; margin-top: 14px; max-height: 72vh; overflow-y: auto; padding-right: 4px;">
        
        <!-- 0. Schéma Explicatif des Pondérations & Valeurs -->
        ${schemaHtml}

        <!-- 1. En un coup d'œil -->
        <div style="background: var(--color-surface-hover); padding: 12px 14px; border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
          <strong style="color: var(--color-primary); font-size: 0.85rem; display: block; margin-bottom: 4px;">
            👀 En un coup d'œil :
          </strong>
          <p style="margin: 0; font-size: 0.92rem; font-weight: 600; color: var(--color-text-main); line-height: 1.5;">
            ${analysis.summary}
          </p>
        </div>

        <!-- 2. Chiffre clé -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.08)); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <span style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">📊 Résultat mesuré :</span>
          <span style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary); font-family: var(--font-mono);">
            ${analysis.keyFigure}
          </span>
        </div>

        <!-- 3. En coulisses -->
        <div>
          <strong style="font-size: 0.85rem; color: var(--color-text-main); display: block; margin-bottom: 4px;">
            🕵️ Ce qui s'est passé en coulisses :
          </strong>
          <p style="margin: 0; font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5;">
            ${analysis.behindTheScenes}
          </p>
        </div>

        <!-- 4. Les mécanismes mathématiques & humains -->
        <div>
          <strong style="font-size: 0.85rem; color: var(--color-text-main); display: block; margin-bottom: 6px;">
            ⚙️ Les ressorts de la simulation :
          </strong>
          <ul style="padding-left: 20px; margin: 0; font-size: 0.85rem; color: var(--color-text-muted); display: flex; flex-direction: column; gap: 6px;">
            ${analysis.mechanisms.map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>

        <!-- 5. Le conseil du négociateur -->
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 12px 14px; border-radius: var(--radius-md);">
          <strong style="color: #b45309; font-size: 0.85rem; display: block; margin-bottom: 4px;">
            🎯 Le conseil du négociateur :
          </strong>
          <p style="margin: 0; font-size: 0.86rem; color: #78350f; line-height: 1.45;">
            ${analysis.studentTip}
          </p>
        </div>
      </div>

      <!-- Pied de modale -->
      <div style="display: flex; justify-content: flex-end; margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--color-border);">
        <button id="btnConfirmCloseModal" class="btn btn-primary btn-sm" style="padding: 8px 18px; font-weight: 700;">
          J'ai compris 👍
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#btnCloseModal')?.addEventListener('click', closeModal);
  modal.querySelector('#btnConfirmCloseModal')?.addEventListener('click', closeModal);

  // Fermeture par clic sur le fond
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Fermeture avec la touche Échap
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
}
