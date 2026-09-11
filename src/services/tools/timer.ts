import { TimerState } from '../../types/tools';

type TimerCallback = (seconds: number) => void;

class TimerService {
  private interval: ReturnType<typeof setInterval> | null = null;
  private _state: TimerState = { isRunning: false, seconds: 0, label: '' };
  private listeners: ((state: TimerState) => void)[] = [];
  private callback: TimerCallback | null = null;

  get state(): TimerState {
    return this._state;
  }

  onStateChange(listener: (state: TimerState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(state: TimerState) {
    this._state = state;
    this.listeners.forEach((l) => l(state));
  }

  start(durationSeconds: number, label: string = '', onComplete?: () => void) {
    this.stop();
    
    this.setState({ isRunning: true, seconds: durationSeconds, label });
    
    this.interval = setInterval(() => {
      const newSeconds = this._state.seconds - 1;
      this.setState({ ...this._state, seconds: newSeconds });
      
      if (newSeconds <= 0) {
        this.stop();
        onComplete?.();
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({ isRunning: false, seconds: 0, label: '' });
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({ ...this._state, isRunning: false });
  }

  resume() {
    if (this._state.seconds > 0 && !this.interval) {
      this.setState({ ...this._state, isRunning: true });
      this.interval = setInterval(() => {
        const newSeconds = this._state.seconds - 1;
        this.setState({ ...this._state, seconds: newSeconds });
        
        if (newSeconds <= 0) {
          this.stop();
        }
      }, 1000);
    }
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  parseTimeInput(input: string): number {
    const lower = input.toLowerCase();
    let totalSeconds = 0;

    const hoursMatch = lower.match(/(\d+)\s*(?:hora|horas|h)/);
    const minutesMatch = lower.match(/(\d+)\s*(?:minuto|minutos|min|m)/);
    const secondsMatch = lower.match(/(\d+)\s*(?:segundo|segundos|seg|s)/);

    if (hoursMatch) totalSeconds += parseInt(hoursMatch[1]) * 3600;
    if (minutesMatch) totalSeconds += parseInt(minutesMatch[1]) * 60;
    if (secondsMatch) totalSeconds += parseInt(secondsMatch[1]);

    if (totalSeconds === 0) {
      const pureNumber = lower.match(/(\d+)/);
      if (pureNumber) {
        totalSeconds = parseInt(pureNumber[1]) * 60;
      }
    }

    return totalSeconds;
  }
}

export const timerService = new TimerService();
