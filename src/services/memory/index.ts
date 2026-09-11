import { Memory, MemoryCategory, MemoryFilter } from '../../types/memory';
import { Storage } from '../storage';

const MEMORY_KEY = 'memories';

export const MemoryService = {
  async getAll(): Promise<Memory[]> {
    const memories = await Storage.get<Memory[]>(MEMORY_KEY);
    return memories || [];
  },

  async getFiltered(filter: MemoryFilter): Promise<Memory[]> {
    const memories = await this.getAll();
    return memories.filter((m) => {
      if (filter.category && m.category !== filter.category) return false;
      if (filter.enabled !== undefined && m.enabled !== filter.enabled) return false;
      if (filter.search && !m.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },

  async getById(id: string): Promise<Memory | null> {
    const memories = await this.getAll();
    return memories.find((m) => m.id === id) || null;
  },

  async add(category: MemoryCategory, content: string): Promise<Memory> {
    const memories = await this.getAll();
    const newMemory: Memory = {
      id: Math.random().toString(36).substring(2, 15),
      category,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      enabled: true,
    };
    memories.push(newMemory);
    await Storage.set(MEMORY_KEY, memories);
    return newMemory;
  },

  async update(id: string, updates: Partial<Pick<Memory, 'content' | 'category' | 'enabled'>>): Promise<Memory | null> {
    const memories = await this.getAll();
    const index = memories.findIndex((m) => m.id === id);
    if (index === -1) return null;

    memories[index] = {
      ...memories[index],
      ...updates,
      updatedAt: Date.now(),
    };
    await Storage.set(MEMORY_KEY, memories);
    return memories[index];
  },

  async delete(id: string): Promise<boolean> {
    const memories = await this.getAll();
    const filtered = memories.filter((m) => m.id !== id);
    if (filtered.length === memories.length) return false;
    await Storage.set(MEMORY_KEY, filtered);
    return true;
  },

  async clear(): Promise<void> {
    await Storage.set(MEMORY_KEY, []);
  },

  async getEnabledContext(): Promise<string> {
    const memories = await this.getFiltered({ enabled: true });
    if (memories.length === 0) return '';
    
    const grouped = memories.reduce((acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m.content);
      return acc;
    }, {} as Record<string, string[]>);

    const categoryNames: Record<string, string> = {
      preference: 'Preferências',
      study: 'Estudos',
      project: 'Projetos',
      interest: 'Interesses',
      communication: 'Comunicação',
      personal: 'Pessoal',
    };

    let context = '\n\nMemórias do utilizador:\n';
    for (const [category, items] of Object.entries(grouped)) {
      context += `\n${categoryNames[category] || category}:\n`;
      items.forEach((item) => {
        context += `- ${item}\n`;
      });
    }
    return context;
  },
};
