import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/settingsStore';
import { SecureStorage } from '../../utils/security';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

const speeds = [0.75, 1, 1.25, 1.5, 2];

export function SettingsScreen() {
  const { settings, updateSettings } =
    useSettingsStore();

  const handleClearData = () => {
    Alert.alert('Limpar Dados', 'Isto vai apagar todas as memórias e configurações. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await SecureStorage.clearAllApiKeys();
          Alert.alert('Limpo', 'Todos os dados foram apagados.');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Definições</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voz</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voz ativada</Text>
          <Switch
            value={settings.voiceEnabled}
            onValueChange={(value) => updateSettings({ voiceEnabled: value })}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.voiceEnabled ? Colors.primary : Colors.textSecondary}
          />
        </View>

        <Text style={styles.label}>Velocidade: {settings.voiceSpeed}x</Text>
        <View style={styles.speedContainer}>
          {speeds.map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[styles.speedButton, settings.voiceSpeed === speed && styles.speedActive]}
              onPress={() => updateSettings({ voiceSpeed: speed })}
            >
              <Text style={[styles.speedText, settings.voiceSpeed === speed && styles.speedTextActive]}>
                {speed}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Memória</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Memória ativada</Text>
          <Switch
            value={settings.memoryEnabled}
            onValueChange={(value) => updateSettings({ memoryEnabled: value })}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.memoryEnabled ? Colors.primary : Colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avatar</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Avatar ativado</Text>
          <Switch
            value={settings.avatarEnabled}
            onValueChange={(value) => updateSettings({ avatarEnabled: value })}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings.avatarEnabled ? Colors.primary : Colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Ionicons name="trash" size={20} color={Colors.error} />
          <Text style={styles.dangerButtonText}>Limpar Todos os Dados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Petúnia v1.0.0</Text>
        <Text style={styles.footerText}>Feito com 🌸 em Portugal</Text>
      </View>
    </ScrollView>
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
  section: {
    backgroundColor: Colors.background,
    marginTop: Spacing.md,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  speedContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  speedButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  speedActive: {
    backgroundColor: Colors.primary,
  },
  speedText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  speedTextActive: {
    color: '#FFFFFF',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.error,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
