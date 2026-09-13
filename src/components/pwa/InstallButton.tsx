import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Platform, Alert, Modal, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS() {
  if (Platform.OS === 'ios') return true;
  if (typeof navigator !== 'undefined') {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  return false;
}

function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
}

function isEdge() {
  return typeof navigator !== 'undefined' && /Edg\//.test(navigator.userAgent);
}

function isChrome() {
  return typeof navigator !== 'undefined' && /Chrome\//.test(navigator.userAgent) && !isEdge();
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        return;
      } catch {}
    }
    setShowModal(true);
  };

  if (Platform.OS !== 'web' || isInstalled) return null;

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
        <Ionicons name="download-outline" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modal}>
            {isIOS() ? <IOSSteps /> : isAndroid() ? <AndroidSteps /> : <DesktopSteps />}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function IOSSteps() {
  return (
    <View style={styles.stepsContainer}>
      <Ionicons name="phone-portrait-outline" size={48} color={Colors.primary} />
      <Text style={styles.modalTitle}>Instalar no iPhone</Text>

      <View style={styles.step}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
        <View style={styles.stepContent}>
          <Text style={styles.stepText}>Toca no botão <Text style={styles.bold}>Partilhar</Text></Text>
          <Text style={styles.stepHint}>Ícone □↑ na barra inferior do Safari</Text>
        </View>
      </View>

      <View style={styles.step}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
        <View style={styles.stepContent}>
          <Text style={styles.stepText}>Desliza para baixo e toca em <Text style={styles.bold}>"Adicionar ao Ecrã de Início"</Text></Text>
        </View>
      </View>

      <View style={styles.step}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
        <View style={styles.stepContent}>
          <Text style={styles.stepText}>Toca em <Text style={styles.bold}>"Adicionar"</Text></Text>
          <Text style={styles.stepHint}>No canto superior direito</Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Ionicons name="information-circle" size={18} color={Colors.primary} />
        <Text style={styles.tipText}>A Petúnia vai aparecer no teu ecrã inicial como uma app!</Text>
      </View>
    </View>
  );
}

function AndroidSteps() {
  return (
    <View style={styles.stepsContainer}>
      <Ionicons name="phone-portrait-outline" size={48} color={Colors.primary} />
      <Text style={styles.modalTitle}>Instalar no Android</Text>

      <View style={styles.step}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
        <View style={styles.stepContent}>
          <Text style={styles.stepText}>Toca nos <Text style={styles.bold}>3 pontos ⋮</Text></Text>
          <Text style={styles.stepHint}>Canto superior direito do ecrã</Text>
        </View>
      </View>

      <View style={styles.step}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
        <View style={styles.stepContent}>
          <Text style={styles.stepText}>Toca em <Text style={styles.bold}>"Instalar app"</Text> ou <Text style={styles.bold}>"Adicionar ao ecrã principal"</Text></Text>
        </View>
      </View>

      <View style={styles.step}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
        <View style={styles.stepContent}>
          <Text style={styles.stepText}>Confirma com <Text style={styles.bold}>"Instalar"</Text></Text>
        </View>
      </View>
    </View>
  );
}

function DesktopSteps() {
  const browserName = isEdge() ? 'Edge' : isChrome() ? 'Chrome' : 'teu browser';

  return (
    <View style={styles.stepsContainer}>
      <Ionicons name="laptop-outline" size={48} color={Colors.primary} />
      <Text style={styles.modalTitle}>Instalar no computador</Text>

      {isEdge() ? (
        <>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Clica nos <Text style={styles.bold}>3 pontos ⋮</Text></Text>
              <Text style={styles.stepHint}>Canto superior direito do Edge</Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Vai a <Text style={styles.bold}>"Aplicativos"</Text></Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Clica em <Text style={styles.bold}>"Instalar este site como aplicativo"</Text></Text>
            </View>
          </View>
        </>
      ) : isChrome() ? (
        <>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Clica no ícone <Text style={styles.bold}>installer ↥</Text></Text>
              <Text style={styles.stepHint}>Na barra de endereço, ao lado do URL</Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>Ou vai a <Text style={styles.bold}>⋮ → Instalar Petúnia</Text></Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.step}>
          <View style={styles.stepContent}>
            <Text style={styles.stepText}>Procura o ícone de instalar na barra de endereço ou no menu de {browserName}.</Text>
          </View>
        </View>
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
    maxHeight: '80%',
  },
  stepsContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
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
  bold: {
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
