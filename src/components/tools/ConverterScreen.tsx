import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConverterService } from '../../services/tools';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

export function ConverterScreen() {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const categories = ConverterService.getCategories();
  const units = ConverterService.getUnits(category);

  useEffect(() => {
    if (units.length > 0) {
      setFromUnit(units[0].code);
      setToUnit(units.length > 1 ? units[1].code : units[0].code);
    }
  }, [category]);

  useEffect(() => {
    if (value && fromUnit && toUnit) {
      try {
        const numValue = parseFloat(value.replace(',', '.'));
        const conversion = ConverterService.convert(numValue, fromUnit, toUnit, category);
        setResult(conversion.result);
      } catch {
        setResult(null);
      }
    }
  }, [value, fromUnit, toUnit, category]);

  const categoryLabels: Record<string, string> = {
    length: 'Comprimento',
    weight: 'Peso',
    temperature: 'Temperatura',
    volume: 'Volume',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Conversor de Unidades</Text>

      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && styles.categoryActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
              {categoryLabels[cat] || cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="0"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.unitsContainer}>
        <View style={styles.unitBox}>
          <Text style={styles.label}>De</Text>
          <ScrollView style={styles.unitList}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.code}
                style={[styles.unitButton, fromUnit === unit.code && styles.unitActive]}
                onPress={() => setFromUnit(unit.code)}
              >
                <Text style={[styles.unitText, fromUnit === unit.code && styles.unitTextActive]}>
                  {unit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.swapButton}
          onPress={() => {
            setFromUnit(toUnit);
            setToUnit(fromUnit);
          }}
        >
          <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.unitBox}>
          <Text style={styles.label}>Para</Text>
          <ScrollView style={styles.unitList}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.code}
                style={[styles.unitButton, toUnit === unit.code && styles.unitActive]}
                onPress={() => setToUnit(unit.code)}
              >
                <Text style={[styles.unitText, toUnit === unit.code && styles.unitTextActive]}>
                  {unit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {result !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Resultado</Text>
          <Text style={styles.resultValue}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  categoryActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
  unitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  unitBox: {
    flex: 1,
  },
  unitList: {
    maxHeight: 150,
  },
  unitButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  unitActive: {
    backgroundColor: Colors.primaryLight,
  },
  unitText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  unitTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  swapButton: {
    padding: Spacing.md,
  },
  resultContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  resultValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
