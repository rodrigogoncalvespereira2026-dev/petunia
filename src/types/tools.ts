export type ToolType = 'calculator' | 'converter' | 'timer' | 'search' | 'weather' | 'notes';

export interface Tool {
  id: string;
  type: ToolType;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface CalculatorResult {
  expression: string;
  result: number;
}

export interface ConversionResult {
  value: number;
  from: string;
  to: string;
  result: number;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface TimerState {
  isRunning: boolean;
  seconds: number;
  label: string;
}
