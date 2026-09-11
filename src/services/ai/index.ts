import { AIProvider, createAIProvider } from './provider';
import { AIProviderType, AIResponse } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';

class AIService {
  setProvider(type: AIProviderType) {
    // Provider is now resolved per-request from the settings store
  }

  async chat(messages: { role: string; content: string }[]): Promise<AIResponse> {
    const providerType = useSettingsStore.getState().aiProvider || 'openai';
    const provider = createAIProvider(providerType);
    return provider.chat(messages);
  }
}

export const aiService = new AIService();
