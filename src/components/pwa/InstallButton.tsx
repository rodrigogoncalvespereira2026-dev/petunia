import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../../constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    MSStream?: unknown;
  }
}

export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handlePress = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      setCanInstall(outcome === 'accepted');
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isEdge = /Edg\//.test(navigator.userAgent);
    const isChrome = /Chrome\//.test(navigator.userAgent) && !isEdge;

    if (isAndroid && isChrome) {
      Alert.alert(
        'Instalar Petúnia',
        'Toca nos 3 pontos do menu (canto superior direito) e depois em "Instalar app" ou "Adicionar ao ecrã principal".',
        [{ text: 'OK' }]
      );
    } else if (isIOS) {
      Alert.alert(
        'Instalar Petúnia',
        'Toca no botão partilhar (□↑) na barra inferior e depois em "Adicionar ao ecrã de início".',
        [{ text: 'OK' }]
      );
    } else if (isEdge) {
      Alert.alert(
        'Instalar Petúnia',
        'Clica nos 3 pontos do menu (canto superior direito) e seleciona "Aplicativos" → "Instalar este site como aplicativo".',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Instalar Petúnia',
        'Procura o ícone de instalar na barra de endereço ou nos menus do browser.',
        [{ text: 'OK' }]
      );
    }
  };

  if (Platform.OS !== 'web' || isInstalled) return null;

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons
        name={canInstall ? "download-outline" : "information-circle-outline"}
        size={22}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.sm,
  },
});
