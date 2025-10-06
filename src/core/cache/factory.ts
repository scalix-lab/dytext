import {
  ICache,
  ICacheConfig,
  CacheStrategy,
  ICacheEvents,
} from "./interfaces";
import { MemoryCache } from "./memory";

export class CacheFactory {
  static createCache(config: ICacheConfig, events?: ICacheEvents): ICache {
    switch (config.strategy) {
      case CacheStrategy.MEMORY:
        return new MemoryCache(config, events);
      case CacheStrategy.NONE:
        return new MemoryCache({ ...config, maxSize: 0 }, events);
      default:
        throw new Error(`Unsupported cache strategy: ${config.strategy}`);
    }
  }
}

// Default configuration
const defaultConfig: ICacheConfig = {
  strategy: CacheStrategy.MEMORY,
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
};

// Create default cache instance
export const defaultCache = CacheFactory.createCache(defaultConfig, {
  onError: (error) => console.error("Cache error:", error),
});
