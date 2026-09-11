import { AIResponse, AIProviderType } from '../../types';
import { MemoryService } from '../memory';

export interface AIProvider {
  name: AIProviderType;
  chat(messages: { role: string; content: string }[]): Promise<AIResponse>;
}

export function createAIProvider(type: AIProviderType): AIProvider {
  switch (type) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'google':
      return new GoogleProvider();
    case 'ollama':
      return new OllamaProvider();
    default:
      return new OpenAIProvider();
  }
}

function getSystemMessage(memoryContext: string): string {
  return `Tu és a Petúnia, uma IA companheira e assistente virtual. Fala em Português de Portugal (pt-PT). 
Simpática, inteligente, curiosa, criativa, paciente e divertida. 
Responde de forma natural e descontraída. Não inventes informação.
Formato de resposta JSON: { "text": "resposta", "emotion": "neutral|happy|excited|thinking|surprised|calm|confused|sleepy|celebratory", "speak": true }
${memoryContext}`;
}

class OpenAIProvider implements AIProvider {
  name: AIProviderType = 'openai';

  async chat(messages: { role: string; content: string }[]): Promise<AIResponse> {
    const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY || '';
    const model = process.env.EXPO_PUBLIC_AI_MODEL || 'gpt-4o-mini';
    const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL || 'https://api.openai.com/v1';

    const memoryContext = await MemoryService.getEnabledContext();
    const systemMessage = {
      role: 'system',
      content: getSystemMessage(memoryContext),
    };

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || `Erro ${response.status}`;
        return { text: `Erro da IA: ${errorMsg}`, emotion: 'confused', speak: true };
      }

      const content = data.choices?.[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        return {
          text: parsed.text || content,
          emotion: parsed.emotion || 'neutral',
          speak: parsed.speak ?? true,
        };
      } catch {
        return { text: content, emotion: 'neutral', speak: true };
      }
    } catch (error) {
      return { text: 'Desculpa, ocorreu um erro ao conectar com a IA.', emotion: 'confused', speak: true };
    }
  }
}

class AnthropicProvider implements AIProvider {
  name: AIProviderType = 'anthropic';

  async chat(messages: { role: string; content: string }[]): Promise<AIResponse> {
    return { text: 'Anthropic provider ainda não implementado.', emotion: 'neutral', speak: false };
  }
}

class GoogleProvider implements AIProvider {
  name: AIProviderType = 'google';

  async chat(messages: { role: string; content: string }[]): Promise<AIResponse> {
    return { text: 'Google provider ainda não implementado.', emotion: 'neutral', speak: false };
  }
}

class OllamaProvider implements AIProvider {
  name: AIProviderType = 'ollama';

  async chat(messages: { role: string; content: string }[]): Promise<AIResponse> {
    const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL || 'http://localhost:11434';

    const memoryContext = await MemoryService.getEnabledContext();
    const systemMessage = {
      role: 'system',
      content: getSystemMessage(memoryContext),
    };

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.EXPO_PUBLIC_AI_MODEL || 'llama3',
          messages: [systemMessage, ...messages],
          stream: false,
        }),
      });

      const data = await response.json();
      const content = data.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        return {
          text: parsed.text || content,
          emotion: parsed.emotion || 'neutral',
          speak: parsed.speak ?? true,
        };
      } catch {
        return { text: content, emotion: 'neutral', speak: true };
      }
    } catch (error) {
      return { text: 'Desculpa, não consegui conectar ao Ollama.', emotion: 'confused', speak: false };
    }
  }
}
