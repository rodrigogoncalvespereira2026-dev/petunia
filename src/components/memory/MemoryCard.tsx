import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Memory, MemoryCategory } from '../../types/memory';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface MemoryCardProps {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

const categoryIcons: Record<MemoryCategory, string> = {
  preference: 'heart',
  study: 'book',
  project: 'folder',
  interest: 'star',
  communication: 'chatbubbles',
  personal: 'person',
};

const categoryColors: Record<MemoryCategory, string> = {
  preference: '#E91E63',
  study: '#2196F3',
  project: '#4CAF50',
  interest: '#FF9800',
  communication: '#9C27B0',
  personal: '#607D8B',
};

export function MemoryCard({ memory, onEdit, onDelete, onToggle }: MemoryCardProps) {
  const icon = categoryIcons[memory.category] || 'ellipse';
  const color = categoryColors[memory.category] || Colors.primary;

  return (
    <View style={[styles.container, !memory.enabled && styles.disabled]}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={14} color={color} />
          <Text style={[styles.categoryText, { color }]}>{memory.category}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onToggle(memory.id, !memory.enabled)}>
            <Ionicons
              name={memory.enabled ? 'toggle' : 'toggle-outline'}
              size={24}
              color={memory.enabled ? Colors.success : Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(memory)} style={styles.actionButton}>
            <Ionicons name="pencil" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(memory.id)}>
            <Ionicons name="trash" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.content}>{memory.content}</Text>
      <Text style={styles.date}>
        {new Date(memory.updatedAt).toLocaleDateString('pt-PT')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    marginLeft: Spacing.xs,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  content: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  date: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
