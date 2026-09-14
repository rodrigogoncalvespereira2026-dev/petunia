import { STTProvider } from '../../types/voice';

export class WebSpeechSTT implements STTProvider {
  name = 'web-speech';
  private recognition: any = null;
  private resolveResult: ((text: string) => void) | null = null;
  private rejectError: ((err: Error) => void) | null = null;

  constructor() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'pt-PT';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      this.resolveResult?.(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        this.rejectError?.(new Error('Permissão de microfone negada. Autoriza o microfone nas definições do browser.'));
      } else if (event.error === 'no-speech') {
        this.resolveResult?.('');
      } else {
        this.rejectError?.(new Error(`Erro de reconhecimento: ${event.error}`));
      }
    };

    this.recognition.onend = () => {
      // Recognition ended
    };
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Reconhecimento de voz não disponível neste browser.');
    }
    return new Promise((resolve, reject) => {
      this.rejectError = reject;
      this.recognition.onstart = () => resolve();
      try {
        this.recognition.start();
      } catch (e) {
        reject(new Error('Não foi possível iniciar o reconhecimento de voz.'));
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
      this.rejectError = (err) => {
        resolve('');
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

  async stopListening(): Promise<string> {
    return '';
  }

  isAvailable(): boolean {
    return false;
  }
}

export function createSTTProvider(): STTProvider {
  if (typeof window !== 'undefined') {
    const API =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (API) {
      return new WebSpeechSTT();
    }
  }
  return new MobileSTT();
}
