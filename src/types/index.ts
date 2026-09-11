export type Emotion = 'neutral' | 'happy' | 'excited' | 'thinking' | 'surprised' | 'calm' | 'confused' | 'sleepy' | 'celebratory';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'greeting';

export interface AIResponse {
  text: string;
  emotion: Emotion;
  animation?: string;
  speak?: boolean;
  tool?: string;
  toolArguments?: Record<string, unknown>;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  emotion?: Emotion;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Memory {
  id: string;
  category: 'preference' | 'study' | 'project' | 'interest' | 'communication';
  content: string;
  createdAt: number;
  updatedAt: number;
  enabled: boolean;
}

export interface PetuniaSettings {
  name: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  voiceEnabled: boolean;
  voiceSpeed: number;
  voiceVolume: number;
  memoryEnabled: boolean;
  avatarEnabled: boolean;
}

export type AIProviderType = 'openai' | 'anthropic' | 'google' | 'ollama';
