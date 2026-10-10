import type { Directive } from '../../domain/types';
import type { AudioPlayerState } from '../../state/audioPlayer';

function escapeHtml(str: string): string {
  return str.replace(/"/g, '&quot;');
}

export function renderDirectiveAudioBarHtml(
  scenarioId: number,
  d: Directive,
  audioState: AudioPlayerState
): string {
  const isPodActive = audioState.currentTrack?.scenarioId === scenarioId && audioState.currentTrack?.directiveId === d.id && audioState.currentTrack?.type === 'podcast';
  const isSynActive = audioState.currentTrack?.scenarioId === scenarioId && audioState.currentTrack?.directiveId === d.id && audioState.currentTrack?.type === 'synthese';
  const isPodPlaying = isPodActive && audioState.isPlaying;
  const isPodPaused = isPodActive && !audioState.isPlaying;
  const isSynPlaying = isSynActive && audioState.isPlaying;
  const isSynPaused = isSynActive && !audioState.isPlaying;

  return `
    <div class="directive-audio-bar">
      <button
        type="button"
        class="btn-audio-listen btn-audio-podcast ${isPodPlaying ? 'is-playing' : isPodPaused ? 'is-paused' : ''}"
        data-action="play-audio"
        data-scenario="${scenarioId}"
        data-directive="${d.id}"
        data-type="podcast"
        data-name="${escapeHtml(d.nom)}"
        title="Écouter le podcast complet de la directive ${d.id}"
      >
        <span class="audio-icon">${isPodPlaying ? '⏸️' : '🎙️'}</span>
        <span class="audio-label">Podcast</span>
        ${isPodPlaying ? '<span class="audio-wave"><span></span><span></span><span></span></span>' : ''}
      </button>

      <button
        type="button"
        class="btn-audio-listen btn-audio-synthese ${isSynPlaying ? 'is-playing' : isSynPaused ? 'is-paused' : ''}"
        data-action="play-audio"
        data-scenario="${scenarioId}"
        data-directive="${d.id}"
        data-type="synthese"
        data-name="${escapeHtml(d.nom)}"
        title="Écouter la synthèse rapide de la directive ${d.id}"
      >
        <span class="audio-icon">${isSynPlaying ? '⏸️' : '🎧'}</span>
        <span class="audio-label">Synthèse</span>
        ${isSynPlaying ? '<span class="audio-wave"><span></span><span></span><span></span></span>' : ''}
      </button>
    </div>
  `;
}

export function renderDirectiveDetailCardHtml(
  state: any,
  currentDirective: Directive,
  _audioState: AudioPlayerState
): string {
  return `
    <div class="card">
      <div class="card-header" style="flex-direction:column; align-items:flex-start; gap:8px;">
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <span class="badge badge-commission">Proposition Actuelle</span>
            <h2 class="card-title" style="margin-top:4px;">${currentDirective.nom}</h2>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <!-- Bouton Simulateur Sandbox -->
            <button
              type="button"
              class="btn-sandbox-trigger"
              id="btnOpenSandboxHeader"
              title="Simuler l'impact prévisionnel des amendements dans le Bac à Sable"
            >
              <span>📊</span>
              <span>Simuler en Sandbox</span>
              <span class="btn-sandbox-badge">${state.selectedAmendments.size}</span>
            </button>

            <!-- Boutons d'écoute -->
            <button
              type="button"
              class="btn-audio-listen btn-audio-podcast"
              data-action="play-audio"
              data-scenario="${state.scenarioId}"
              data-directive="${currentDirective.id}"
              data-type="podcast"
              data-name="${escapeHtml(currentDirective.nom)}"
              title="Écouter le podcast de cette directive"
            >
              <span class="audio-icon">🎙️</span>
              <span class="audio-label">Podcast</span>
            </button>

            <button
              type="button"
              class="btn-audio-listen btn-audio-synthese"
              data-action="play-audio"
              data-scenario="${state.scenarioId}"
              data-directive="${currentDirective.id}"
              data-type="synthese"
              data-name="${escapeHtml(currentDirective.nom)}"
              title="Écouter la synthèse de cette directive"
            >
              <span class="audio-icon">🎧</span>
              <span class="audio-label">Synthèse</span>
            </button>

            <button class="btn btn-secondary btn-sm" id="btnGoToActorsFromDirective">
              Consulter les Acteurs 👥
            </button>
            <button class="btn btn-primary btn-sm" id="btnGoToVoteFromDirective">
              Passer au Vote 🗳️ →
            </button>
          </div>
        </div>
        <p style="font-size:0.88rem; color:var(--color-text-muted); margin:0;">
          ${currentDirective.declaration_intention || currentDirective.description}
        </p>
      </div>

      <h3 style="font-size:1rem; font-weight:700; margin:16px 0 10px 0;">
        Amendements disponibles (${currentDirective.amendements.length})
      </h3>
      <p style="font-size:0.82rem; color:var(--color-text-muted); margin-bottom:12px;">
        Cochez les amendements adoptés lors de la négociation pour mesurer leur impact avant la séance de vote :
      </p>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${currentDirective.amendements.map(a => {
          const isSelected = state.selectedAmendments.has(a.id);
          const badgeClass = a.type === 'parlement' ? 'badge-parlement' : a.type === 'conseil' ? 'badge-conseil' : 'badge-lobby';

          return `
            <div class="amendment-item" style="border-left: 4px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'};">
              <input
                type="checkbox"
                id="chk-${a.id}"
                data-amendment-id="${a.id}"
                ${isSelected ? 'checked' : ''}
                style="margin-top:2px; accent-color:var(--color-primary);"
              />
              <div style="flex:1;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                  <label for="chk-${a.id}" style="font-weight:700; font-size:0.9rem; cursor:pointer;">${a.id}</label>
                  <span class="badge ${badgeClass}" style="font-size:0.7rem;">${a.origine || a.type}</span>
                </div>
                <p style="font-size:0.85rem; color:var(--color-text-muted); margin-bottom:4px;">
                  ${a.description}
                </p>
                <div style="font-size:0.75rem; color:var(--color-primary); font-family:var(--font-mono);">
                  ${Object.entries(a.impact || {}).map(([k, v]) => `${k} : ${v}`).join(' | ')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
