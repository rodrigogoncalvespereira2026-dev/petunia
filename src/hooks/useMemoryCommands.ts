import { useMemoryStore } from '../stores/memoryStore';
import { MemoryCategory } from '../types/memory';

const MEMORY_COMMANDS = {
  save: /^(?:petúnia|petunia|lumbra)[,\s]+(?:guarda|lembra|lembra-te)\s+(.+)/i,
  delete: /^(?:petúnia|petunia|esquece|apaga)\s+(.+)/i,
  clear: /^(?:petúnia|petunia|apaga)\s+(?:todas?\s+)?(?:as?\s+)?memórias/i,
};

export function useMemoryCommands() {
  const { addMemory, deleteMemory, clearMemories, memories } = useMemoryStore();

  const detectCategory = (content: string): MemoryCategory => {
    const lower = content.toLowerCase();
    if (lower.includes('gosto') || lower.includes('prefiro') || lower.includes('adoro')) return 'preference';
    if (lower.includes('estudo') || lower.includes('aprender') || lower.includes('aula')) return 'study';
    if (lower.includes('projeto') || lower.includes('trabalho') || lower.includes('app')) return 'project';
    if (lower.includes('interesse') || lower.includes('hobby') || lower.includes('gosto de')) return 'interest';
    return 'personal';
  };

  const processMessage = async (text: string): Promise<{ isCommand: boolean; response?: string }> => {
    const saveMatch = text.match(MEMORY_COMMANDS.save);
    if (saveMatch) {
      const content = saveMatch[1].trim();
      const category = detectCategory(content);
      await addMemory(category, content);
      return { isCommand: true, response: `Memória guardada: "${content}"` };
    }

    const deleteMatch = text.match(MEMORY_COMMANDS.delete);
    if (deleteMatch) {
      const searchTerm = deleteMatch[1].trim().toLowerCase();
      const memoryToDelete = memories.find((m) =>
        m.content.toLowerCase().includes(searchTerm)
      );
      if (memoryToDelete) {
        await deleteMemory(memoryToDelete.id);
        return { isCommand: true, response: `Memória apagada: "${memoryToDelete.content}"` };
      }
      return { isCommand: true, response: 'Não encontrei essa memória.' };
    }

    if (MEMORY_COMMANDS.clear.test(text)) {
      await clearMemories();
      return { isCommand: true, response: 'Todas as memórias foram apagadas.' };
    }

    return { isCommand: false };
  };

  return { processMessage };
}
