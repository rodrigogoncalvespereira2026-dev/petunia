import { useFileStore } from '../stores/fileStore';
import { VisionService } from '../services/vision';

interface VisionResult {
  hasImage: boolean;
  response?: string;
  imageUri?: string;
}

export function useVisionCommands() {
  const { pickImage, takePhoto, addFile } = useFileStore();

  const processImageCommand = async (text: string): Promise<VisionResult> => {
    const lower = text.toLowerCase();

    if (lower.includes('foto') || lower.includes('câmara') || lower.includes('camera')) {
      const file = await takePhoto();
      if (file) {
        return { hasImage: true, imageUri: file.uri };
      }
      return { hasImage: false };
    }

    if (lower.includes('imagem') || lower.includes('galeria') || lower.includes('image')) {
      const file = await pickImage();
      if (file) {
        return { hasImage: true, imageUri: file.uri };
      }
      return { hasImage: false };
    }

    return { hasImage: false };
  };

  const analyzeImage = async (uri: string, prompt?: string): Promise<string> => {
    const analysis = await VisionService.analyzeImage(uri, prompt);
    return analysis.description;
  };

  return { processImageCommand, analyzeImage };
}
