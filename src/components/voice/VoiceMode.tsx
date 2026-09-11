import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { voiceService } from '../../services/voice';
import { VoiceState } from '../../types/voice';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface VoiceModeProps {
  onTranscription: (text: string) => void;
  onClose: () => void;
}

export function VoiceMode({ onTranscription, onClose }: VoiceModeProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    const unsubscribe = voiceService.onStateChange(setVoiceState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (voiceState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [voiceState]);

  const handlePress = async () => {
    try {
      if (voiceState === 'idle') {
        await voiceService.startListening();
      } else if (voiceState === 'listening') {
        const text = await voiceService.stopListening();
        if (text.trim()) {
          onTranscription(text);
        }
      }
    } catch (error) {
      console.error('Voice error:', error);
    }
  };

  const getStateText = () => {
    switch (voiceState) {
      case 'listening':
        return 'A ouvir...';
      case 'processing':
        return 'A processar...';
      case 'speaking':
        return 'A falar...';
      default:
        return 'Toque para falar';
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.circle,
            voiceState === 'listening' && styles.listeningCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Ionicons name={getIconName() as any} size={64} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.stateText}>{getStateText()}</Text>

        <TouchableOpacity
          style={[
            styles.mainButton,
            voiceState === 'listening' && styles.listeningButton,
          ]}
          onPress={handlePress}
        >
          <Ionicons
            name={voiceState === 'listening' ? 'stop' : 'mic'}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  listeningCircle: {
    backgroundColor: Colors.error,
  },
  stateText: {
    fontSize: FontSizes.lg,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningButton: {
    backgroundColor: Colors.error,
  },
});
