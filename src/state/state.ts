// Global state management for the library
let isInitialized = false;

export function getInitializationState(): boolean {
  return isInitialized;
}

export function setInitialized(): void {
  isInitialized = true;
}

export function resetInitialization(): void {
  isInitialized = false;
}

export function ensureInitialized(): void {
  if (!isInitialized) {
    throw new Error('DyText library must be initialized before use. Call initDytext() first.');
  }
}
