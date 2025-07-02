// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Windows-specific module resolution fixes
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Fix module resolution for complex paths
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '..', 'node_modules'),
];

// Disable symlinks resolution (Windows issue)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ms') {
    return {
      filePath: path.resolve(__dirname, 'node_modules', 'ms', 'index.js'),
      type: 'sourceFile'
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
