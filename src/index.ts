import { ConfigManager } from './config/configManager';
import { DytextConfig, DytextInitResult } from './types/config';
import { DytextModel } from './types/models/models';
import { ValidModelPath } from './types/paths';
import { DytextService } from './core/dytextService';

const config = ConfigManager.getInstance();
const dytext = DytextService.getInstance();

/**
 * Initialize the DyText library
 * Optional if DYTEXT_CLIENT_TOKEN environment variable is set
 * @param dytextClientToken - The client token for authentication
 * @param userConfig - Optional configuration options
 * @returns Initialization result
 */
export async function initDytext(
  dytextClientToken?: string,
  userConfig?: DytextConfig
): Promise<DytextInitResult> {
  if (userConfig) {
    config.updateConfig(userConfig);
  }
  return dytext.initialize(dytextClientToken, userConfig);
}

/**
 * Get content by dotted path from models
 * Will auto-initialize from environment if needed
 * @param path - Optional dotted path to specific content. Uses '*' if not provided
 * @returns Resolved content with metadata
 */
export async function getDytext<
  T extends DytextModel = DytextModel,
  P extends ValidModelPath<T> | '*' = '*'
>(path?: P): Promise<P extends '*' ? Record<string, T> : any> {
  return dytext.get(path || '*');
}

/**
 * Update library configuration
 * @param userConfig - New configuration options
 */
export function updateConfig(userConfig: Partial<DytextConfig>): void {
  config.updateConfig(userConfig);
}

/**
 * Reset library configuration and initialization state
 */
export function resetConfig(): void {
  config.resetConfig();
  dytext.reset();
}

/**
 * Enable or disable debug mode
 */
export function setDebugMode(enabled: boolean): void {
  config.setDebugMode(enabled);
}

// Re-export types for public use
export * from './types/config';
export * from './types/models/models';
export * from './types/paths';
export * from './types/results';
