export type MemoryCategory = 'preference' | 'study' | 'project' | 'interest' | 'communication' | 'personal';

export interface Memory {
  id: string;
  category: MemoryCategory;
  content: string;
  createdAt: number;
  updatedAt: number;
  enabled: boolean;
}

export interface MemoryFilter {
  category?: MemoryCategory;
  search?: string;
  enabled?: boolean;
}

export interface ShortTermMemory {
  messages: { role: string; content: string }[];
  maxMessages: number;
}
