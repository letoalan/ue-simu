import { audioPlayer } from '../../../state/audioPlayer';
import { downloadRegistryCsvTemplate } from '../guides/guideReaderExport';

export function renderLandingResourcesHtml(): string {
  return `
    <!-- Podcasts & Multimédia -->
    <div class="multimedia-resources-box" id="resourcesSection">
      <div class="resources-box-header">
        <span class="resources-badge">🎧 Podcasts Immersifs</span>
        <h3>Écoutez les Débats & Synthèses Audio</h3>
        <p>Chaque directive dispose d'une fiction radio immersive et d'un décryptage technique pour contextualiser les enjeux avant de débattre.</p>
      </div>
      <div class="audio-tracks-grid">
        <div class="audio-track-card">
          <span class="track-icon">🎙️</span>
          <div class="track-meta">
            <strong>Pacte vert & Climat (S1-D1)</strong>
            <span>Podcast immersif (Épisode 1)</span>
          </div>
          <button class="btn btn-sm btn-outline btn-play-podcast" data-scenario-id="1" data-directive-id="1" data-directive-name="Pacte vert innovant">
            ▶ Écouter
          </button>
        </div>

        <div class="audio-track-card">
          <span class="track-icon">🎙️</span>
          <div class="track-meta">
            <strong>Transition agricole & Zéro Pesticides (S1-D2)</strong>
            <span>Podcast immersif (Épisode 2)</span>
          </div>
          <button class="btn btn-sm btn-outline btn-play-podcast" data-scenario-id="1" data-directive-id="2" data-directive-name="Transition agricole">
            ▶ Écouter
          </button>
        </div>

        <div class="audio-track-card">
          <span class="track-icon">🎙️</span>
          <div class="track-meta">
            <strong>Sécurité Énergétique & Souveraineté (S2-D1)</strong>
            <span>Podcast immersif (Épisode 3)</span>
          </div>
          <button class="btn btn-sm btn-outline btn-play-podcast" data-scenario-id="2" data-directive-id="1" data-directive-name="Sécurité énergétique">
            ▶ Écouter
          </button>
        </div>
      </div>
    </div>

    <!-- Registre & Téléchargements -->
    <div class="registry-download-box">
      <div class="registry-box-left">
        <span class="reg-icon">📑</span>
        <div>
          <h4>Modèle de Registre des Cartes (Format CSV)</h4>
          <p>Consignez tous les accords, les émetteurs, les receveurs et les promesses de vote pour arbitrer les dénonciations en fin de partie.</p>
        </div>
      </div>
      <button class="btn btn-secondary" id="btnDownloadCsvRegistry">
        📥 Télécharger le modèle (CSV)
      </button>
    </div>
  `;
}

export function attachLandingResourcesEvents(container: HTMLElement): void {
  // CSV registry download
  container.querySelector('#btnDownloadCsvRegistry')?.addEventListener('click', () => {
    downloadRegistryCsvTemplate();
  });

  // Audio track playback
  container.querySelectorAll('.btn-play-podcast').forEach(btn => {
    btn.addEventListener('click', () => {
      const scenarioId = Number(btn.getAttribute('data-scenario-id') || 1);
      const directiveId = Number(btn.getAttribute('data-directive-id') || 1);
      const directiveName = btn.getAttribute('data-directive-name') || 'Directive UE-SIMU';
      audioPlayer.playTrack({
        scenarioId,
        directiveId,
        directiveName,
        type: 'podcast'
      });
    });
  });
}
