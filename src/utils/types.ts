/**
 * Optional configuration options for DyText client
 */
export interface DyTextConfig {
  // Future config options will go here
  // e.g., timeout, retries, custom endpoints, etc.
}

/**
 * DyText library state structure
 */
export interface DyTextState {
  initialized: boolean;
  dytextClientToken?: string;
  projectId?: string;
  token?: string;
}

/**
 * Dotted path type for accessing nested properties (e.g., "user.profile.name")
 */
export type DottedPath = string;

/**
 * Field value structure in the new schema
 */
export interface DytextFieldValue {
  value: string | number | boolean | string[];
}

/**
 * Field record where keys are field names and values are DytextFieldValue objects
 */
export type DytextFieldRecord = Record<string, DytextFieldValue>;

/**
 * DyText model structure matching the new schema
 */
export interface DytextModel {
  name: string;
  fields: DytextFieldRecord[];
}

/**
 * Collection of DyText models indexed by model name
 */
export type DytextModels = Record<string, DytextModel>;

/**
 * DyText client interface - minimal skeleton for now
 */
export interface DyTextClient {
  get(path: DottedPath): Promise<any>;
  isInitialized(): boolean;
}
