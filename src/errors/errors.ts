import { DytextError, DytextErrorCode } from '../types/results';

/**
 * Base error class for all DyText errors
 */
export class DytextBaseError extends Error implements DytextError {
  public readonly code: DytextErrorCode;
  public readonly details?: unknown;

  constructor(code: DytextErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }

  toJSON(): DytextError {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

/**
 * Initialization related errors
 */
export class InitializationError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.INITIALIZATION_ERROR, message, details);
  }
}

/**
 * Token validation errors
 */
export class TokenError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.INVALID_TOKEN, message, details);
  }
}

/**
 * API related errors
 */
export class ApiError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.API_ERROR, message, details);
  }
}

/**
 * Network related errors
 */
export class NetworkError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.NETWORK_ERROR, message, details);
  }
}

/**
 * Cache related errors
 */
export class CacheError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.CACHE_ERROR, message, details);
  }
}

/**
 * Resolution related errors
 */
export class ResolutionError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.RESOLUTION_ERROR, message, details);
  }
}

/**
 * Validation related errors
 */
export class ValidationError extends DytextBaseError {
  constructor(message: string, details?: unknown) {
    super(DytextErrorCode.VALIDATION_ERROR, message, details);
  }
}