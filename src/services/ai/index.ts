import { AIProvider, createAIProvider } from './provider';
import { AIProviderType, AIResponse } from '../../types';
import { Config } from '../../config';

class AIService {
  private provider: AIProvider;

  constructor() {
    this.provider = createAIProvider(Config.ai.provider as AIProviderType);
  }

  setProvider(type: AIProviderType) {
    this.provider = createAIProvider(type);
  }

  async chat(messages: { role: string; content: string }[]): Promise<AIResponse> {
    return this.provider.chat(messages);
  }
}

export const aiService = new AIService();
