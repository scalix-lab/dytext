/**
 * Base configuration interface
 */
export interface DytextBaseConfig {
  debug?: boolean;
  version?: string;
}

/**
 * API configuration options
 */
export interface DytextApiConfig {
  endpoint?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Cache configuration options
 */
export interface DytextCacheConfig {
  enabled?: boolean;
  ttl?: number;
  maxSize?: number;
}

/**
 * Complete configuration type
 */
export interface DytextConfig extends DytextBaseConfig {
  api?: DytextApiConfig;
  cache?: DytextCacheConfig;
}

/**
 * Client token parsed structure
 */
export interface DytextClientToken {
  projectId: string;
  token: string;
}

/**
 * Library initialization result
 */
export interface DytextInitResult {
  initialized: boolean;
  dytextClientToken?: string;
  projectId?: string;
  token?: string;
  config?: DytextConfig;
}