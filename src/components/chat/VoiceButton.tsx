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
  const [sttAvailable, setSttAvailable] = useState(false);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    setSttAvailable(voiceService.isSTTAvailable());
    console.log('VoiceButton: STT available =', voiceService.isSTTAvailable());
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

    if (!sttAvailable) {
      Alert.alert(
        'Microfone indisponível',
        'O reconhecimento de voz não está disponível. Verifica se estás a usar Chrome ou Edge e se autorizaste o microfone.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (voiceState === 'idle') {
        await voiceService.startListening();
      } else if (voiceState === 'listening') {
        const text = await voiceService.stopListening();
        if (text.trim()) {
          onTranscription(text);
        } else {
          Alert.alert('Não ouvi nada', 'Tenta falar mais alto ou mais perto do microfone.', [{ text: 'OK' }]);
        }
      }
    } catch (error: any) {
      console.error('Voice error:', error);
      Alert.alert('Erro no microfone', error.message || 'Erro ao usar o microfone.', [{ text: 'OK' }]);
      setVoiceState('idle');
    }
  };

  const getIconName = () => {
    switch (voiceState) {
      case 'listening': return 'mic';
      case 'processing': return 'hourglass-outline';
      case 'speaking': return 'volume-high';
      default: return 'mic-outline';
    }
  };

  const getButtonColor = () => {
    switch (voiceState) {
      case 'listening': return Colors.error;
      case 'processing': return Colors.warning;
      case 'speaking': return Colors.success;
      default: return Colors.primary;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: getButtonColor() },
          (disabled || !sttAvailable) && styles.disabled,
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
