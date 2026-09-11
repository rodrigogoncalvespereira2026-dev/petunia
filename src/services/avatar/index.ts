import { AvatarExpression, AvatarState } from '../../types/avatar';

class AvatarService {
  private _expression: AvatarExpression = 'neutral';
  private _state: AvatarState = 'idle';
  private listeners: ((expression: AvatarExpression, state: AvatarState) => void)[] = [];
  private blinkInterval: ReturnType<typeof setInterval> | null = null;
  private _isBlinking = false;

  get expression(): AvatarExpression {
    return this._expression;
  }

  get state(): AvatarState {
    return this._state;
  }

  get isBlinking(): boolean {
    return this._isBlinking;
  }

  onStateChange(listener: (expression: AvatarExpression, state: AvatarState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this._expression, this._state));
  }

  setExpression(expression: AvatarExpression) {
    this._expression = expression;
    this.notify();
  }

  setState(state: AvatarState) {
    this._state = state;
    this.notify();
  }

  startBlinking(rate: number = 3000) {
    this.stopBlinking();
    this.blinkInterval = setInterval(() => {
      this._isBlinking = true;
      this.notify();
      setTimeout(() => {
        this._isBlinking = false;
        this.notify();
      }, 150);
    }, rate);
  }

  stopBlinking() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
  }

  getMouthOpen(text: string, progress: number): number {
    const vowels = 'aeiouãõáéíóúàèìòùâêîôû';
    const charIndex = Math.floor(progress * text.length);
    const char = text[charIndex]?.toLowerCase() || '';
    
    if (vowels.includes(char)) {
      return 0.8 + Math.random() * 0.2;
    }
    if (char === 'm' || char === 'b' || char === 'p') {
      return 0.1;
    }
    if (char === 's' || char === 'z' || char === 'c') {
      return 0.3;
    }
    return 0.4 + Math.random() * 0.3;
  }

  getExpressionColor(expression: AvatarExpression): string {
    const colors: Record<AvatarExpression, string> = {
      neutral: '#FFB6C1',
      happy: '#FF69B4',
      excited: '#FF1493',
      thinking: '#DB7093',
      surprised: '#FFB347',
      calm: '#87CEEB',
      confused: '#DDA0DD',
      sleepy: '#B0C4DE',
      celebratory: '#FFD700',
    };
    return colors[expression];
  }
}

export const avatarService = new AvatarService();
