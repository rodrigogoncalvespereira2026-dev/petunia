import { create } from 'zustand';
import { Message, Conversation, Emotion } from '../types';
import { Storage } from '../services/storage';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  petuniaEmotion: Emotion;

  createConversation: () => Conversation;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPetuniaEmotion: (emotion: Emotion) => void;
  loadConversations: () => Promise<void>;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,
  petuniaEmotion: 'neutral',

  createConversation: () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'Nova Conversa',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversation: newConversation,
    }));
    Storage.set('conversations', get().conversations);
    return newConversation;
  },

  setCurrentConversation: (id) => {
    const conversation = get().conversations.find((c) => c.id === id);
    set({ currentConversation: conversation || null });
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, message],
            updatedAt: Date.now(),
          };
        }
        return c;
      });
      const currentConversation = conversations.find((c) => c.id === conversationId);
      Storage.set('conversations', conversations);
      return { conversations, currentConversation };
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPetuniaEmotion: (emotion) => set({ petuniaEmotion: emotion }),

  loadConversations: async () => {
    const conversations = await Storage.get<Conversation[]>('conversations');
    if (conversations) {
      set({ conversations });
    }
  },
}));
