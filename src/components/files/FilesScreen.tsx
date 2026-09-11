import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFileStore } from '../../stores/fileStore';
import { VisionService } from '../../services/vision';
import { FileCard } from './FileCard';
import { PetuniaFile } from '../../types/files';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants';

export function FilesScreen() {
  const { files, isLoading, loadFiles, deleteFile, pickImage, takePhoto, updateFile } = useFileStore();
  const [selectedFile, setSelectedFile] = useState<PetuniaFile | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadFiles();
    VisionService.init(true);
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Apagar Ficheiro', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => deleteFile(id) },
    ]);
  };

  const handleAnalyze = async (file: PetuniaFile) => {
    if (file.type !== 'image') return;
    
    setAnalyzing(true);
    try {
      const analysis = await VisionService.analyzeImage(file.uri);
      await updateFile(file.id, {
        analysis: analysis.description,
        analyzed: true,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível analisar a imagem.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePickImage = async () => {
    await pickImage();
  };

  const handleTakePhoto = async () => {
    await takePhoto();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ficheiros</Text>
        <Text style={styles.headerSubtitle}>{files.length} ficheiros</Text>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.addButton} onPress={handlePickImage}>
          <Ionicons name="images" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleTakePhoto}>
          <Ionicons name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Câmara</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FileCard
              file={item}
              onPress={setSelectedFile}
              onDelete={handleDelete}
              onAnalyze={handleAnalyze}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Sem ficheiros</Text>
              <Text style={styles.emptySubtext}>
                Adiciona imagens da galeria ou tira uma foto
              </Text>
            </View>
          }
        />
      )}

      {analyzing && (
        <View style={styles.analyzingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.analyzingText}>A analisar imagem...</Text>
        </View>
      )}

      <Modal visible={!!selectedFile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedFile?.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {selectedFile?.type === 'image' && (
              <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} />
            )}

            {selectedFile?.analysis && (
              <ScrollView style={styles.analysisContainer}>
                <Text style={styles.analysisLabel}>Análise:</Text>
                <Text style={styles.analysisText}>{selectedFile.analysis}</Text>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              {selectedFile?.type === 'image' && !selectedFile.analysis && (
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={() => {
                    handleAnalyze(selectedFile);
                    setSelectedFile(null);
                  }}
                >
                  <Ionicons name="eye" size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analisar</Text>
                </TouchableOpacity>
              )}
            </View>
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
    gap: Spacing.sm,
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
  analyzingOverlay: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  analyzingText: {
    marginLeft: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  analysisContainer: {
    padding: Spacing.lg,
    maxHeight: 200,
  },
  analysisLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  analysisText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  modalActions: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
});
