import { InteractionManager } from 'react-native';

export const Performance = {
  async runAfterInteractions<T>(fn: () => T | Promise<T>): Promise<T> {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(async () => {
        const result = await fn();
        resolve(result);
      });
    });
  },

  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    if (__DEV__) {
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    }
    return result;
  },

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    if (__DEV__) {
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    }
    return result;
  },
};
