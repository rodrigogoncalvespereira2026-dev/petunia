export type FileType = 'image' | 'document' | 'text' | 'audio' | 'video' | 'other';

export interface PetuniaFile {
  id: string;
  name: string;
  type: FileType;
  uri: string;
  size: number;
  mimeType?: string;
  createdAt: number;
  analyzed?: boolean;
  analysis?: string;
}

export interface ImageAnalysis {
  description: string;
  objects?: string[];
  text?: string[];
  colors?: string[];
  mood?: string;
}

export interface FileFilter {
  type?: FileType;
  search?: string;
}
