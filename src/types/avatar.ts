export type AvatarExpression = 
  | 'neutral' 
  | 'happy' 
  | 'excited' 
  | 'thinking' 
  | 'surprised' 
  | 'calm' 
  | 'confused' 
  | 'sleepy' 
  | 'celebratory';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'greeting';

export interface AvatarConfig {
  showEyes: boolean;
  showMouth: boolean;
  showEyebrows: boolean;
  blinkRate: number;
  headMovement: boolean;
}

export interface LipSyncFrame {
  time: number;
  open: number;
}

export interface AvatarAnimation {
  name: string;
  duration: number;
  frames: LipSyncFrame[];
}
