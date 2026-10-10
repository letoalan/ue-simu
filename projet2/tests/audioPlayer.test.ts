import { describe, it, expect, beforeEach } from 'vitest';
import { audioPlayer, getAudioCandidateUrls } from '../src/state/audioPlayer';

describe('Lecteur Audio & Fichiers Podcasts / Synthèses', () => {
  beforeEach(() => {
    audioPlayer.stop();
  });

  it('génère les URLs candidates conformes pour podcasts et synthèses', () => {
    const urlsPod = getAudioCandidateUrls(1, 1, 'podcast');
    expect(urlsPod[0]).toBe('./medias/mp3/podcasts/S1/1.m4a');
    expect(urlsPod[1]).toBe('./medias/mp3/podcasts/S1/1.mp3');

    const urlsSyn = getAudioCandidateUrls(2, 5, 'synthese');
    expect(urlsSyn[0]).toBe('./medias/mp3/syntheses/S2/5.m4a');
    expect(urlsSyn[1]).toBe('./medias/mp3/syntheses/S2/5.mp3');
  });

  it('génère les 16 paires d URLs pour les 16 directives proposées', () => {
    for (let s = 1; s <= 2; s++) {
      for (let d = 1; d <= 8; d++) {
        const podUrls = getAudioCandidateUrls(s, d, 'podcast');
        const synUrls = getAudioCandidateUrls(s, d, 'synthese');

        expect(podUrls[0]).toBe(`./medias/mp3/podcasts/S${s}/${d}.m4a`);
        expect(synUrls[0]).toBe(`./medias/mp3/syntheses/S${s}/${d}.m4a`);
      }
    }
  });

  it('gère le cycle de vie de lecture, pause et arrêt', () => {
    audioPlayer.playTrack(1, 2, 'Énergies Propres', 'podcast');
    let state = audioPlayer.getState();

    expect(state.currentTrack).not.toBeNull();
    expect(state.currentTrack?.scenarioId).toBe(1);
    expect(state.currentTrack?.directiveId).toBe(2);
    expect(state.currentTrack?.type).toBe('podcast');
    expect(state.currentTrack?.directiveName).toBe('Énergies Propres');

    audioPlayer.pause();
    state = audioPlayer.getState();
    expect(state.isPlaying).toBe(false);

    audioPlayer.stop();
    state = audioPlayer.getState();
    expect(state.currentTrack).toBeNull();
    expect(state.isPlaying).toBe(false);
  });

  it('permet de changer de vitesse de lecture et de couper le son', () => {
    const initialRate = audioPlayer.getState().playbackRate;
    const nextRate = audioPlayer.cyclePlaybackRate();
    expect(nextRate).not.toBe(initialRate);
    expect([1.0, 1.25, 1.5, 2.0]).toContain(nextRate);

    expect(audioPlayer.getState().isMuted).toBe(false);
    audioPlayer.toggleMute();
    expect(audioPlayer.getState().isMuted).toBe(true);
    audioPlayer.toggleMute();
    expect(audioPlayer.getState().isMuted).toBe(false);
  });

  it('notifie les abonnés lors des changements d état', () => {
    let callCount = 0;
    const unsub = audioPlayer.subscribe(() => {
      callCount++;
    });

    audioPlayer.playTrack(2, 3, 'Sécurité', 'synthese');
    expect(callCount).toBeGreaterThanOrEqual(2);

    unsub();
  });
});
