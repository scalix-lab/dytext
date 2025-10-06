import { DytextModel, ExtractModelValues } from "./models/models";

/**
 * Type for dotted path strings
 */
export type DottedPath = string;

/**
 * Helper type to split a dotted path
 */
export type Split<S extends string> = S extends `${infer T}.${infer U}`
  ? [T, ...Split<U>]
  : [S];

/**
 * Helper type to access nested object properties
 */
export type DeepKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${DeepKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

/**
 * Type-safe path accessor
 */
export type PathValue<T, P extends DottedPath> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? PathValue<T[K], R>
      : never
    : never;

/**
 * Type-safe model field accessor
 */
export type ModelFieldValue<T extends DytextModel, P extends DottedPath> =
  T extends DytextModel<infer F> ? PathValue<ExtractModelValues<F>, P> : never;

/**
 * Valid path type for a specific model
 */
export type ValidModelPath<T extends DytextModel> = DeepKeyOf<
  ExtractModelValues<T extends DytextModel<infer F> ? F : never>
>;
