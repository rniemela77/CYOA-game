/**
 * Environment Variables Utility
 * 
 * This file provides utilities to access environment variables safely.
 */

/**
 * Gets an environment variable, with an optional fallback value
 * @param {string} key - The name of the environment variable
 * @param {string} fallback - Fallback value if environment variable is not set
 * @returns {string} - The value of the environment variable or fallback
 */
export function getEnv(key, fallback = '') {
  if (process.env && typeof process.env[key] !== 'undefined') {
    return process.env[key];
  }
  
  // For Vite, check import.meta.env
  if (import.meta && import.meta.env && typeof import.meta.env[key] !== 'undefined') {
    return import.meta.env[key];
  }
  
  // For Vite, also check with VITE_ prefix
  const viteKey = `VITE_${key}`;
  if (import.meta && import.meta.env && typeof import.meta.env[viteKey] !== 'undefined') {
    return import.meta.env[viteKey];
  }
  
  return fallback;
}

/**
 * Checks if an environment variable is set
 * @param {string} key - The name of the environment variable
 * @returns {boolean} - True if environment variable is set
 */
export function hasEnv(key) {
  // For Node.js
  if (process.env && typeof process.env[key] !== 'undefined') {
    return true;
  }
  
  // For Vite
  if (import.meta && import.meta.env && typeof import.meta.env[key] !== 'undefined') {
    return true;
  }
  
  // For Vite with VITE_ prefix
  const viteKey = `VITE_${key}`;
  if (import.meta && import.meta.env && typeof import.meta.env[viteKey] !== 'undefined') {
    return true;
  }
  
  return false;
}

/**
 * Gets the OpenAI API key from environment variables
 * @returns {string} - The OpenAI API key
 */
export function getOpenAIApiKey() {
  // Check both standard and Vite-prefixed env vars
  let apiKey = '';
  
  console.log('Looking for OpenAI API key in environment variables...');
  
  // For Vite environment variables (check this first as it's more likely in a Vue/Vite app)
  if (import.meta && import.meta.env) {
    console.log('Available import.meta.env variables:', Object.keys(import.meta.env).join(', '));
    
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('Found VITE_OPENAI_API_KEY in import.meta.env');
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    } else if (import.meta.env.OPENAI_API_KEY) {
      console.log('Found OPENAI_API_KEY in import.meta.env');
      apiKey = import.meta.env.OPENAI_API_KEY;
    }
  }
  
  // For direct environment variables (Node.js - fallback)
  if (!apiKey && process.env) {
    console.log('Available process.env variables:', Object.keys(process.env).join(', '));
    
    if (process.env.OPENAI_API_KEY) {
      console.log('Found OPENAI_API_KEY in process.env');
      apiKey = process.env.OPENAI_API_KEY;
    } else if (process.env.VITE_OPENAI_API_KEY) {
      console.log('Found VITE_OPENAI_API_KEY in process.env');
      apiKey = process.env.VITE_OPENAI_API_KEY;
    }
  }
  
  if (apiKey) {
    console.log('API key found! (First 4 chars):', apiKey.substring(0, 4) + '...');
    return apiKey;
  } else {
    console.warn(`
-------------------------------------------------------------
No OpenAI API key found in environment variables.
To use real API calls, please create a .env file in your project root with:

VITE_OPENAI_API_KEY=your_api_key_here

Make sure to restart the development server after creating/modifying the .env file.
Currently running in demo mode with predefined stories.
-------------------------------------------------------------
`);
    return '';
  }
}

/**
 * Checks if the OpenAI API key is set
 * @returns {boolean} - True if OpenAI API key is set
 */
export function hasOpenAIApiKey() {
  return hasEnv('OPENAI_API_KEY') || hasEnv('VITE_OPENAI_API_KEY');
}

/**
 * Determines if we're running in a local development environment
 * @returns {boolean} - True if in development environment
 */
export function isLocalDevelopment() {
  // Check for development mode in Vite
  if (import.meta && import.meta.env) {
    // Vite sets this in development mode
    if (import.meta.env.DEV === true || import.meta.env.MODE === 'development') {
      console.log('Detected development environment via Vite env');
      return true;
    }
  }
  
  // Check for development environment via location
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Check for localhost or local IP
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.') || 
        hostname.startsWith('10.') ||
        hostname.includes('.local')) {
      console.log('Detected development environment via hostname:', hostname);
      return true;
    }
  }
  
  // Default to false if no development indicators found
  return false;
} 