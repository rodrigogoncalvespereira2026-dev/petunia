import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceButton } from './VoiceButton';
import { Colors, Spacing, BorderRadius } from '../../constants';

interface ChatInputProps {
  onSend: (text: string, imageUri?: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if ((trimmed || selectedImage) && !isLoading) {
      onSend(trimmed, selectedImage || undefined);
      setText('');
      setSelectedImage(null);
      Keyboard.dismiss();
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setText((prev) => (prev ? `${prev} ${transcribedText}` : transcribedText));
  };

  return (
    <View style={styles.container}>
      {selectedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeImage}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close-circle" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Escreve uma mensagem..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          maxLength={2000}
          editable={!isLoading}
        />
        <VoiceButton onTranscription={handleVoiceTranscription} disabled={isLoading} />
        <TouchableOpacity
          style={[styles.sendButton, (!text.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={(!text.trim() && !selectedImage) || isLoading}
        >
          <Ionicons
            name="send"
            size={20}
            color={!text.trim() && !selectedImage || isLoading ? Colors.textSecondary : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  removeImage: {
    marginLeft: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: Colors.text,
  },
  sendButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
});
