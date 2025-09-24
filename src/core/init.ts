// Handles initialization logic for the API service
// Extendable for framework-specific bootstrapping

import { getInitializationState, setInitialized } from '../state/state';
import { dytextCache } from '../state/cache';

export function initDytextService(options?: Record<string, any>) {
  // Prevent multiple initializations
  if (getInitializationState()) {
    console.warn('DyText is already initialized. Ignoring subsequent initialization.');
    return {
      status: 'already-initialized',
      options,
    };
  }

  // Reset cache on initialization
  dytextCache.clear();
  
  // Mark as initialized
  setInitialized();
  
  // Placeholder for future extension (e.g., Express, Next.js, etc.)
  // Currently does nothing, but can be used to set up middleware, logging, etc.
  return {
    status: 'initialized',
    options,
  };
}
