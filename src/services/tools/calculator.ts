import { CalculatorResult } from '../../types/tools';

export const CalculatorService = {
  calculate(expression: string): CalculatorResult {
    try {
      const sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '.')
        .replace(/[^0-9+\-*/().]/g, '');

      const result = Function(`"use strict"; return (${sanitized})`)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Resultado inválido');
      }

      return {
        expression,
        result: Math.round(result * 1000000) / 1000000,
      };
    } catch (error) {
      throw new Error('Expressão matemática inválida');
    }
  },

  formatResult(result: number): string {
    if (Number.isInteger(result)) {
      return result.toString();
    }
    return result.toFixed(6).replace(/\.?0+$/, '');
  },
};
