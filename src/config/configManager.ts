import { DytextConfig, DytextApiConfig } from "../types/config";
import { ValidationError } from "../errors/errors";

import { API, TIMEOUTS, DEFAULTS, buildApiUrl } from "../constants";
import { deepMerge } from "../utils/common";
import { CacheStrategy } from "../core/cache/interfaces";
import { dytextCache } from "../state/cache";

/**
 * Default API configuration
 */
const DEFAULT_API_CONFIG: Required<DytextApiConfig> = {
  endpoint: buildApiUrl(API.ENDPOINTS.GET_MODEL),
  timeout: TIMEOUTS.API_REQUEST,
  retryAttempts: DEFAULTS.RETRY_ATTEMPTS,
  retryDelay: TIMEOUTS.RETRY_DELAY,
};

/**
 * Default global configuration
 */
const DEFAULT_CONFIG: Required<DytextConfig> = {
  debug: false,
  version: "1.0.0",
  api: DEFAULT_API_CONFIG,
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
  },
};

/**
 * Configuration manager for the DyText library
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: Required<DytextConfig>;

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Validate configuration values
   */
  private validateConfig(config: Partial<DytextConfig>): void {
    if (config.api) {
      if (config.api.timeout && config.api.timeout < 0) {
        throw new ValidationError("API timeout must be a positive number");
      }
      if (config.api.retryAttempts && config.api.retryAttempts < 0) {
        throw new ValidationError("Retry attempts must be a positive number");
      }
      if (config.api.retryDelay && config.api.retryDelay < 0) {
        throw new ValidationError("Retry delay must be a positive number");
      }
    }

    if (config.cache) {
      if (config.cache.ttl && config.cache.ttl < 0) {
        throw new ValidationError("Cache TTL must be a positive number");
      }
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<DytextConfig>): void {
    this.validateConfig(config);

    // Deep merge configuration
    this.config = deepMerge(this.config, config) as Required<DytextConfig>;

    if (config.cache?.enabled) {
      // Ensure cache is initialized before updating
      if (!dytextCache.isCacheInitialized()) {
        dytextCache.initialize({
          strategy: CacheStrategy.MEMORY,
          maxSize: 1000,
          ttl: this.config.cache.ttl,
        });
      } else {
        dytextCache.update({
          strategy: CacheStrategy.MEMORY,
          maxSize: 1000,
          ttl: this.config.cache.ttl,
        });
      }
    }
  }

  /**
   * Reset configuration to defaults
   */
  public resetConfig(): void {
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * Get current configuration
   */
  public getConfig(): Readonly<Required<DytextConfig>> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Get API configuration
   */
  public getApiConfig(): Readonly<Required<DytextApiConfig>> {
    return Object.freeze({ ...this.config.api }) as Readonly<
      Required<DytextApiConfig>
    >;
  }

  /**
   * Enable/disable debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.config.debug = enabled;
  }

  /**
   * Check if debug mode is enabled
   */
  public isDebugEnabled(): boolean {
    return this.config.debug;
  }
}
