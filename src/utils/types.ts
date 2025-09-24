/**
 * Configuration options for DyText client
 */
export interface DyTextConfig {
  clientToken?: string;
}

/**
 * Dotted path type for accessing nested properties (e.g., "user.profile.name")
 */
export type DottedPath = string;

/**
 * DyText client interface - minimal skeleton for now
 */
export interface DyTextClient {
  get(path: DottedPath): Promise<any>;
  isInitialized(): boolean;
}
