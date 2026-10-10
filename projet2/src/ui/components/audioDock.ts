import { audioPlayer, type AudioPlayerState } from '../../state/audioPlayer';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

let currentRenderedTrackKey: string | null = null;
let isDraggingScrubber = false;

export function renderAudioDock(container: HTMLElement): void {
  const state: AudioPlayerState = audioPlayer.getState();

  if (!state.currentTrack) {
    if (currentRenderedTrackKey !== null) {
      container.innerHTML = '';
      currentRenderedTrackKey = null;
    }
    return;
  }

  const trackKey = `${state.currentTrack.scenarioId}-${state.currentTrack.directiveId}-${state.currentTrack.type}`;

  if (currentRenderedTrackKey !== trackKey) {
    currentRenderedTrackKey = trackKey;
    container.innerHTML = buildDockHtml(state);
    attachAudioDockEvents(container);
  } else {
    updateDockInPlace(container, state);
  }
}

function buildDockHtml(state: AudioPlayerState): string {
  const { currentTrack, isPlaying, currentTime, duration, playbackRate, isMuted, isLoading } = state;
  if (!currentTrack) return '';

  const isPodcast = currentTrack.type === 'podcast';
  const typeLabel = isPodcast ? 'Podcast complet' : 'Synthèse express';
  const badgeClass = isPodcast ? 'podcast' : 'synthese';
  const icon = isPodcast ? '🎙️' : '🎧';

  return `
    <div class="audio-dock-player" role="region" aria-label="Lecteur audio de la directive">
      <div class="audio-dock-inner">
        <!-- Informations sur la piste -->
        <div class="audio-dock-info">
          <div class="audio-dock-icon">${icon}</div>
          <div class="audio-dock-titles">
            <span class="audio-dock-track-title" title="${currentTrack.directiveName}">
              D${currentTrack.directiveId} : ${currentTrack.directiveName}
            </span>
            <div class="audio-dock-track-sub">
              <span class="audio-dock-badge ${badgeClass}">${typeLabel}</span>
              <span>•</span>
              <span>S${currentTrack.scenarioId}</span>
              ${isLoading ? '<span>(Chargement...)</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Commandes de lecture & Barre de défilement -->
        <div class="audio-dock-controls">
          <button class="audio-btn-ctrl" id="btnAudioBack15" title="Reculer de 15s" aria-label="Reculer de 15 secondes">
            ⏪
          </button>

          <button class="audio-btn-ctrl audio-btn-play" id="btnAudioPlayPause" title="${isPlaying ? 'Pause' : 'Lecture'}" aria-label="${isPlaying ? 'Pause' : 'Lecture'}">
            ${isPlaying ? '⏸️' : '▶️'}
          </button>

          <button class="audio-btn-ctrl" id="btnAudioForward15" title="Avancer de 15s" aria-label="Avancer de 15 secondes">
            ⏩
          </button>

          <div class="audio-dock-scrubber-box">
            <span class="audio-time-label" id="audioCurrentTime">${formatTime(currentTime)}</span>
            <input
              type="range"
              class="audio-dock-scrubber"
              id="audioScrubber"
              min="0"
              max="${duration > 0 ? duration : 100}"
              value="${currentTime}"
              step="1"
              aria-label="Position de lecture"
            />
            <span class="audio-time-label" id="audioDuration">${formatTime(duration)}</span>
          </div>
        </div>

        <!-- Options (Vitesse, Mute, Fermer) -->
        <div class="audio-dock-actions">
          <button class="audio-rate-btn" id="btnAudioRate" title="Changer la vitesse de lecture">
            ${playbackRate}x
          </button>

          <button class="audio-btn-ctrl" id="btnAudioMute" title="${isMuted ? 'Rétablir le son' : 'Couper le son'}" aria-label="Volume">
            ${isMuted ? '🔇' : '🔊'}
          </button>

          <button class="audio-close-btn" id="btnAudioClose" title="Arrêter et fermer le lecteur" aria-label="Fermer le lecteur audio">
            ✕
          </button>
        </div>
      </div>
    </div>
  `;
}

function updateDockInPlace(container: HTMLElement, state: AudioPlayerState): void {
  const playBtn = container.querySelector('#btnAudioPlayPause');
  if (playBtn) {
    playBtn.textContent = state.isPlaying ? '⏸️' : '▶️';
    playBtn.setAttribute('title', state.isPlaying ? 'Pause' : 'Lecture');
    playBtn.setAttribute('aria-label', state.isPlaying ? 'Pause' : 'Lecture');
  }

  const scrubber = container.querySelector('#audioScrubber') as HTMLInputElement | null;
  if (scrubber) {
    if (!isNaN(state.duration) && state.duration > 0) {
      scrubber.max = String(Math.floor(state.duration));
    }
    if (!isDraggingScrubber) {
      scrubber.value = String(Math.floor(state.currentTime));
    }
  }

  const currTimeLabel = container.querySelector('#audioCurrentTime');
  if (currTimeLabel && !isDraggingScrubber) {
    currTimeLabel.textContent = formatTime(state.currentTime);
  }

  const durationLabel = container.querySelector('#audioDuration');
  if (durationLabel && !isNaN(state.duration) && state.duration > 0) {
    durationLabel.textContent = formatTime(state.duration);
  }

  const rateBtn = container.querySelector('#btnAudioRate');
  if (rateBtn) {
    rateBtn.textContent = `${state.playbackRate}x`;
  }

  const muteBtn = container.querySelector('#btnAudioMute');
  if (muteBtn) {
    muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
  }
}

function attachAudioDockEvents(container: HTMLElement): void {
  const scrubber = container.querySelector('#audioScrubber') as HTMLInputElement | null;

  container.querySelector('#btnAudioPlayPause')?.addEventListener('click', () => {
    const s = audioPlayer.getState();
    if (s.isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.resume();
    }
  });

  container.querySelector('#btnAudioBack15')?.addEventListener('click', () => {
    audioPlayer.seekRelative(-15);
  });

  container.querySelector('#btnAudioForward15')?.addEventListener('click', () => {
    audioPlayer.seekRelative(15);
  });

  if (scrubber) {
    scrubber.addEventListener('input', () => {
      isDraggingScrubber = true;
      const currTimeLabel = container.querySelector('#audioCurrentTime');
      if (currTimeLabel) {
        currTimeLabel.textContent = formatTime(Number(scrubber.value));
      }
    });

    scrubber.addEventListener('change', () => {
      isDraggingScrubber = false;
      audioPlayer.seek(Number(scrubber.value));
    });
  }

  container.querySelector('#btnAudioRate')?.addEventListener('click', () => {
    audioPlayer.cyclePlaybackRate();
  });

  container.querySelector('#btnAudioMute')?.addEventListener('click', () => {
    audioPlayer.toggleMute();
  });

  container.querySelector('#btnAudioClose')?.addEventListener('click', () => {
    audioPlayer.stop();
  });
}
