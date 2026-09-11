import { create } from 'zustand';
import { PetuniaFile, FileFilter } from '../types/files';
import { FileService } from '../services/files';

interface FileState {
  files: PetuniaFile[];
  filter: FileFilter;
  isLoading: boolean;

  loadFiles: () => Promise<void>;
  addFile: (file: Omit<PetuniaFile, 'id' | 'createdAt'>) => Promise<PetuniaFile>;
  deleteFile: (id: string) => Promise<void>;
  updateFile: (id: string, updates: Partial<PetuniaFile>) => Promise<void>;
  pickImage: () => Promise<PetuniaFile | null>;
  takePhoto: () => Promise<PetuniaFile | null>;
  setFilter: (filter: FileFilter) => void;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  filter: {},
  isLoading: false,

  loadFiles: async () => {
    set({ isLoading: true });
    const files = await FileService.getAll();
    set({ files, isLoading: false });
  },

  addFile: async (fileData) => {
    const file = await FileService.add(fileData);
    set((state) => ({ files: [...state.files, file] }));
    return file;
  },

  deleteFile: async (id) => {
    await FileService.delete(id);
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  updateFile: async (id, updates) => {
    await FileService.update(id, updates);
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  },

  pickImage: async () => {
    const file = await FileService.pickImage();
    if (file) {
      set((state) => ({ files: [...state.files, file] }));
    }
    return file;
  },

  takePhoto: async () => {
    const file = await FileService.takePhoto();
    if (file) {
      set((state) => ({ files: [...state.files, file] }));
    }
    return file;
  },

  setFilter: (filter) => set({ filter }),
}));
