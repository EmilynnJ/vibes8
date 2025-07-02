# 🚨 WINDOWS MODULE RESOLUTION FIX

## **Your Exact Error:**
```
Module 'C:\Users\emily\Dropbox\PC (2)\Downloads\vibecode5\node_modules\ms\index' 
has a valid "main" entry
(node:internal/modules/cjs/loader:493:19)
```

## **IMMEDIATE WINDOWS FIX:**

### **Step 1: Fix Path Issues**
```bash
# In your project folder (vibecode5):
cd "C:\Users\emily\Dropbox\PC (2)\Downloads\vibecode5"

# Delete problematic folders
rmdir /s node_modules
del bun.lock
del package-lock.json

# Clean install
bun install
```

### **Step 2: Fix Metro Config for Windows**
Create/update `metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Windows-specific fixes
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Fix module resolution for Windows paths
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = withNativeWind(config, { input: './global.css' });
```

### **Step 3: Alternative - Move Project**
```bash
# Move to shorter path (Windows path length limits)
# From: C:\Users\emily\Dropbox\PC (2)\Downloads\vibecode5
# To: C:\Projects\soulseer

mkdir C:\Projects
xcopy "C:\Users\emily\Dropbox\PC (2)\Downloads\vibecode5" C:\Projects\soulseer /E /I
cd C:\Projects\soulseer
bun install
bun run start
```

### **Step 4: Force Start with Specific Port**
```bash
# Try different approaches:
npx expo start --port 3000 --clear
# OR
npx expo start --tunnel
# OR  
bun run start
```