export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceSettings {
  enabled: boolean;
  speed: number;
  volume: number;
  language: string;
  autoPlay: boolean;
}

export interface STTProvider {
  name: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<string>;
  isAvailable: () => boolean;
}

export interface TTSProvider {
  name: string;
  speak: (text: string, options?: TTSSpeakOptions) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: () => boolean;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  isAvailable: () => boolean;
}

export interface TTSSpeakOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  onDone?: () => void;
  onError?: (error: string) => void;
}
