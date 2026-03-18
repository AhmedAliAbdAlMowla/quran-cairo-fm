export interface LanguageConfig {
  code: 'ar' | 'en';
  dir: 'rtl' | 'ltr';
  label: string;
}

export interface RadioState {
  status: 'ready' | 'playing' | 'paused' | 'stopped' | 'refreshing' | 'loading' | 'error';
  volume: number;
  playbackTime: number;
}

export interface StatusConfig {
  text: string;
  class?: string;
}

export interface RadioStrings {
  ready: string;
  playing: string;
  paused: string;
  stopped: string;
  refreshing: string;
  loading: string;
  error: string;
  play: string;
  stop: string;
  refresh: string;
  live: string;
  pressAgain: string;
}
