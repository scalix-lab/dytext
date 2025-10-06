import { BaseCache } from "./base";
import { ICacheEntry, ICacheConfig, ICacheEvents } from "./interfaces";

export class MemoryCache extends BaseCache {
  private store: Map<string, ICacheEntry<any>>;

  constructor(config: ICacheConfig, events?: ICacheEvents) {
    super(config, events);
    this.store = new Map();
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry) {
      this.events.onGet?.(key, false);
      return undefined;
    }

    if (this.isExpired(entry)) {
      this.delete(key);
      this.events.onGet?.(key, false);
      return undefined;
    }

    this.events.onGet?.(key, true);
    return entry.value as T;
  }

  set<T>(key: string, value: T): void {
    try {
      // Check size limit before adding
      if (this.config.maxSize && this.store.size >= this.config.maxSize) {
        // Remove oldest entry
        const oldest = Array.from(this.store.entries()).sort(
          ([, a], [, b]) => a.timestamp - b.timestamp,
        )[0];
        if (oldest) {
          this.delete(oldest[0]);
        }
      }

      const entry = this.createEntry(value);
      this.store.set(key, entry);
      this.events.onSet?.(key, value);
    } catch (error) {
      this.emitError(error as Error);
    }
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.store.delete(key);
    this.events.onDelete?.(key);
  }

  clear(): void {
    this.store.clear();
    this.events.onClear?.();
  }

  size(): number {
    return this.store.size;
  }
}
