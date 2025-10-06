/**
 * Base type for all field values
 */
export type DytextPrimitiveValue = string | number | boolean | string[];

/**
 * Field value with metadata
 */
export interface DytextField<T extends DytextPrimitiveValue = DytextPrimitiveValue> {
  value: T;
  metadata?: Record<string, unknown>;
}

/**
 * Generic model field record
 */
export interface DytextModelFields {
  [key: string]: DytextField;
}

/**
 * Strongly typed model structure
 */
export interface DytextModel<T extends DytextModelFields = DytextModelFields> {
  name: string;
  fields: T[];
}

/**
 * Collection of models
 */
export type DytextModels = Record<string, DytextModel>;

/**
 * Helper type to extract the value type from a field
 */
export type ExtractFieldValue<T> = T extends DytextField<infer U> ? U : never;

/**
 * Helper type to extract field values from a model
 */
export type ExtractModelValues<T extends DytextModelFields> = {
  [K in keyof T]: ExtractFieldValue<T[K]>;
};