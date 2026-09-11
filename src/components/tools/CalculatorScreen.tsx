import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalculatorService } from '../../services/tools';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

export function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0' || result !== null) {
      setDisplay(num);
      setResult(null);
    } else {
      setDisplay(display + num);
    }
    setExpression(expression + num);
  };

  const handleOperator = (op: string) => {
    setDisplay(display + ' ' + op + ' ');
    setExpression(expression + op);
    setResult(null);
  };

  const handleEquals = () => {
    try {
      const calcResult = CalculatorService.calculate(expression);
      setResult(calcResult.result);
      setDisplay(CalculatorService.formatResult(calcResult.result));
      setExpression('');
    } catch (error) {
      setDisplay('Erro');
      setExpression('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setResult(null);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression('');
    }
  };

  const Button = ({ label, onPress, type = 'number' }: { label: string; onPress: () => void; type?: string }) => (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'operator' && styles.operatorButton,
        type === 'equals' && styles.equalsButton,
        type === 'clear' && styles.clearButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          type === 'operator' && styles.operatorText,
          type === 'equals' && styles.equalsText,
          type === 'clear' && styles.clearText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText} numberOfLines={1}>
          {display}
        </Text>
      </View>

      <View style={styles.buttonGrid}>
        <Button label="C" onPress={handleClear} type="clear" />
        <Button label="⌫" onPress={handleBackspace} type="clear" />
        <Button label="%" onPress={() => handleOperator('%')} type="operator" />
        <Button label="÷" onPress={() => handleOperator('/')} type="operator" />

        <Button label="7" onPress={() => handleNumber('7')} />
        <Button label="8" onPress={() => handleNumber('8')} />
        <Button label="9" onPress={() => handleNumber('9')} />
        <Button label="×" onPress={() => handleOperator('*')} type="operator" />

        <Button label="4" onPress={() => handleNumber('4')} />
        <Button label="5" onPress={() => handleNumber('5')} />
        <Button label="6" onPress={() => handleNumber('6')} />
        <Button label="−" onPress={() => handleOperator('-')} type="operator" />

        <Button label="1" onPress={() => handleNumber('1')} />
        <Button label="2" onPress={() => handleNumber('2')} />
        <Button label="3" onPress={() => handleNumber('3')} />
        <Button label="+" onPress={() => handleOperator('+')} type="operator" />

        <Button label="0" onPress={() => handleNumber('0')} />
        <Button label="." onPress={() => handleNumber('.')} />
        <Button label="=" onPress={handleEquals} type="equals" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  display: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    minHeight: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  displayText: {
    fontSize: FontSizes.xxl,
    fontWeight: '300',
    color: Colors.text,
  },
  buttonGrid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  operatorButton: {
    backgroundColor: Colors.primaryLight,
  },
  equalsButton: {
    backgroundColor: Colors.primary,
  },
  clearButton: {
    backgroundColor: '#FFE0E0',
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: '500',
    color: Colors.text,
  },
  operatorText: {
    color: Colors.primary,
  },
  equalsText: {
    color: '#FFFFFF',
  },
  clearText: {
    color: Colors.error,
  },
});
