import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tools } from '../../services/tools';
import { CalculatorScreen } from './CalculatorScreen';
import { ConverterScreen } from './ConverterScreen';
import { TimerScreen } from './TimerScreen';
import { Tool, ToolType } from '../../types/tools';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

const toolComponents: Record<ToolType, React.FC> = {
  calculator: CalculatorScreen,
  converter: ConverterScreen,
  timer: TimerScreen,
  search: () => null,
  weather: () => null,
  notes: () => null,
};

export function ToolsScreen() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const renderTool = (tool: Tool) => {
    const IconComponent = Ionicons;
    return (
      <TouchableOpacity
        key={tool.id}
        style={styles.toolCard}
        onPress={() => setSelectedTool(tool)}
      >
        <View style={styles.toolIconContainer}>
          <IconComponent name={tool.icon as any} size={32} color={Colors.primary} />
        </View>
        <Text style={styles.toolName}>{tool.name}</Text>
        <Text style={styles.toolDescription}>{tool.description}</Text>
      </TouchableOpacity>
    );
  };

  const ToolContent = selectedTool ? toolComponents[selectedTool.type] : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ferramentas</Text>
        <Text style={styles.headerSubtitle}>Utilitários úteis</Text>
      </View>

      <View style={styles.toolsGrid}>
        {tools.map(renderTool)}
      </View>

      <Modal visible={!!selectedTool} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedTool(null)}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTool?.name}</Text>
            <View style={{ width: 24 }} />
          </View>
          {ToolContent && <ToolContent />}
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
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  toolCard: {
    width: '47%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  toolIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  toolName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  toolDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
});
