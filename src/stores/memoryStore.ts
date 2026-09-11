import { create } from 'zustand';
import { Memory, MemoryCategory, MemoryFilter } from '../types/memory';
import { MemoryService } from '../services/memory';

interface MemoryState {
  memories: Memory[];
  filter: MemoryFilter;
  isLoading: boolean;

  loadMemories: () => Promise<void>;
  addMemory: (category: MemoryCategory, content: string) => Promise<Memory>;
  updateMemory: (id: string, updates: Partial<Pick<Memory, 'content' | 'category' | 'enabled'>>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  clearMemories: () => Promise<void>;
  setFilter: (filter: MemoryFilter) => void;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  filter: {},
  isLoading: false,

  loadMemories: async () => {
    set({ isLoading: true });
    const memories = await MemoryService.getAll();
    set({ memories, isLoading: false });
  },

  addMemory: async (category, content) => {
    const memory = await MemoryService.add(category, content);
    set((state) => ({ memories: [...state.memories, memory] }));
    return memory;
  },

  updateMemory: async (id, updates) => {
    await MemoryService.update(id, updates);
    set((state) => ({
      memories: state.memories.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m
      ),
    }));
  },

  deleteMemory: async (id) => {
    await MemoryService.delete(id);
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    }));
  },

  clearMemories: async () => {
    await MemoryService.clear();
    set({ memories: [] });
  },

  setFilter: (filter) => set({ filter }),
}));
