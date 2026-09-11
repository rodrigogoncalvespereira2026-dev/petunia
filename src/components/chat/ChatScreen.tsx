import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '../../stores/chatStore';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { VoiceMode } from '../voice/VoiceMode';
import { aiService } from '../../services/ai';
import { voiceService } from '../../services/voice';
import { avatarService } from '../../services/avatar';
import { useMemoryCommands } from '../../hooks/useMemoryCommands';
import { useToolCommands } from '../../hooks/useToolCommands';
import { Message } from '../../types';
import { Colors, Spacing, FontSizes } from '../../constants';

export function ChatScreen() {
  const {
    currentConversation,
    isLoading,
    error,
    createConversation,
    addMessage,
    setLoading,
    setError,
    setPetuniaEmotion,
  } = useChatStore();

  const { processMessage: processMemory } = useMemoryCommands();
  const { processMessage: processTool } = useToolCommands();
  const flatListRef = useRef<FlatList>(null);
  const [showVoiceMode, setShowVoiceMode] = useState(false);

  useEffect(() => {
    if (!currentConversation) {
      createConversation();
    }
    avatarService.startBlinking();
    return () => avatarService.stopBlinking();
  }, []);

  useEffect(() => {
    if (currentConversation?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentConversation?.messages.length]);

  const handleSend = async (text: string) => {
    if (!currentConversation) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      content: text,
      role: 'user',
      timestamp: Date.now(),
    };

    addMessage(currentConversation.id, userMessage);
    setLoading(true);
    setError(null);
    avatarService.setState('thinking');

    const memoryResult = await processMemory(text);
    if (memoryResult.isCommand && memoryResult.response) {
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        content: memoryResult.response,
        role: 'assistant',
        timestamp: Date.now(),
        emotion: 'happy',
      };
      addMessage(currentConversation.id, assistantMessage);
      setPetuniaEmotion('happy');
      avatarService.setExpression('happy');
      avatarService.setState('speaking');
      setLoading(false);
      voiceService.speak(memoryResult.response);
      return;
    }

    const toolResult = await processTool(text);
    if (toolResult.isTool && toolResult.response) {
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        content: toolResult.response,
        role: 'assistant',
        timestamp: Date.now(),
        emotion: 'thinking',
      };
      addMessage(currentConversation.id, assistantMessage);
      setPetuniaEmotion('thinking');
      avatarService.setExpression('thinking');
      avatarService.setState('speaking');
      setLoading(false);
      voiceService.speak(toolResult.response);
      return;
    }

    const messagesForAI = currentConversation.messages
      .concat(userMessage)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await aiService.chat(messagesForAI);

    const assistantMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      content: response.text,
      role: 'assistant',
      timestamp: Date.now(),
      emotion: response.emotion,
    };

    addMessage(currentConversation.id, assistantMessage);
    setPetuniaEmotion(response.emotion);
    avatarService.setExpression(response.emotion);
    avatarService.setState('speaking');
    setLoading(false);

    if (response.speak) {
      voiceService.speak(response.text);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setShowVoiceMode(false);
    handleSend(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Petúnia</Text>
          <Text style={styles.headerSubtitle}>A tua companheira virtual</Text>
        </View>
        <TouchableOpacity
          style={styles.voiceModeButton}
          onPress={() => setShowVoiceMode(true)}
        >
          <Ionicons name="mic" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={currentConversation?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyText}>Olá! Sou a Petúnia.</Text>
            <Text style={styles.emptySubtext}>Como posso ajudar hoje?</Text>
          </View>
        }
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>A pensar...</Text>
        </View>
      )}

      <ChatInput onSend={handleSend} isLoading={isLoading} />

      <Modal visible={showVoiceMode} animationType="slide" presentationStyle="fullScreen">
        <VoiceMode
          onTranscription={handleVoiceTranscription}
          onClose={() => setShowVoiceMode(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  voiceModeButton: {
    padding: Spacing.sm,
  },
  messageList: {
    paddingVertical: Spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  loadingText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.sm,
  },
});
