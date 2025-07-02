export default {
  expo: {
    name: "SoulSeer",
    slug: "soulseer",
    scheme: "soulseer",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    description: "A Community of Gifted Psychics - Professional psychic readings and spiritual guidance",
    privacy: "public",
    platforms: ["ios", "android", "web"],
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1a1a2e"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.soulseer.app",
      buildNumber: "1"
    },
    android: {
      edgeToEdgeEnabled: true,
      package: "com.soulseer.app",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1a1a2e"
      }
    },
    web: {
      bundler: "webpack",
      output: "static"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    plugins: [
      "expo-dev-client",
      "expo-camera",
      "expo-av",
      "expo-secure-store"
    ],
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_VIBECODE_PROJECT_ID
      }
    }
  }
};