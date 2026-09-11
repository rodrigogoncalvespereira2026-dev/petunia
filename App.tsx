import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ChatScreen } from './src/components/chat/ChatScreen';
import { MemoryScreen } from './src/components/memory/MemoryScreen';
import { ToolsScreen } from './src/components/tools/ToolsScreen';
import { FilesScreen } from './src/components/files/FilesScreen';
import { AvatarScreen } from './src/components/avatar/AvatarScreen';
import { SettingsScreen } from './src/components/settings/SettingsScreen';
import { InstallButton } from './src/components/pwa/InstallButton';
import { useChatStore } from './src/stores/chatStore';
import { useSettingsStore } from './src/stores/settingsStore';
import { Colors, Spacing, FontSizes } from './src/constants';

type Screen = 'chat' | 'avatar' | 'memory' | 'tools' | 'files' | 'settings';

export default function App() {
  const { loadConversations } = useChatStore();
  const { loadSettings } = useSettingsStore();
  const [currentScreen, setCurrentScreen] = useState<Screen>('chat');

  useEffect(() => {
    loadSettings();
    loadConversations();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <InstallButton />
        
        {currentScreen === 'chat' && <ChatScreen />}
        {currentScreen === 'avatar' && <AvatarScreen />}
        {currentScreen === 'memory' && <MemoryScreen />}
        {currentScreen === 'tools' && <ToolsScreen />}
        {currentScreen === 'files' && <FilesScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('chat')}
          >
            <Ionicons
              name="chatbubble"
              size={20}
              color={currentScreen === 'chat' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentScreen === 'chat' && styles.tabTextActive]}>
              Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('avatar')}
          >
            <Ionicons
              name="person-circle"
              size={20}
              color={currentScreen === 'avatar' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentScreen === 'avatar' && styles.tabTextActive]}>
              Avatar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('memory')}
          >
            <Ionicons
              name="bulb"
              size={20}
              color={currentScreen === 'memory' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentScreen === 'memory' && styles.tabTextActive]}>
              Memórias
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('tools')}
          >
            <Ionicons
              name="hammer"
              size={20}
              color={currentScreen === 'tools' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentScreen === 'tools' && styles.tabTextActive]}>
              Tools
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('files')}
          >
            <Ionicons
              name="folder"
              size={20}
              color={currentScreen === 'files' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentScreen === 'files' && styles.tabTextActive]}>
              Ficheiros
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setCurrentScreen('settings')}
          >
            <Ionicons
              name="settings"
              size={20}
              color={currentScreen === 'settings' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentScreen === 'settings' && styles.tabTextActive]}>
              Definições
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  tabText: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
