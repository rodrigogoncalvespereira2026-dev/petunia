import React from 'react';
import { PetuniaFace } from './PetuniaFace';

interface Avatar3DProps {
  size?: number;
  showControls?: boolean;
}

export function Avatar3D({ size = 300, showControls = false }: Avatar3DProps) {
  return <PetuniaFace size={size} />;
}
