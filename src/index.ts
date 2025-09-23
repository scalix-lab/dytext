import { DyTextConfig, DottedPath, DyTextClient } from './types';

/**
 * DyText - Dynamic Text Management Library
 * 
 * This is a minimal skeleton implementation for TDD development.
 * Full functionality will be implemented step by step with tests.
 */
class DyText implements DyTextClient {
  private config: DyTextConfig;
  private initialized = false;

  constructor(config: DyTextConfig = {}) {
    this.config = config;
    this.initialized = true;
    console.log('DyText initialized! 🚀');
  }

  /**
   * Get value by dotted path (e.g., "user.profile.name")
   * Currently returns a hello world message - will be implemented with TDD
   */
  async get(path: DottedPath): Promise<any> {
    if (!this.initialized) {
      throw new Error('DyText client not initialized.');
    }

    // Hello world implementation - placeholder for TDD development
    return `Hello from DyText! You requested: "${path}"`;
  }

  /**
   * Check if client is properly initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

/**
 * Create a new DyText client instance
 * Supports multiple initialization patterns:
 * - Direct config: createClient({ clientToken: 'token' })
 * - Environment variable: createClient() // uses DYTEXT_TOKEN
 */
export function createClient(config: DyTextConfig = {}): DyTextClient {
  // Check for environment variable if no token provided
  const finalConfig = {
    ...config,
    clientToken: config.clientToken || process.env.DYTEXT_TOKEN || undefined,
  };

  return new DyText(finalConfig);
}

/**
 * Utility function to get value by dotted path from any object
 * This is a pure utility function that works with any object
 */
export function getByPath(obj: any, path: DottedPath): any {
  if (!path) return obj;
  if (!obj) return undefined;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

// Export types for external use
export * from './types';
