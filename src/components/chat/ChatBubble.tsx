import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../types';
import { voiceService } from '../../services/voice';
import { useSettingsStore } from '../../stores/settingsStore';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { settings } = useSettingsStore();

  const handleSpeak = async () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      await voiceService.speak(message.content, { speed: settings.voiceSpeed });
      setIsSpeaking(false);
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && <Text style={styles.avatar}>🌸</Text>}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
        {!isUser && (
          <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
            <Ionicons
              name={isSpeaking ? 'stop' : 'volume-high'}
              size={16}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    fontSize: 24,
    marginRight: Spacing.sm,
    marginTop: Spacing.xs,
  },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    backgroundColor: Colors.userMessage,
    borderBottomRightRadius: Spacing.xs,
  },
  assistantBubble: {
    backgroundColor: Colors.assistantMessage,
    borderBottomLeftRadius: Spacing.xs,
  },
  text: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: Colors.text,
  },
  speakButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-end',
  },
});
