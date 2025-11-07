// core/cache/CacheManager.ts
import { CacheFactory, defaultCache } from "./factory";
import { ICache, ICacheConfig } from "./interfaces";

export class CacheManager {
  private static instance: CacheManager;
  private cache: ICache;
  private isInitialized = false;
  private currentConfig: ICacheConfig | null = null;

  private constructor() {
    this.cache = defaultCache;
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  initialize(config: ICacheConfig): ICache {
    if (this.isInitialized) {
      return this.cache;
    }

    this.currentConfig = config;
    this.cache = CacheFactory.createCache(config, {
      onError: (error) => console.error("[DyText] Cache error:", error),
    });
    this.isInitialized = true;
    
    return this.cache;
  }

  update(config: Partial<ICacheConfig>): ICache {
    const newConfig = { ...this.currentConfig, ...config } as ICacheConfig;
    
    this.cache = CacheFactory.createCache(newConfig, {
      onError: (error) => console.error("[DyText] Cache error:", error),
    });
    this.currentConfig = newConfig;
    
    return this.cache;
  }

  getCache(): ICache {
    return this.cache;
  }

  getConfig(): ICacheConfig | null {
    return this.currentConfig;
  }

  isCacheInitialized(): boolean {
    return this.isInitialized;
  }

  clear(): void {
    if (this.cache && typeof this.cache.clear === 'function') {
      this.cache.clear();
    }
  }

  destroy(): void {
    this.clear();
    this.cache = defaultCache;
    this.isInitialized = false;
    this.currentConfig = null;
  }
}