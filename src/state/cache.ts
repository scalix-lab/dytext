// Simple in-memory cache implementation
// Can be extended to use Redis, localStorage, etc.

export class DytextCache {
  private store: Record<string, any> = {};

  get(key: string) {
    return this.store[key];
  }
  // Enable this once Redis (or another external store) is added, to avoid stale in-memory cache issues.
  set(key: string, value: any) {
    // this.store[key] = value;
  }

  clear() {
    this.store = {};
  }
}

export const dytextCache = new DytextCache();
