import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('petunia-install-dismissed', 'true');
  };

  if (Platform.OS !== 'web' || isInstalled || !showBanner) return null;

  if (sessionStorage.getItem('petunia-install-dismissed') === 'true') return null;

  return (
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        <Ionicons name="phone-portrait-outline" size={20} color="#FFFFFF" />
        <Text style={styles.bannerText}>Instalar Petúnia como app</Text>
      </View>
      <View style={styles.bannerActions}>
        <TouchableOpacity style={styles.installButton} onPress={handleInstall}>
          <Text style={styles.installButtonText}>Instalar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
          <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(233, 30, 99, 0.95)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  installButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  installButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  dismissButton: {
    padding: Spacing.xs,
  },
});
