import { initDytextService } from './core/init';
import { resolveDytext } from './core/resolverService';
import { ConfigManager } from './config/configManager';
import { DytextConfig, DytextInitResult } from './types/config';
import { DytextModel } from './models/models';
import { ValidModelPath } from './types/paths';

const config = ConfigManager.getInstance();

/**
 * Initialize the DyText library
 * @param dytextClientToken - The client token for authentication
 * @param userConfig - Optional configuration options
 * @returns Initialization result
 */
export function initDytext(
  dytextClientToken: string,
  userConfig?: DytextConfig
): DytextInitResult {
  if (userConfig) {
    config.updateConfig(userConfig);
  }
  return initDytextService(dytextClientToken);
}

/**
 * Get content by dotted path from models
 * @param path - Optional dotted path to specific content. Uses '*' if not provided
 * @returns Resolved content with metadata
 */
export async function getDytext<
  T extends DytextModel = DytextModel,
  P extends ValidModelPath<T> | '*' = '*'
>(path?: P): Promise<P extends '*' ? Record<string, T> : any> {
  return resolveDytext(path || '*');
}

/**
 * Update library configuration
 * @param userConfig - New configuration options
 */
export function updateConfig(userConfig: Partial<DytextConfig>): void {
  config.updateConfig(userConfig);
}

/**
 * Reset library configuration to defaults
 */
export function resetConfig(): void {
  config.resetConfig();
}

/**
 * Enable or disable debug mode
 */
export function setDebugMode(enabled: boolean): void {
  config.setDebugMode(enabled);
}

// Re-export types for public use
export * from './types/config';
export * from './models/models';
export * from './types/paths';
export * from './types/results';
