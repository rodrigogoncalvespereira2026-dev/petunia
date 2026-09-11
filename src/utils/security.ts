import * as SecureStore from 'expo-secure-store';

const API_KEY_PREFIX = 'petunia_api_';

export const SecureStorage = {
  async setApiKey(provider: string, key: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(`${API_KEY_PREFIX}${provider}`, key);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  },

  async getApiKey(provider: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(`${API_KEY_PREFIX}${provider}`);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  },

  async removeApiKey(provider: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(`${API_KEY_PREFIX}${provider}`);
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
  },

  async clearAllApiKeys(): Promise<void> {
    try {
      const providers = ['openai', 'anthropic', 'google', 'ollama'];
      for (const provider of providers) {
        await SecureStore.deleteItemAsync(`${API_KEY_PREFIX}${provider}`);
      }
    } catch (error) {
      console.error('Failed to clear API keys:', error);
    }
  },

  async hasApiKey(provider: string): Promise<boolean> {
    const key = await this.getApiKey(provider);
    return key !== null && key.length > 0;
  },
};
