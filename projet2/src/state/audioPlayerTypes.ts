export type AudioType = 'podcast' | 'synthese';

export interface ActiveTrack {
  scenarioId: number;
  directiveId: number;
  directiveName: string;
  type: AudioType;
  url: string;
}

export interface AudioPlayerState {
  currentTrack: ActiveTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AudioListener = (state: AudioPlayerState) => void;

/**
 * Retourne les URL potentielles pour un enregistrement audio (m4a en priorité, mp3 en fallback).
 */
export function getAudioCandidateUrls(scenarioId: number, directiveId: number, type: AudioType): string[] {
  const folder = type === 'podcast' ? 'podcasts' : 'syntheses';
  return [
    `./medias/mp3/${folder}/S${scenarioId}/${directiveId}.m4a`,
    `./medias/mp3/${folder}/S${scenarioId}/${directiveId}.mp3`,
    `./medias/mp3/${folder}/s${scenarioId}/${directiveId}.m4a`,
    `./medias/mp3/${folder}/s${scenarioId}/${directiveId}.mp3`
  ];
}
