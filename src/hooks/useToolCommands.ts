import { CalculatorService, ConverterService, timerService, SearchService } from '../services/tools';
import { SearchResult } from '../types/tools';

interface ToolResult {
  isTool: boolean;
  response?: string;
  searchResults?: SearchResult[];
}

export function useToolCommands() {
  const processMessage = async (text: string): Promise<ToolResult> => {
    const lower = text.toLowerCase();

    if (lower.startsWith('calcula') || lower.startsWith('calcula ') || lower.match(/^[\d+\-*/().\s]+$/)) {
      const expression = lower
        .replace(/^(?:petúnia|petunia|calcula|calc)\s*/i, '')
        .trim();
      
      if (expression) {
        try {
          const result = CalculatorService.calculate(expression);
          return {
            isTool: true,
            response: `Resultado: ${CalculatorService.formatResult(result.result)}`,
          };
        } catch {
          return {
            isTool: true,
            response: 'Não consegui calcular essa expressão.',
          };
        }
      }
    }

    if (lower.includes('converte') || lower.includes('converter')) {
      const match = lower.match(/converte?\s+([\d.,]+)\s+(\w+)\s+(?:em|para)\s+(\w+)/);
      if (match) {
        const value = parseFloat(match[1].replace(',', '.'));
        const from = match[2];
        const to = match[3];

        try {
          const categories = ConverterService.getCategories();
          for (const cat of categories) {
            const units = ConverterService.getUnits(cat);
            const fromUnit = units.find((u) => u.code === from || u.name.toLowerCase() === from);
            const toUnit = units.find((u) => u.code === to || u.name.toLowerCase() === to);

            if (fromUnit && toUnit) {
              const result = ConverterService.convert(value, fromUnit.code, toUnit.code, cat);
              return {
                isTool: true,
                response: `${value} ${result.from} = ${result.result} ${result.to}`,
              };
            }
          }
          return {
            isTool: true,
            response: 'Não encontrei essas unidades para conversão.',
          };
        } catch {
          return {
            isTool: true,
            response: 'Erro ao converter. Verifica as unidades.',
          };
        }
      }
    }

    if (lower.includes('temporizador') || lower.includes('timer') || lower.includes('alarme')) {
      const match = lower.match(/(?:temporizador|timer|alarme)\s+(?:de\s+)?(\d+)\s*(min|seg|hora)/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        let seconds = value;

        if (unit === 'min') seconds = value * 60;
        else if (unit === 'hora') seconds = value * 3600;

        timerService.start(seconds, `Temporizador: ${value} ${unit}`);
        return {
          isTool: true,
          response: `Temporizador definido para ${value} ${unit}.`,
        };
      }
    }

    if (lower.includes('pesquisa') || lower.includes('procura') || lower.includes('search')) {
      const query = lower
        .replace(/^(?:petúnia|petunia|pesquisa|procura|search)\s*/i, '')
        .trim();

      if (query) {
        const results = await SearchService.searchMultiple(query);
        if (results.length > 0) {
          return {
            isTool: true,
            response: `Encontrei ${results.length} resultados:`,
            searchResults: results.slice(0, 3),
          };
        }
        return {
          isTool: true,
          response: 'Não encontrei resultados para essa pesquisa.',
        };
      }
    }

    return { isTool: false };
  };

  return { processMessage };
}
