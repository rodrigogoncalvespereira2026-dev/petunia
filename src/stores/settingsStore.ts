import { create } from 'zustand';
import { PetuniaSettings, AIProviderType } from '../types';
import { Storage } from '../services/storage';
import { SecureStorage } from '../utils/security';

interface SettingsState {
  settings: PetuniaSettings;
  aiProvider: AIProviderType;
  aiApiKey: string;
  aiModel: string;

  updateSettings: (settings: Partial<PetuniaSettings>) => void;
  setAIProvider: (provider: AIProviderType) => void;
  setAIApiKey: (key: string) => void;
  setAIModel: (model: string) => void;
  loadSettings: () => Promise<void>;
}

const defaultSettings: PetuniaSettings = {
  name: 'Petúnia',
  language: 'pt-PT',
  theme: 'light',
  voiceEnabled: true,
  voiceSpeed: 1,
  voiceVolume: 1,
  memoryEnabled: true,
  avatarEnabled: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  aiProvider: 'openai',
  aiApiKey: '',
  aiModel: 'gpt-4o-mini',

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    Storage.set('settings', get().settings);
  },

  setAIProvider: (provider) => {
    set({ aiProvider: provider });
    Storage.set('aiProvider', provider);
  },

  setAIApiKey: async (key) => {
    set({ aiApiKey: key });
    await SecureStorage.setApiKey(get().aiProvider, key);
  },

  setAIModel: (model) => {
    set({ aiModel: model });
    Storage.set('aiModel', model);
  },

  loadSettings: async () => {
    const settings = await Storage.get<PetuniaSettings>('settings');
    const provider = await Storage.get<AIProviderType>('aiProvider');
    const apiKey = await SecureStorage.getApiKey(provider || 'openai');
    const model = await Storage.get<string>('aiModel');

    if (settings) set({ settings: { ...defaultSettings, ...settings } });
    if (provider) set({ aiProvider: provider });
    if (apiKey) set({ aiApiKey: apiKey });
    if (model) set({ aiModel: model });
  },
}));
