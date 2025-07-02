import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: any;
}

export default function Icon({ name, size = 24, color = '#000', style, ...props }: IconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
}