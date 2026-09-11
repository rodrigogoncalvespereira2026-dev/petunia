import { ExpoSpeechTTS } from './tts';
import { createSTTProvider } from './stt';
import { VoiceState, VoiceSettings } from '../../types/voice';

class VoiceService {
  private tts: ExpoSpeechTTS;
  private stt: ReturnType<typeof createSTTProvider>;
  private _state: VoiceState = 'idle';
  private listeners: ((state: VoiceState) => void)[] = [];

  constructor() {
    this.tts = new ExpoSpeechTTS();
    this.stt = createSTTProvider();
  }

  get state(): VoiceState {
    return this._state;
  }

  private setState(state: VoiceState) {
    this._state = state;
    this.listeners.forEach((listener) => listener(state));
  }

  onStateChange(listener: (state: VoiceState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async startListening(): Promise<void> {
    if (!this.stt.isAvailable()) {
      throw new Error('Speech recognition not available on this device');
    }
    this.setState('listening');
    try {
      await this.stt.startListening();
    } catch (error) {
      this.setState('idle');
      throw error;
    }
  }

  async stopListening(): Promise<string> {
    this.setState('processing');
    try {
      const text = await this.stt.stopListening();
      return text;
    } finally {
      this.setState('idle');
    }
  }

  async speak(text: string, settings?: Partial<VoiceSettings>): Promise<void> {
    this.setState('speaking');
    try {
      await this.tts.speak(text, {
        language: settings?.language || 'pt-PT',
        rate: settings?.speed || 1.0,
        volume: settings?.volume || 1.0,
      });
    } finally {
      this.setState('idle');
    }
  }

  stopSpeaking(): void {
    this.tts.stop();
    this.setState('idle');
  }

  isSTTAvailable(): boolean {
    return this.stt.isAvailable();
  }

  isTTSAvailable(): boolean {
    return this.tts.isAvailable();
  }

  isSpeaking(): boolean {
    return this.tts.isSpeaking();
  }
}

export const voiceService = new VoiceService();
