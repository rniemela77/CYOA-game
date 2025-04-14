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
  
  // For Vite environment variables
  if (import.meta && import.meta.env) {
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    } else if (import.meta.env.OPENAI_API_KEY) {
      apiKey = import.meta.env.OPENAI_API_KEY;
    }
  }
  
  // For direct environment variables (Node.js - fallback)
  if (!apiKey && process.env) {
    if (process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY;
    } else if (process.env.VITE_OPENAI_API_KEY) {
      apiKey = process.env.VITE_OPENAI_API_KEY;
    }
  }
  
  if (!apiKey) {
    console.warn('No OpenAI API key found in environment variables');
  }
  
  return apiKey;
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
      return true;
    }
  }
  
  // Default to false if no development indicators found
  return false;
} 