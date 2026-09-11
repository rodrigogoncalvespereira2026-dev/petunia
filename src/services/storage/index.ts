import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = 'petunia_';

export const Storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(`${prefix}${key}`);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    } catch {
      // Silent fail
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${prefix}${key}`);
    } catch {
      // Silent fail
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const petuniaKeys = keys.filter((k) => k.startsWith(prefix));
      for (const key of petuniaKeys) {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // Silent fail
    }
  },
};
