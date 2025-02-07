import { ValidationArguments } from '../validation/ValidationArguments';

/**
 * Options used to pass to validation decorators.
 */
export interface ValidationOptions {
  /**
   * Specifies if validated value is an array and each of its items must be validated.
   */
  each?: boolean;

  /**
   * Error message to be used on validation fail.
   * Message can be either string or a function that returns a string.
   */
  message?: string | ((validationArguments: ValidationArguments) => string);

  /**
   * Validation groups used for this validation.
   */
  groups?: string[];

  /**
   * Indicates if validation must be performed always, no matter of validation groups used.
   */
  always?: boolean;

  /*
   * A transient set of data passed through to the validation result for response mapping
   */
  context?: any;

  /**
   * validation will be performed while the result is true
   */
  validateIf?: (object: any, value: any) => boolean;
}

export function isValidationOptions(val: any): val is ValidationOptions {
  if (!val) {
    return false;
  }
  return (
    'each' in val || 'message' in val || 'groups' in val || 'always' in val || 'context' in val || 'validateIf' in val
  );
}
