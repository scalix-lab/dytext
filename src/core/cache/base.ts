import { ICache, ICacheConfig, ICacheEntry, ICacheEvents } from "./interfaces";

export abstract class BaseCache implements ICache {
  protected config: ICacheConfig;
  protected events: ICacheEvents;

  constructor(config: ICacheConfig, events?: ICacheEvents) {
    this.config = config;
    this.events = events || {};
  }

  abstract get<T>(key: string): T | undefined;
  abstract set<T>(key: string, value: T): void;
  abstract has(key: string): boolean;
  abstract delete(key: string): void;
  abstract clear(): void;
  abstract size(): number;

  protected isExpired(entry: ICacheEntry<any>): boolean {
    if (!entry.expiresAt) return false;
    return Date.now() > entry.expiresAt;
  }

  protected createEntry<T>(value: T): ICacheEntry<T> {
    const timestamp = Date.now();
    const expiresAt = this.config.ttl ? timestamp + this.config.ttl : undefined;

    return {
      value,
      timestamp,
      expiresAt,
    };
  }

  protected emitError(error: Error): void {
    if (this.events.onError) {
      this.events.onError(error);
    }
  }
}
