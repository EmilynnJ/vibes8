import React from 'react';
import { Text } from 'react-native';

// Web-compatible icon component using Unicode symbols
const iconMap: Record<string, string> = {
  'home': '🏠',
  'home-outline': '🏠',
  'book': '📚',
  'book-outline': '📖',
  'radio': '📻',
  'radio-outline': '📻',
  'storefront': '🏪',
  'storefront-outline': '🏪',
  'grid': '⚏',
  'grid-outline': '⚏',
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

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export default function Icon({ name, size = 24, color = '#000', style, ...props }: IconProps) {
  const iconSymbol = iconMap[name] || '?';
  
  return (
    <Text
      style={[
        {
          fontSize: size,
          color,
          textAlign: 'center',
          lineHeight: size + 4,
        },
        style,
      ]}
      {...props}
    >
      {iconSymbol}
    </Text>
  );
}