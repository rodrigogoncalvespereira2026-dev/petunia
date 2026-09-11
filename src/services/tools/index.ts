import { CalculatorService } from './calculator';
import { ConverterService } from './converter';
import { timerService } from './timer';
import { SearchService } from './search';
import { Tool, ToolType } from '../../types/tools';

export const tools: Tool[] = [
  {
    id: 'calculator',
    type: 'calculator',
    name: 'Calculadora',
    description: 'Realiza cálculos matemáticos',
    icon: 'calculator',
    enabled: true,
  },
  {
    id: 'converter',
    type: 'converter',
    name: 'Conversor',
    description: 'Converte unidades de medida',
    icon: 'swap-horizontal',
    enabled: true,
  },
  {
    id: 'timer',
    type: 'timer',
    name: 'Temporizador',
    description: 'Define temporizadores e alarmes',
    icon: 'time',
    enabled: true,
  },
  {
    id: 'search',
    type: 'search',
    name: 'Pesquisa',
    description: 'Pesquisa na Internet',
    icon: 'search',
    enabled: true,
  },
];

export { CalculatorService, ConverterService, timerService, SearchService };

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByType(type: ToolType): Tool[] {
  return tools.filter((t) => t.type === type);
}
