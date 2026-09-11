import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { timerService } from '../../services/tools';
import { TimerState } from '../../types/tools';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

export function TimerScreen() {
  const [timerState, setTimerState] = useState<TimerState>(timerService.state);
  const [inputValue, setInputValue] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const unsubscribe = timerService.onStateChange(setTimerState);
    return unsubscribe;
  }, []);

  const handleStart = () => {
    const seconds = timerService.parseTimeInput(inputValue);
    if (seconds > 0) {
      timerService.start(seconds, label || 'Temporizador');
      setInputValue('');
      setLabel('');
    }
  };

  const handleStop = () => {
    timerService.stop();
  };

  const handlePause = () => {
    timerService.pause();
  };

  const handleResume = () => {
    timerService.resume();
  };

  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
    { label: '1 hora', seconds: 3600 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temporizador</Text>

      {timerState.isRunning || timerState.seconds > 0 ? (
        <View style={styles.timerDisplay}>
          <Text style={styles.timerLabel}>{timerState.label}</Text>
          <Text style={styles.timerValue}>
            {timerService.formatTime(timerState.seconds)}
          </Text>
          <View style={styles.timerControls}>
            {timerState.isRunning ? (
              <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
                <Ionicons name="pause" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.controlButton} onPress={handleResume}>
                <Ionicons name="play" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={handleStop}>
              <Ionicons name="stop" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tempo (ex: 5 min, 30 seg, 1:30)</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="ex: 5 min"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Etiqueta (opcional)</Text>
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder="ex: Cozinhar arroz"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.startButton, !inputValue && styles.startButtonDisabled]}
            onPress={handleStart}
            disabled={!inputValue}
          >
            <Ionicons name="play" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Iniciar</Text>
          </TouchableOpacity>

          <Text style={styles.presetsTitle}>Tempos rápidos</Text>
          <View style={styles.presetsContainer}>
            {presets.map((preset) => (
              <TouchableOpacity
                key={preset.seconds}
                style={styles.presetButton}
                onPress={() => {
                  setInputValue(`${preset.seconds / 60} min`);
                }}
              >
                <Text style={styles.presetText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
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
    marginBottom: Spacing.xl,
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  presetsTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  presetButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  presetText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  timerDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  timerValue: {
    fontSize: 72,
    fontWeight: '200',
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  timerControls: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: Colors.error,
  },
});
