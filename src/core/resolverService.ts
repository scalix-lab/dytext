import { DytextResolver } from './resolver/resolver';
import { StateManager } from '../state/StateManager';

// Main resolver function that delegates to the resolver service
export async function resolveDytext(path: string): Promise<any> {
  const stateManager = StateManager.getInstance();
  if (!stateManager.isInitialized()) {
    throw new Error('DyText library must be initialized before use. Call initDytext() first.');
  }
  return DytextResolver.getInstance().resolve(path);
}
