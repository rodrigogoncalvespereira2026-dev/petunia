import * as ImagePicker from 'expo-image-picker';
import { PetuniaFile, FileType, FileFilter } from '../../types/files';
import { Storage } from '../storage';

const FILES_KEY = 'files';

export const FileService = {
  async getAll(): Promise<PetuniaFile[]> {
    const files = await Storage.get<PetuniaFile[]>(FILES_KEY);
    return files || [];
  },

  async getFiltered(filter: FileFilter): Promise<PetuniaFile[]> {
    const files = await this.getAll();
    return files.filter((f) => {
      if (filter.type && f.type !== filter.type) return false;
      if (filter.search && !f.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },

  async getById(id: string): Promise<PetuniaFile | null> {
    const files = await this.getAll();
    return files.find((f) => f.id === id) || null;
  },

  async add(file: Omit<PetuniaFile, 'id' | 'createdAt'>): Promise<PetuniaFile> {
    const files = await this.getAll();
    const newFile: PetuniaFile = {
      ...file,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: Date.now(),
    };
    files.push(newFile);
    await Storage.set(FILES_KEY, files);
    return newFile;
  },

  async update(id: string, updates: Partial<PetuniaFile>): Promise<PetuniaFile | null> {
    const files = await this.getAll();
    const index = files.findIndex((f) => f.id === id);
    if (index === -1) return null;

    files[index] = { ...files[index], ...updates };
    await Storage.set(FILES_KEY, files);
    return files[index];
  },

  async delete(id: string): Promise<boolean> {
    const files = await this.getAll();
    const filtered = files.filter((f) => f.id !== id);
    if (filtered.length === files.length) return false;
    await Storage.set(FILES_KEY, filtered);
    return true;
  },

  async pickImage(): Promise<PetuniaFile | null> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return null;

    const asset = result.assets[0];
    return this.add({
      name: asset.fileName || 'image.jpg',
      type: 'image',
      uri: asset.uri,
      size: asset.fileSize || 0,
      mimeType: asset.mimeType,
    });
  },

  async takePhoto(): Promise<PetuniaFile | null> {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return null;

    const asset = result.assets[0];
    return this.add({
      name: asset.fileName || 'photo.jpg',
      type: 'image',
      uri: asset.uri,
      size: asset.fileSize || 0,
      mimeType: asset.mimeType,
    });
  },

  getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('text')) return 'text';
    return 'other';
  },

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },
};
