import { STTProvider } from '../../types/voice';

// Web Speech API STT (works on web)
export class WebSpeechSTT implements STTProvider {
  name = 'web-speech';
  private recognition: any = null;
  private resolveResult: ((text: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'pt-PT';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.resolveResult?.(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.resolveResult?.('');
      };

      this.recognition.onend = () => {
        // Recognition ended
      };
    }
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    return new Promise((resolve) => {
      this.recognition.onstart = () => resolve();
      this.recognition.start();
    });
  }

  async stopListening(): Promise<string> {
    if (!this.recognition) {
      return '';
    }
    return new Promise((resolve) => {
      this.resolveResult = (text) => {
        resolve(text);
        this.recognition.stop();
      };
    });
  }

  isAvailable(): boolean {
    return this.recognition !== null;
  }
}

// Placeholder for mobile STT providers (Whisper, Google STT, etc.)
export class MobileSTT implements STTProvider {
  name = 'mobile-stt';

  async startListening(): Promise<void> {
    // TODO: Implement with expo-av or native module
    throw new Error('Mobile STT not yet implemented. Use Web Speech API on web.');
  }

  async stopListening(): Promise<string> {
    return '';
  }

  isAvailable(): boolean {
    return false;
  }
}

export function createSTTProvider(): STTProvider {
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    return new WebSpeechSTT();
  }
  return new MobileSTT();
}
