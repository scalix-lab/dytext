import { DytextModel, DytextPrimitiveValue, DytextField } from '../models/models';
import { DytextValidationResult } from '../types/results';
import { ValidationError } from '../errors/errors';

/**
 * Validator for field values
 */
export class DytextValidator {
  /**
   * Validate a primitive value based on its type
   */
  private static validatePrimitiveValue(value: DytextPrimitiveValue): void {
    if (value === undefined || value === null) {
      throw new ValidationError('Field value cannot be null or undefined');
    }

    if (Array.isArray(value) && !value.every(item => typeof item === 'string')) {
      throw new ValidationError('Array values must contain only strings');
    }
  }

  /**
   * Validate a single field
   */
  private static validateField(field: DytextField): void {
    if (!field || typeof field !== 'object') {
      throw new ValidationError('Invalid field structure');
    }

    if (!('value' in field)) {
      throw new ValidationError('Field must have a value property');
    }

    DytextValidator.validatePrimitiveValue(field.value);
  }

  /**
   * Validate a complete model
   */
  public static validateModel(model: DytextModel): DytextValidationResult {
    try {
      if (!model || typeof model !== 'object') {
        throw new ValidationError('Invalid model structure');
      }

      if (!model.name || typeof model.name !== 'string') {
        throw new ValidationError('Model must have a valid name');
      }

      if (!Array.isArray(model.fields)) {
        throw new ValidationError('Model fields must be an array');
      }

      model.fields.forEach((fieldRecord, index) => {
        Object.entries(fieldRecord).forEach(([key, field]) => {
          try {
            DytextValidator.validateField(field);
          } catch (error) {
            throw new ValidationError(
              `Invalid field "${key}" at index ${index}`,
              error
            );
          }
        });
      });

      return { valid: true };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          valid: false,
          errors: [error.toJSON()]
        };
      }
      throw error;
    }
  }

  /**
   * Check if response is a wildcard (multiple models) response 
   */
  private static isWildcardResponse(data: unknown): data is Record<string, DytextModel> {
    if (!data || typeof data !== 'object') return false;
    if (Array.isArray(data)) return false;
    
    // Check if each value in the object is a model with name and fields
    return Object.values(data as Record<string, unknown>).every(value => 
      value && typeof value === 'object' && !Array.isArray(value) &&
      'name' in value && 'fields' in value
    );
  }

  /**
   * Validate API response data
   */
  public static validateApiResponse(data: unknown): DytextValidationResult {
    try {
      console.log('Validating API response:', JSON.stringify(data, null, 2));
      
      if (!data || typeof data !== 'object') {
        throw new ValidationError('Invalid API response data');
      }

      if (Array.isArray(data)) {
        throw new ValidationError('API response data cannot be an array');
      }

      if (DytextValidator.isWildcardResponse(data)) {
        // For wildcard responses, validate each model
        Object.entries(data).forEach(([key, model]) => {
          const result = DytextValidator.validateModel(model);
          if (!result.valid) {
            throw new ValidationError(
              `Invalid model "${key}"`,
              result.errors
            );
          }
        });
      } else {
        // For single model responses, validate directly
        const result = DytextValidator.validateModel(data as DytextModel);
        if (!result.valid) {
          throw new ValidationError(
            'Invalid model response',
            result.errors
          );
        }
      }

      return { valid: true };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          valid: false,
          errors: [error.toJSON()]
        };
      }
      throw error;
    }
  }
}