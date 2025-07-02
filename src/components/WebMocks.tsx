import React from 'react';
import { View, Text } from 'react-native';

// Web-compatible mocks for React Native modules that don't work in web builds

// Mock for react-native-reanimated
export const useSharedValue = (initialValue: any) => ({ value: initialValue });
export const useAnimatedStyle = (styleFunction: any) => styleFunction();
export const withTiming = (value: any) => value;
export const withSpring = (value: any) => value;
export const runOnJS = (fn: any) => fn;
export const Easing = {
  bezier: () => (t: number) => t,
  inOut: () => (t: number) => t,
  out: () => (t: number) => t,
};

// Mock animated components
export const Animated = {
  View: View,
  Text: Text,
  ScrollView: View,
  FlatList: View,
};

// Mock for react-native-gesture-handler
export const GestureHandlerRootView = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const PanGestureHandler = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const State = {
  BEGAN: 0,
  ACTIVE: 1,
  END: 2,
  CANCELLED: 3,
  FAILED: 4,
  UNDETERMINED: 5,
};

// Mock for Expo Camera
export const Camera = ({ children, ...props }: any) => (
  <View {...props} style={[{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }, props.style]}>
    <Text style={{ color: 'white' }}>Camera not available on web</Text>
    {children}
  </View>
);

// Mock for Expo AV
export const Video = ({ ...props }: any) => (
  <View {...props} style={[{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }, props.style]}>
    <Text style={{ color: 'white' }}>Video not available on web</Text>
  </View>
);

export const Audio = {
  setAudioModeAsync: () => Promise.resolve(),
  Sound: {
    createAsync: () => Promise.resolve({ sound: null }),
  },
};

// Default export (handles various import patterns)
export default {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
  Animated,
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  Camera,
  Video,
  Audio,
};