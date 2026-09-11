import { ShortTermMemory } from '../../types/memory';
import { Config } from '../../config';

class ShortTermMemoryService {
  private memory: ShortTermMemory = {
    messages: [],
    maxMessages: Config.petunia.maxShortTermMessages,
  };

  addMessage(role: string, content: string) {
    this.memory.messages.push({ role, content });
    if (this.memory.messages.length > this.memory.maxMessages) {
      this.memory.messages.shift();
    }
  }

  getMessages(): { role: string; content: string }[] {
    return [...this.memory.messages];
  }

  clear() {
    this.memory.messages = [];
  }

  getLength(): number {
    return this.memory.messages.length;
  }

  getContextString(): string {
    if (this.memory.messages.length === 0) return '';
    return this.memory.messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
  }
}

export const shortTermMemory = new ShortTermMemoryService();
