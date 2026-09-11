import { AIProviderType } from '../types';

export const Config = {
  ai: {
    provider: (process.env.EXPO_PUBLIC_AI_PROVIDER as AIProviderType) || 'openai',
    apiKey: process.env.EXPO_PUBLIC_AI_API_KEY || '',
    model: process.env.EXPO_PUBLIC_AI_MODEL || 'gpt-4o-mini',
    baseUrl: process.env.EXPO_PUBLIC_AI_BASE_URL || '',
  },
  storage: {
    prefix: 'petunia_',
  },
  petunia: {
    name: 'Petúnia',
    defaultLanguage: 'pt-PT',
    maxShortTermMessages: 20,
  },
};
