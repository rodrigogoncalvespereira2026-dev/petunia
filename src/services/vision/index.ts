import { ImageAnalysis } from '../../types/files';

interface VisionProvider {
  analyzeImage(imageUri: string, prompt?: string): Promise<ImageAnalysis>;
}

class OpenAIVision implements VisionProvider {
  async analyzeImage(imageUri: string, prompt?: string): Promise<ImageAnalysis> {
    const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY || '';
    const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL || 'https://api.openai.com/v1';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt || 'Analisa esta imagem em detalhe. Descreve o que vês, identifica objetos, texto visível, cores predominantes e humor/mood da imagem. Responde em JSON: { "description": "descrição", "objects": ["obj1"], "text": ["texto1"], "colors": ["cor1"], "mood": "humor" }',
              },
              {
                type: 'image_url',
                image_url: { url: imageUri },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      return JSON.parse(content);
    } catch {
      return { description: content };
    }
  }
}

class LocalVision implements VisionProvider {
  async analyzeImage(imageUri: string, prompt?: string): Promise<ImageAnalysis> {
    return {
      description: 'Análise de imagem não disponível offline. Conecta-te à Internet para分析 de imagens.',
    };
  }
}

export const VisionService = {
  provider: null as VisionProvider | null,

  init(useAPI: boolean = true) {
    if (useAPI && process.env.EXPO_PUBLIC_AI_API_KEY) {
      this.provider = new OpenAIVision();
    } else {
      this.provider = new LocalVision();
    }
  },

  async analyzeImage(imageUri: string, prompt?: string): Promise<ImageAnalysis> {
    if (!this.provider) {
      this.init();
    }
    return this.provider!.analyzeImage(imageUri, prompt);
  },
};
