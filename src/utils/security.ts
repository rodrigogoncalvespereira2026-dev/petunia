import { Platform } from 'react-native';

const API_KEY_PREFIX = 'petunia_api_';

function isWeb(): boolean {
  return Platform.OS === 'web';
}

async function secureGetItem(key: string): Promise<string | null> {
  if (isWeb()) {
    return localStorage.getItem(key);
  }
  const SecureStore = require('expo-secure-store');
  return SecureStore.getItemAsync(key);
}

async function secureSetItem(key: string, value: string): Promise<void> {
  if (isWeb()) {
    localStorage.setItem(key, value);
    return;
  }
  const SecureStore = require('expo-secure-store');
  await SecureStore.setItemAsync(key, value);
}

async function secureDeleteItem(key: string): Promise<void> {
  if (isWeb()) {
    localStorage.removeItem(key);
    return;
  }
  const SecureStore = require('expo-secure-store');
  await SecureStore.deleteItemAsync(key);
}

export const SecureStorage = {
  async setApiKey(provider: string, key: string): Promise<void> {
    try {
      await secureSetItem(`${API_KEY_PREFIX}${provider}`, key);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  },

  async getApiKey(provider: string): Promise<string | null> {
    try {
      return await secureGetItem(`${API_KEY_PREFIX}${provider}`);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  },

  async removeApiKey(provider: string): Promise<void> {
    try {
      await secureDeleteItem(`${API_KEY_PREFIX}${provider}`);
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
  },

  async clearAllApiKeys(): Promise<void> {
    try {
      const providers = ['openai', 'anthropic', 'google', 'ollama'];
      for (const provider of providers) {
        await secureDeleteItem(`${API_KEY_PREFIX}${provider}`);
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
