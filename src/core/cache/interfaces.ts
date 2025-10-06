/**
 * Configuration options for cache
 */
export interface ICacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
  strategy: CacheStrategy;
}

/**
 * Available cache strategies
 */
export enum CacheStrategy {
  MEMORY = "memory",
  LOCAL_STORAGE = "localStorage",
  NONE = "none",
}

/**
 * Cache entry structure
 */
export interface ICacheEntry<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Main cache interface
 */
export interface ICache {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  size(): number;
}

/**
 * Cache events that can be subscribed to
 */
export interface ICacheEvents {
  onSet?: (key: string, value: unknown) => void;
  onGet?: (key: string, hit: boolean) => void;
  onDelete?: (key: string) => void;
  onClear?: () => void;
  onError?: (error: Error) => void;
}
