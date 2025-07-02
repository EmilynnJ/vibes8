import React from 'react';
import { Text } from 'react-native';

// Simple text-based icons for web compatibility
const iconMap: Record<string, string> = {
  'home': '🏠',
  'home-outline': '🏠',
  'book': '📖',
  'book-outline': '📖',
  'radio': '📻',
  'radio-outline': '📻',
  'storefront': '🏪',
  'storefront-outline': '🏪',
  'grid': '▣',
  'grid-outline': '▣',
  'people': '👥',
  'people-outline': '👥',
  'help-outline': '❓',
  'arrow-back': '←',
  'arrow-forward': '→',
  'close': '✕',
  'menu': '☰',
  'search': '🔍',
  'add': '+',
  'remove': '−',
  'star': '⭐',
  'star-outline': '☆',
  'heart': '❤️',
  'heart-outline': '♡',
  'chatbubble': '💬',
  'chatbubble-outline': '💬',
  'call': '📞',
  'call-outline': '📞',
  'videocam': '📹',
  'videocam-outline': '📹',
  'settings': '⚙️',
  'settings-outline': '⚙️',
  'person': '👤',
  'person-outline': '👤',
  'mail': '✉️',
  'mail-outline': '✉️',
  'notifications': '🔔',
  'notifications-outline': '🔔',
  'wallet': '💰',
  'wallet-outline': '💰',
  'card': '💳',
  'card-outline': '💳',
  'calendar': '📅',
  'calendar-outline': '📅',
  'time': '⏰',
  'time-outline': '⏰',
  'location': '📍',
  'location-outline': '📍',
  'camera': '📷',
  'camera-outline': '📷',
  'image': '🖼️',
  'image-outline': '🖼️',
};

interface WebIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export default function WebIcon({ name, size = 24, color, style }: WebIconProps) {
  const iconSymbol = iconMap[name] || '?';
  
  return (
    <Text
      style={[
        {
          fontSize: size * 0.8, // Slightly smaller to match icon sizes better
          color: color || '#666',
          textAlign: 'center',
          lineHeight: size,
          width: size,
          height: size,
        },
        style,
      ]}
    >
      {iconSymbol}
    </Text>
  );
}