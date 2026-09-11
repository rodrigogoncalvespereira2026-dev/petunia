import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PetuniaFile } from '../../types/files';
import { FileService } from '../../services/files';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface FileCardProps {
  file: PetuniaFile;
  onPress: (file: PetuniaFile) => void;
  onDelete: (id: string) => void;
  onAnalyze?: (file: PetuniaFile) => void;
}

const fileTypeIcons: Record<string, string> = {
  image: 'image',
  document: 'document-text',
  text: 'paper-plane',
  audio: 'musical-notes',
  video: 'videocam',
  other: 'file-tray',
};

export function FileCard({ file, onPress, onDelete, onAnalyze }: FileCardProps) {
  const icon = fileTypeIcons[file.type] || 'file-tray';

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(file)}>
      {file.type === 'image' ? (
        <Image source={{ uri: file.uri }} style={styles.image} />
      ) : (
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={32} color={Colors.primary} />
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
        <Text style={styles.meta}>
          {FileService.formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString('pt-PT')}
        </Text>
        {file.analysis && (
          <Text style={styles.analysis} numberOfLines={2}>{file.analysis}</Text>
        )}
      </View>

      <View style={styles.actions}>
        {onAnalyze && !file.analysis && (
          <TouchableOpacity onPress={() => onAnalyze(file)} style={styles.actionButton}>
            <Ionicons name="eye" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onDelete(file.id)} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  meta: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  analysis: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
  },
});
