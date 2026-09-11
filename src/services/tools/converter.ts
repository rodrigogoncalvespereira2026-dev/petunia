import { ConversionResult } from '../../types/tools';

interface ConversionUnit {
  name: string;
  factor: number;
}

const conversions: Record<string, Record<string, ConversionUnit>> = {
  length: {
    m: { name: 'Metros', factor: 1 },
    km: { name: 'Quilómetros', factor: 1000 },
    cm: { name: 'Centímetros', factor: 0.01 },
    mm: { name: 'Milímetros', factor: 0.001 },
    mi: { name: 'Milhas', factor: 1609.344 },
    yd: { name: 'Jardas', factor: 0.9144 },
    ft: { name: 'Pés', factor: 0.3048 },
    in: { name: 'Polegadas', factor: 0.0254 },
  },
  weight: {
    kg: { name: 'Quilogramas', factor: 1 },
    g: { name: 'Gramas', factor: 0.001 },
    mg: { name: 'Miligramas', factor: 0.000001 },
    lb: { name: 'Libras', factor: 0.453592 },
    oz: { name: 'Onças', factor: 0.0283495 },
  },
  temperature: {
    C: { name: 'Celsius', factor: 1 },
    F: { name: 'Fahrenheit', factor: 1 },
    K: { name: 'Kelvin', factor: 1 },
  },
  volume: {
    L: { name: 'Litros', factor: 1 },
    mL: { name: 'Mililitros', factor: 0.001 },
    gal: { name: 'Galões', factor: 3.78541 },
    cup: { name: 'Copos', factor: 0.236588 },
  },
};

export const ConverterService = {
  getCategories(): string[] {
    return Object.keys(conversions);
  },

  getUnits(category: string): { code: string; name: string }[] {
    const cat = conversions[category];
    if (!cat) return [];
    return Object.entries(cat).map(([code, unit]) => ({
      code,
      name: unit.name,
    }));
  },

  convert(value: number, from: string, to: string, category: string): ConversionResult {
    const cat = conversions[category];
    if (!cat || !cat[from] || !cat[to]) {
      throw new Error('Unidade não encontrada');
    }

    if (category === 'temperature') {
      return this.convertTemperature(value, from, to);
    }

    const fromFactor = cat[from].factor;
    const toFactor = cat[to].factor;
    const result = (value * fromFactor) / toFactor;

    return {
      value,
      from: cat[from].name,
      to: cat[to].name,
      result: Math.round(result * 1000000) / 1000000,
    };
  },

  convertTemperature(value: number, from: string, to: string): ConversionResult {
    let celsius: number;

    switch (from) {
      case 'C':
        celsius = value;
        break;
      case 'F':
        celsius = (value - 32) * (5 / 9);
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        throw new Error('Unidade de temperatura inválida');
    }

    let result: number;
    switch (to) {
      case 'C':
        result = celsius;
        break;
      case 'F':
        result = celsius * (9 / 5) + 32;
        break;
      case 'K':
        result = celsius + 273.15;
        break;
      default:
        throw new Error('Unidade de temperatura inválida');
    }

    const fromName = conversions.temperature[from].name;
    const toName = conversions.temperature[to].name;

    return {
      value,
      from: fromName,
      to: toName,
      result: Math.round(result * 100) / 100,
    };
  },
};
