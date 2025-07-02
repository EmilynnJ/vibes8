import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    __DEV__: false,
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, './src'),
      // Use our web-compatible icon component
      '@expo/vector-icons/Ionicons': path.resolve(__dirname, './src/components/WebIcon.tsx'),
      // Mock problematic modules for web
      'react-native-reanimated': path.resolve(__dirname, './src/components/WebMocks.tsx'),
      'react-native-gesture-handler': path.resolve(__dirname, './src/components/WebMocks.tsx'),
      'expo-camera': path.resolve(__dirname, './src/components/WebMocks.tsx'),
      'expo-av': path.resolve(__dirname, './src/components/WebMocks.tsx'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-native-web',
    ],
    exclude: [
      '@expo/vector-icons',
      'react-native-reanimated',
      'react-native-gesture-handler',
      'react-native-vision-camera',
      'expo-camera',
      'expo-av',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: ['react-native-web/**', 'tailwind-merge/**'],
    },
    rollupOptions: {
      external: (id) => {
        // Exclude problematic modules that don't work on web
        return id.includes('@expo/vector-icons') ||
               id.includes('react-native-reanimated') ||
               id.includes('react-native-gesture-handler') ||
               id.includes('expo-camera') ||
               id.includes('expo-av') ||
               id.includes('react-native-vision-camera');
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          'react-native-web': ['react-native-web'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  css: {
    postcss: './postcss.config.js',
  },
});