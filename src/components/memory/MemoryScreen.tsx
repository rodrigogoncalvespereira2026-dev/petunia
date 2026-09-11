import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemoryStore } from '../../stores/memoryStore';
import { MemoryCard } from './MemoryCard';
import { Memory, MemoryCategory } from '../../types/memory';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

const categories: { value: MemoryCategory; label: string }[] = [
  { value: 'preference', label: 'Preferências' },
  { value: 'study', label: 'Estudos' },
  { value: 'project', label: 'Projetos' },
  { value: 'interest', label: 'Interesses' },
  { value: 'communication', label: 'Comunicação' },
  { value: 'personal', label: 'Pessoal' },
];

export function MemoryScreen() {
  const { memories, isLoading, loadMemories, addMemory, updateMemory, deleteMemory, clearMemories } =
    useMemoryStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('preference');

  useEffect(() => {
    loadMemories();
  }, []);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    await addMemory(newCategory, newContent.trim());
    setNewContent('');
    setShowAddModal(false);
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setNewContent(memory.content);
    setNewCategory(memory.category);
    setShowAddModal(true);
  };

  const handleUpdate = async () => {
    if (!editingMemory || !newContent.trim()) return;
    await updateMemory(editingMemory.id, { content: newContent.trim(), category: newCategory });
    setEditingMemory(null);
    setNewContent('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Apagar Memória', 'Tem certeza que quer apagar esta memória?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => deleteMemory(id) },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Limpar Todas as Memórias', 'Esta ação é irreversível. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => clearMemories() },
    ]);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updateMemory(id, { enabled });
  };

  const openAddModal = () => {
    setEditingMemory(null);
    setNewContent('');
    setNewCategory('preference');
    setShowAddModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Memórias</Text>
        <Text style={styles.headerSubtitle}>{memories.length} memórias guardadas</Text>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Ionicons name="trash" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MemoryCard
              memory={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bulb-outline" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Sem memórias ainda</Text>
              <Text style={styles.emptySubtext}>
                Adiciona memórias para a Petúnia se lembrar de ti
              </Text>
            </View>
          }
        />
      )}

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMemory ? 'Editar Memória' : 'Nova Memória'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryOption,
                    newCategory === cat.value && styles.categorySelected,
                  ]}
                  onPress={() => setNewCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      newCategory === cat.value && styles.categorySelectedText,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
              style={styles.textInput}
              value={newContent}
              onChangeText={setNewContent}
              placeholder="O que queres que eu lembre?"
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.saveButton, !newContent.trim() && styles.saveButtonDisabled]}
              onPress={editingMemory ? handleUpdate : handleAdd}
              disabled={!newContent.trim()}
            >
              <Text style={styles.saveButtonText}>
                {editingMemory ? 'Guardar' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  clearButton: {
    padding: Spacing.sm,
  },
  list: {
    paddingVertical: Spacing.sm,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categorySelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  categorySelectedText: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
