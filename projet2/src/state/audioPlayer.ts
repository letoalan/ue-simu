import {
  type AudioType,
  type AudioPlayerState,
  type AudioListener,
  getAudioCandidateUrls
} from './audioPlayerTypes';

export * from './audioPlayerTypes';

class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1.0,
    isMuted: false,
    isLoading: false,
    error: null
  };
  private listeners: Set<AudioListener> = new Set();
  private candidateIndex = 0;
  private candidateList: string[] = [];

  constructor() {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement(): void {
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.audio.addEventListener('play', () => { this.state.isPlaying = true; this.state.isLoading = false; this.state.error = null; this.notify(); });
    this.audio.addEventListener('pause', () => { this.state.isPlaying = false; this.notify(); });
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) { this.state.currentTime = this.audio.currentTime; if (!isNaN(this.audio.duration)) this.state.duration = this.audio.duration; this.notify(); }
    });
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && !isNaN(this.audio.duration)) { this.state.duration = this.audio.duration; this.state.isLoading = false; this.notify(); }
    });
    this.audio.addEventListener('ended', () => { this.state.isPlaying = false; this.state.currentTime = 0; this.notify(); });
    this.audio.addEventListener('error', () => { this.handleCandidateError(); });
  }

  private handleCandidateError(): void {
    if (this.candidateIndex + 1 < this.candidateList.length) {
      this.candidateIndex++;
      const nextUrl = this.candidateList[this.candidateIndex];
      if (this.audio) {
        this.audio.src = nextUrl;
        if (this.state.currentTrack) this.state.currentTrack.url = nextUrl;
        this.audio.play().catch(() => {});
      }
    } else {
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.state.error = 'Fichier audio introuvable';
      this.notify();
    }
  }

  getState(): Readonly<AudioPlayerState> {
    return this.state;
  }

  subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) listener(this.state);
  }

  playTrack(
    scenarioOrObj: number | { scenarioId: number; directiveId: number; directiveName: string; type: AudioType },
    directiveId?: number,
    directiveName?: string,
    type?: AudioType
  ): void {
    let sId: number;
    let dId: number;
    let dName: string;
    let aType: AudioType;

    if (typeof scenarioOrObj === 'object') {
      sId = scenarioOrObj.scenarioId;
      dId = scenarioOrObj.directiveId;
      dName = scenarioOrObj.directiveName;
      aType = scenarioOrObj.type;
    } else {
      sId = scenarioOrObj;
      dId = directiveId!;
      dName = directiveName!;
      aType = type!;
    }

    this.candidateList = getAudioCandidateUrls(sId, dId, aType);
    this.candidateIndex = 0;
    const initialUrl = this.candidateList[0];

    this.state.currentTrack = {
      scenarioId: sId,
      directiveId: dId,
      directiveName: dName,
      type: aType,
      url: initialUrl
    };

    this.state.isPlaying = true;
    this.state.isLoading = true;
    this.state.error = null;
    this.state.currentTime = 0;

    if (this.audio) {
      this.audio.src = initialUrl;
      this.audio.playbackRate = this.state.playbackRate;
      this.audio.volume = this.state.volume;
      this.audio.muted = this.state.isMuted;
      this.audio.play().catch(err => {
        console.warn(`Tentative de lecture audio ${initialUrl}:`, err);
      });
    }

    this.notify();
  }

  togglePlay(trackInfo?: { scenarioId: number; directiveId: number; directiveName: string; type: AudioType }): void {
    if (trackInfo) {
      const isSame = this.state.currentTrack
        && this.state.currentTrack.scenarioId === trackInfo.scenarioId
        && this.state.currentTrack.directiveId === trackInfo.directiveId
        && this.state.currentTrack.type === trackInfo.type;

      if (isSame) {
        if (this.state.isPlaying) this.pause();
        else this.resume();
        return;
      }
      this.playTrack(trackInfo);
      return;
    }

    if (this.state.isPlaying) this.pause();
    else this.resume();
  }

  pause(): void {
    this.state.isPlaying = false;
    if (this.audio) this.audio.pause();
    this.notify();
  }

  resume(): void {
    if (this.state.currentTrack) {
      this.state.isPlaying = true;
      if (this.audio) this.audio.play().catch(() => {});
      this.notify();
    }
  }

  seek(time: number): void {
    this.state.currentTime = time;
    if (this.audio) this.audio.currentTime = time;
    this.notify();
  }

  seekRelative(seconds: number): void {
    const target = Math.max(0, Math.min(this.state.duration || Infinity, this.state.currentTime + seconds));
    this.seek(target);
  }

  setPlaybackRate(rate: number): void {
    this.state.playbackRate = rate;
    if (this.audio) this.audio.playbackRate = rate;
    this.notify();
  }

  cyclePlaybackRate(): number {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const idx = rates.indexOf(this.state.playbackRate);
    const next = rates[(idx + 1) % rates.length];
    this.setPlaybackRate(next);
    return next;
  }

  toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
    if (this.audio) this.audio.muted = this.state.isMuted;
    this.notify();
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
    }
    this.state.currentTrack = null;
    this.state.isPlaying = false;
    this.state.currentTime = 0;
    this.state.duration = 0;
    this.state.error = null;
    this.notify();
  }
}

export const audioPlayer = new AudioPlayerService();
