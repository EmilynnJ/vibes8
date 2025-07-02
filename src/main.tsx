import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native-web';
import App from '../App';
import '../global.css';

// Register the app
AppRegistry.registerComponent('SoulSeer', () => App);

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Clear loading content
rootElement.innerHTML = '';

// Run the app
AppRegistry.runApplication('SoulSeer', { rootTag: rootElement });