import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar3D } from './Avatar3D';
import { avatarService } from '../../services/avatar';
import { AvatarExpression, AvatarState } from '../../types/avatar';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

const expressions: { value: AvatarExpression; label: string; icon: string }[] = [
  { value: 'neutral', label: 'Neutro', icon: 'meh' },
  { value: 'happy', label: 'Feliz', icon: 'happy' },
  { value: 'excited', label: 'Animada', icon: 'rocket' },
  { value: 'thinking', label: 'A pensar', icon: 'bulb' },
  { value: 'surprised', label: 'Surpresa', icon: 'alert-circle' },
  { value: 'calm', label: 'Calma', icon: 'water' },
  { value: 'confused', label: 'Confusa', icon: 'help-circle' },
  { value: 'sleepy', label: 'Sonolenta', icon: 'moon' },
  { value: 'celebratory', label: 'Celebração', icon: 'trophy' },
];

const states: { value: AvatarState; label: string }[] = [
  { value: 'idle', label: 'Parada' },
  { value: 'listening', label: 'A ouvir' },
  { value: 'thinking', label: 'A pensar' },
  { value: 'speaking', label: 'A falar' },
  { value: 'greeting', label: 'A cumprimentar' },
];

export function AvatarScreen() {
  const [expression, setExpression] = useState<AvatarExpression>('neutral');
  const [state, setState] = useState<AvatarState>('idle');

  useEffect(() => {
    const unsubscribe = avatarService.onStateChange((expr, st) => {
      setExpression(expr);
      setState(st);
    });
    return unsubscribe;
  }, []);

  const handleExpressionChange = (expr: AvatarExpression) => {
    avatarService.setExpression(expr);
  };

  const handleStateChange = (st: AvatarState) => {
    avatarService.setState(st);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avatar</Text>
        <Text style={styles.headerSubtitle}>Expressões e animações</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Avatar3D size={350} showControls />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado:</Text>
        <Text style={styles.statusValue}>{state}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expressões</Text>
        <View style={styles.optionsGrid}>
          {expressions.map((expr) => (
            <TouchableOpacity
              key={expr.value}
              style={[
                styles.optionButton,
                expression === expr.value && styles.optionActive,
              ]}
              onPress={() => handleExpressionChange(expr.value)}
            >
              <Ionicons
                name={expr.icon as any}
                size={20}
                color={expression === expr.value ? '#FFFFFF' : Colors.primary}
              />
              <Text
                style={[
                  styles.optionText,
                  expression === expr.value && styles.optionTextActive,
                ]}
              >
                {expr.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estados</Text>
        <View style={styles.optionsRow}>
          {states.map((st) => (
            <TouchableOpacity
              key={st.value}
              style={[
                styles.stateButton,
                state === st.value && styles.stateActive,
              ]}
              onPress={() => handleStateChange(st.value)}
            >
              <Text
                style={[
                  styles.stateText,
                  state === st.value && styles.stateTextActive,
                ]}
              >
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: '#FFFFFFCC',
    marginTop: Spacing.xs,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primaryLight,
  },
  statusLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  statusValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  optionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  stateButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  stateActive: {
    backgroundColor: Colors.primary,
  },
  stateText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  stateTextActive: {
    color: '#FFFFFF',
  },
});
