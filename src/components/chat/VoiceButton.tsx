import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { voiceService } from '../../services/voice';
import { VoiceState } from '../../types/voice';
import { Colors, Spacing, BorderRadius } from '../../constants';

interface VoiceButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function VoiceButton({ onTranscription, disabled }: VoiceButtonProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const unsubscribe = voiceService.onStateChange(setVoiceState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (voiceState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [voiceState]);

  const handlePress = async () => {
    if (disabled) return;

    if (!voiceService.isSTTAvailable()) {
      if (Platform.OS === 'web') {
        const ua = navigator.userAgent;
        if (/iPad|iPhone|iPod/.test(ua)) {
          Alert.alert(
            'Microfone indisponível',
            'O Safari no iPhone não suporta reconhecimento de voz. Usa o Chrome ou Edge no telemóvel para usar o microfone.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Microfone indisponível',
            'O reconhecimento de voz não está disponível neste browser. Usa Chrome ou Edge.',
            [{ text: 'OK' }]
          );
        }
      }
      return;
    }

    try {
      if (voiceState === 'idle') {
        await voiceService.startListening();
      } else if (voiceState === 'listening') {
        const text = await voiceService.stopListening();
        if (text.trim()) {
          onTranscription(text);
        }
      }
    } catch (error: any) {
      console.error('Voice error:', error);
      Alert.alert('Erro', error.message || 'Erro ao usar o microfone.', [{ text: 'OK' }]);
      setVoiceState('idle');
    }
  };

  const getIconName = () => {
    switch (voiceState) {
      case 'listening':
        return 'mic';
      case 'processing':
        return 'hourglass-outline';
      case 'speaking':
        return 'volume-high';
      default:
        return 'mic-outline';
    }
  };

  const getButtonColor = () => {
    switch (voiceState) {
      case 'listening':
        return Colors.error;
      case 'processing':
        return Colors.warning;
      case 'speaking':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: getButtonColor() },
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Ionicons name={getIconName() as any} size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
