import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import { getText } from '../get-text';

export const ARRAY_NOT_EMPTY = 'arrayNotEmpty';

/**
 * Checks if given array is not empty.
 * If null or undefined is given then this function returns false.
 */
export function arrayNotEmpty(array: unknown): boolean {
  return array instanceof Array && array.length > 0;
}

/**
 * Checks if given array is not empty.
 * If null or undefined is given then this function returns false.
 */
export function ArrayNotEmpty(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: ARRAY_NOT_EMPTY,
      validator: {
        validate: (value, args): boolean => arrayNotEmpty(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + getText('$property should not be empty'),
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
