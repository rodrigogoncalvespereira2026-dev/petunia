import { CalculatorService } from '../services/tools/calculator';
import { ConverterService } from '../services/tools/converter';
import { timerService } from '../services/tools/timer';

describe('CalculatorService', () => {
  test('should add two numbers', () => {
    const result = CalculatorService.calculate('2+3');
    expect(result.result).toBe(5);
  });

  test('should subtract numbers', () => {
    const result = CalculatorService.calculate('10-4');
    expect(result.result).toBe(6);
  });

  test('should multiply numbers', () => {
    const result = CalculatorService.calculate('6*7');
    expect(result.result).toBe(42);
  });

  test('should divide numbers', () => {
    const result = CalculatorService.calculate('15/3');
    expect(result.result).toBe(5);
  });

  test('should handle complex expressions', () => {
    const result = CalculatorService.calculate('(2+3)*4');
    expect(result.result).toBe(20);
  });

  test('should throw on invalid expression', () => {
    expect(() => CalculatorService.calculate('abc')).toThrow();
  });
});

describe('ConverterService', () => {
  test('should convert meters to kilometers', () => {
    const result = ConverterService.convert(1000, 'm', 'km', 'length');
    expect(result.result).toBe(1);
  });

  test('should convert Celsius to Fahrenheit', () => {
    const result = ConverterService.convert(100, 'C', 'F', 'temperature');
    expect(result.result).toBe(212);
  });

  test('should convert kilograms to grams', () => {
    const result = ConverterService.convert(1, 'kg', 'g', 'weight');
    expect(result.result).toBe(1000);
  });
});

describe('timerService', () => {
  test('should parse time input correctly', () => {
    expect(timerService.parseTimeInput('5 min')).toBe(300);
    expect(timerService.parseTimeInput('1 hora')).toBe(3600);
    expect(timerService.parseTimeInput('30 seg')).toBe(30);
    expect(timerService.parseTimeInput('1:30')).toBe(90);
  });

  test('should format time correctly', () => {
    expect(timerService.formatTime(65)).toBe('1:05');
    expect(timerService.formatTime(3661)).toBe('1:01:01');
    expect(timerService.formatTime(30)).toBe('0:30');
  });
});
