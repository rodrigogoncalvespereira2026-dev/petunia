import { STTProvider } from '../../types/voice';

export class WebSpeechSTT implements STTProvider {
  name = 'web-speech';
  private recognition: any = null;
  private resolveResult: ((text: string) => void) | null = null;

  constructor() {
    if (typeof window === 'undefined') return;

    const API =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!API) {
      console.warn('SpeechRecognition API not found');
      return;
    }

    try {
      this.recognition = new API();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'pt-PT';
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        console.log('STT result:', transcript);
        this.resolveResult?.(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('STT error:', event.error);
        if (event.error === 'no-speech') {
          this.resolveResult?.('');
        } else {
          this.resolveResult?.('');
        }
      };

      this.recognition.onend = () => {
        console.log('STT ended');
      };

      console.log('STT initialized OK');
    } catch (e) {
      console.error('STT init failed:', e);
      this.recognition = null;
    }
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    return new Promise((resolve, reject) => {
      this.recognition.onstart = () => {
        console.log('STT started');
        resolve();
      };
      try {
        this.recognition.start();
      } catch (e) {
        console.error('STT start failed:', e);
        reject(new Error('Could not start speech recognition.'));
      }
    });
  }

  async stopListening(): Promise<string> {
    if (!this.recognition) return '';
    return new Promise((resolve) => {
      this.resolveResult = (text) => {
        resolve(text);
        try { this.recognition.stop(); } catch {}
      };
      try {
        this.recognition.stop();
      } catch {
        resolve('');
      }
    });
  }

  isAvailable(): boolean {
    return this.recognition !== null;
  }
}

export class MobileSTT implements STTProvider {
  name = 'mobile-stt';
  async startListening(): Promise<void> {
    throw new Error('Speech recognition not available on this device.');
  }
  async stopListening(): Promise<string> { return ''; }
  isAvailable(): boolean { return false; }
}

export function createSTTProvider(): STTProvider {
  if (typeof window !== 'undefined') {
    const API =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (API) {
      console.log('Using WebSpeechSTT');
      return new WebSpeechSTT();
    }
  }
  console.log('Using MobileSTT (no API found)');
  return new MobileSTT();
}
