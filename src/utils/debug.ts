/**
 * Debug utilities for troubleshooting API key issues
 */

export function debugEnvironment() {
  console.log('=== Environment Debug Info ===');
  console.log('import.meta.env:', (import.meta as any).env);
  console.log('import.meta.env.VITE_OPENAI_API_KEY:', (import.meta as any).env?.VITE_OPENAI_API_KEY);
  console.log('typeof window:', typeof window);
  console.log('typeof process:', typeof process);
  
  if (typeof process !== 'undefined') {
    console.log('process.env.VITE_OPENAI_API_KEY:', process.env.VITE_OPENAI_API_KEY);
  }
  
  if (typeof window !== 'undefined') {
    console.log('localStorage openai_api_key:', localStorage.getItem('openai_api_key'));
  }
  
  console.log('=== End Debug Info ===');
}
