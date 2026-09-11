import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptReady, setPromptReady] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPromptReady(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handlePress = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        setPromptReady(false);
      } catch {
        showInstructions();
      }
      return;
    }
    showInstructions();
  };

  const showInstructions = () => {
    const ua = navigator.userAgent;
    let title = 'Instalar Petúnia';
    let msg = '';

    if (/iPad|iPhone|iPod/.test(ua)) {
      msg = '1. Toca no botão partilhar (□↑)\n2. Desliza e toca em "Adicionar ao ecrã de início"\n3. Toca em "Adicionar"';
    } else if (/Android/.test(ua)) {
      if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
        msg = '1. Toca nos 3 pontos ⋮ (canto superior direito)\n2. Toca em "Instalar app" ou "Adicionar ao ecrã principal"\n3. Confirma';
      } else {
        msg = '1. Toca nos 3 pontos do menu\n2. Seleciona "Adicionar ao ecrã principal"';
      }
    } else if (/Edg\//.test(ua)) {
      msg = '1. Clica nos 3 pontos ⋮ (canto superior direito)\n2. Vai a "Aplicativos"\n3. Clica em "Instalar este site como aplicativo"';
    } else if (/Chrome\//.test(ua)) {
      msg = '1. Clica no ícone de instalar ↥ na barra de endereço\n2. Ou vai a ⋮ → "Instalar Petúnia"';
    } else if (/Firefox\//.test(ua)) {
      msg = '1. Clica nos 3 traços ☰ (canto superior direito)\n2. Vai a "Instalar"\n3. Confirma a instalação';
    } else {
      msg = 'Procura o ícone de instalar na barra de endereço ou no menu do browser.';
    }

    Alert.alert(title, msg, [{ text: 'OK' }]);
  };

  if (Platform.OS !== 'web' || isInstalled) return null;

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons name="download-outline" size={22} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
