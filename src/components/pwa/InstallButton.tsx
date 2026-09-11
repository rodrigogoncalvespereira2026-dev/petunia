import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Platform, View, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  if (Platform.OS !== 'web' || isInstalled) return null;

  return (
    <>
      <TouchableOpacity style={styles.iconButton} onPress={handleInstall}>
        <Ionicons name="download-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Ionicons name="phone-portrait-outline" size={40} color={Colors.primary} />
            <Text style={styles.modalTitle}>Instalar Petúnia</Text>
            <Text style={styles.modalText}>
              Para instalar como app no telemóvel:
            </Text>
            <Text style={styles.modalStep}>1. Toca no botão partilhar (□↑)</Text>
            <Text style={styles.modalStep}>2. Seleciona "Adicionar ao ecrã principal"</Text>
            <Text style={styles.modalStep}>3. Confirma com "Adicionar"</Text>
            <Text style={[styles.modalText, { marginTop: 12 }]}>No computador:</Text>
            <Text style={styles.modalStep}>1. Clica no ícone de instalar na barra de endereço</Text>
            <Text style={styles.modalStep}>2. Ou usa os 3 pontos do menu → "Instalar Petúnia"</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: Spacing.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    margin: Spacing.lg,
    alignItems: 'center',
    maxWidth: 360,
    width: '100%',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  modalText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modalStep: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: Spacing.lg,
    marginVertical: 2,
  },
  closeButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
