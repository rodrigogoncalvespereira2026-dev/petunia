import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Platform, Modal, View, Text, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function getPlatform(): 'ios' | 'android' | 'edge' | 'chrome' | 'other' {
  if (Platform.OS !== 'web') return 'other';
  const ua = navigator.userAgent;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return isStandalone ? 'other' : 'ios';
  }
  if (/Android/.test(ua)) return 'android';
  if (/Edg\//.test(ua)) return 'edge';
  if (/Chrome\//.test(ua)) return 'chrome';
  return 'other';
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const platform = getPlatform();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
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
        if (outcome === 'accepted') setIsInstalled(true);
        setDeferredPrompt(null);
        return;
      } catch {}
    }

    if (platform === 'ios') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Petúnia',
            text: 'Instala a Petúnia no teu iPhone!',
            url: window.location.href,
          });
          return;
        } catch {}
      }
    }

    setShowModal(true);
  };

  if (Platform.OS !== 'web' || isInstalled || platform === 'other') return null;

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
        <Ionicons name="download-outline" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modal}>
            {platform === 'ios' && <IOSSteps />}
            {platform === 'android' && <AndroidSteps />}
            {(platform === 'edge' || platform === 'chrome') && <DesktopSteps platform={platform} />}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function StepItem({ num, title, hint }: { num: number; title: string; hint?: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{num}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepText}>{title}</Text>
        {hint ? <Text style={styles.stepHint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

function IOSSteps() {
  return (
    <View style={styles.stepsContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="logo-apple" size={40} color={Colors.primary} />
      </View>
      <Text style={styles.modalTitle}>Instalar no iPhone</Text>
      <Text style={styles.modalSubtitle}>Usa o Safari para instalar a Petúnia</Text>

      <View style={styles.iosVisual}>
        <View style={styles.iosBar}>
          <View style={styles.iosBarLeft}>
            <Ionicons name="lock-closed" size={12} color="#666" />
            <Text style={styles.iosUrl}>petunia-1711.onrender.com</Text>
          </View>
          <View style={styles.iosBarRight}>
            <Ionicons name="share-outline" size={20} color={Colors.primary} />
          </View>
        </View>
        <View style={styles.arrowPointer}>
          <Ionicons name="arrow-down" size={24} color={Colors.primary} />
          <Text style={styles.arrowLabel}>Toca aqui</Text>
        </View>
      </View>

      <StepItem num={1} title='Toca no botão "Partilhar"' hint="Ícone □↑ na barra inferior" />
      <StepItem num={2} title='Desliza e toca em "Adicionar ao Ecrã de Início"' />
      <StepItem num={3} title='Toca em "Adicionar"' hint="Canto superior direito" />

      <View style={styles.tipBox}>
        <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
        <Text style={styles.tipText}>Depois vai aparecer no ecrã inicial como uma app!</Text>
      </View>
    </View>
  );
}

function AndroidSteps() {
  return (
    <View style={styles.stepsContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="logo-android" size={40} color="#3DDC84" />
      </View>
      <Text style={styles.modalTitle}>Instalar no Android</Text>

      <StepItem num={1} title="Toca nos 3 pontos ⋮" hint="Canto superior direito" />
      <StepItem num={2} title='Toca em "Instalar app" ou "Adicionar ao ecrã principal"' />
      <StepItem num={3} title='Confirma com "Instalar"' />
    </View>
  );
}

function DesktopSteps({ platform }: { platform: string }) {
  return (
    <View style={styles.stepsContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="laptop-outline" size={40} color={Colors.primary} />
      </View>
      <Text style={styles.modalTitle}>Instalar no computador</Text>

      {platform === 'edge' ? (
        <>
          <StepItem num={1} title="Clica nos 3 pontos ⋮" hint="Canto superior direito do Edge" />
          <StepItem num={2} title='Vai a "Aplicativos"' />
          <StepItem num={3} title='Clica em "Instalar este site como aplicativo"' />
        </>
      ) : (
        <>
          <StepItem num={1} title="Clica no ícone ↥ na barra de endereço" />
          <StepItem num={2} title='Ou vai a ⋮ → "Instalar Petúnia"' />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingBottom: 40,
    paddingHorizontal: Spacing.lg,
    maxHeight: '85%',
  },
  stepsContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  iosVisual: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  iosBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iosBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  iosUrl: {
    fontSize: 13,
    color: '#333',
  },
  iosBarRight: {
    padding: 4,
  },
  arrowPointer: {
    alignItems: 'center',
    marginTop: 4,
  },
  arrowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    width: '100%',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  stepHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: '#2E7D32',
    lineHeight: 18,
  },
  closeBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
