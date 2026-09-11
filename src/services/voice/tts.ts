import * as Speech from 'expo-speech';
import { TTSProvider, TTSSpeakOptions } from '../../types/voice';

export class ExpoSpeechTTS implements TTSProvider {
  name = 'expo-speech';
  private speaking = false;

  async speak(text: string, options?: TTSSpeakOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.speaking = true;
      Speech.speak(text, {
        language: options?.language || 'pt-PT',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 1.0,
        volume: options?.volume || 1.0,
        onDone: () => {
          this.speaking = false;
          options?.onDone?.();
          resolve();
        },
        onError: (error) => {
          this.speaking = false;
          options?.onError?.(String(error));
          reject(error);
        },
      });
    });
  }

  stop(): void {
    Speech.stop();
    this.speaking = false;
  }

  pause(): void {
    Speech.pause();
  }

  resume(): void {
    Speech.resume();
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  setSpeed(speed: number): void {
    // Speed is set per speak call in expo-speech
  }

  setVolume(volume: number): void {
    // Volume is set per speak call in expo-speech
  }

  isAvailable(): boolean {
    return true;
  }
}
