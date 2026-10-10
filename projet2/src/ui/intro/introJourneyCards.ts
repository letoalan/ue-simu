import { store, type UserJourney } from '../../state/store';
import { downloadSessionFile, promptImportSession } from '../../state/sessionStorage';

export function renderJourneyCardsHtml(currentJourney: UserJourney): string {
  const state = store.getState();
  const dirName = state.selectedDirective?.nom ?? 'Pacte vert innovant';
  const dirId = state.selectedDirective?.id ?? 1;

  return `
    <!-- Barre de Gestion de Session Locale -->
    <div class="card session-management-card" style="padding:14px 18px; border-left:4px solid var(--color-primary); margin-bottom:18px;">
      <div class="session-card-inner" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="./medias/images/flags/ue.jpg" alt="UE" style="width:20px; height:14px; border-radius:2px; vertical-align:middle; box-shadow:0 0 2px rgba(0,0,0,0.2);" />
            <strong style="font-size:0.92rem; color:var(--color-primary-dark);">Session Active : Scénario S${state.scenarioId} • D${dirId} (${dirName})</strong>
            <span class="badge" style="background:#e0e7ff; color:#3730a3; font-size:0.75rem;">PRNG #${state.seed}</span>
          </div>
          <span style="font-size:0.8rem; color:var(--color-text-muted);">
            Sauvegarde locale hors-ligne • Aucun serveur externe requis
          </span>
        </div>
        <div class="session-btn-group">
          <button class="btn btn-secondary btn-sm" id="btnSessionReset" title="Réinitialiser les votes et le mandat">
            🔄 Nouvelle partie
          </button>
          <button class="btn btn-secondary btn-sm" id="btnSessionExport" title="Télécharger le fichier de sauvegarde JSON">
            💾 Exporter session (.json)
          </button>
          <button class="btn btn-secondary btn-sm" id="btnSessionImport" title="Charger un fichier de session JSON">
            📂 Importer session (.json)
          </button>
        </div>
      </div>
    </div>

    <!-- Les 3 Portails de Parcours UX -->
    <div class="grid-3" style="margin-bottom:20px;">
      <!-- 1. Participant -->
      <div class="card journey-card ${currentJourney === 'participant' ? 'journey-card-selected' : ''}" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px; border-top:4px solid #3b82f6;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="badge" style="background:#dbeafe; color:#1e40af; font-size:0.78rem;">🎓 Élève / Délégué</span>
            <span style="font-size:1.3rem;">🎭</span>
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:var(--color-primary); margin-bottom:6px;">
            « Je suis un participant »
          </h3>
          <p style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.5; margin-bottom:14px;">
            Incarnez votre acteur européen (État, parti ou lobby), préparez vos arguments, négociez les compromis et observez l'impact direct sur vos intérêts.
          </p>
        </div>
        <button class="btn ${currentJourney === 'participant' ? 'btn-primary' : 'btn-secondary'} btn-block" id="btnEnterParticipant">
          Entrer comme Participant →
        </button>
      </div>

      <!-- 2. Animateur -->
      <div class="card journey-card ${currentJourney === 'animateur' ? 'journey-card-selected' : ''}" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px; border-top:4px solid #10b981;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="badge" style="background:#d1fae5; color:#065f46; font-size:0.78rem;">🎙️ Enseignant / Présidence</span>
            <span style="font-size:1.3rem;">📋</span>
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#047857; margin-bottom:6px;">
            « Je suis un animateur »
          </h3>
          <p style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.5; margin-bottom:14px;">
            Conduisez les débats parlementaires, vérifiez les quorums, centralisez les votes officiels et projetez les trajectoires en direct sur grand écran.
          </p>
        </div>
        <button class="btn ${currentJourney === 'animateur' ? 'btn-primary' : 'btn-secondary'} btn-block" id="btnEnterAnimateur">
          Conduire la séance →
        </button>
      </div>

      <!-- 3. Maître du jeu -->
      <div class="card journey-card ${currentJourney === 'maitre_du_jeu' ? 'journey-card-selected' : ''}" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px; border-top:4px solid #8b5cf6;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="badge" style="background:#ede9fe; color:#5b21b6; font-size:0.78rem;">⚙️ Supervision & Règles</span>
            <span style="font-size:1.3rem;">🏛️</span>
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#6d28d9; margin-bottom:6px;">
            « Je suis le maître du jeu »
          </h3>
          <p style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.5; margin-bottom:14px;">
            Configurez les scénarios, répartissez les 19 rôles entre élèves, contrôlez les aléas (PRNG), supervisez la cohérence et gérez les sauvegardes.
          </p>
        </div>
        <button class="btn ${currentJourney === 'maitre_du_jeu' ? 'btn-primary' : 'btn-secondary'} btn-block" id="btnEnterMaitre">
          Superviser la session →
        </button>
      </div>
    </div>
  `;
}

export function attachJourneyCardsEvents(container: HTMLElement, onRefresh?: () => void): void {
  container.querySelector('#btnEnterParticipant')?.addEventListener('click', () => {
    store.setUserJourney('participant');
    store.setActiveTab('actors');
  });

  container.querySelector('#btnEnterAnimateur')?.addEventListener('click', () => {
    store.setUserJourney('animateur');
    store.setActiveTab('vote');
  });

  container.querySelector('#btnEnterMaitre')?.addEventListener('click', () => {
    store.setUserJourney('maitre_du_jeu');
    if (onRefresh) onRefresh();
  });

  container.querySelector('#btnSessionReset')?.addEventListener('click', () => {
    if (confirm('Voulez-vous réinitialiser la session actuelle ? Les votes et amendements seront remis à zéro.')) {
      store.resetSession();
      if (onRefresh) onRefresh();
    }
  });

  container.querySelector('#btnSessionExport')?.addEventListener('click', () => {
    downloadSessionFile(store.getState());
  });

  container.querySelector('#btnSessionImport')?.addEventListener('click', () => {
    promptImportSession(
      async (data) => {
        if (confirm('Restaurer la session sauvegardée ? Les données actuelles seront remplacées.')) {
          await store.restoreSession(data);
          if (onRefresh) onRefresh();
        }
      },
      (err) => alert('Erreur lors du chargement : ' + err)
    );
  });
}
