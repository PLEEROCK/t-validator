import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isVariableWidthValidator from 'validator/lib/isVariableWidth';
import { getText } from '../get-text';

export const IS_VARIABLE_WIDTH = 'isVariableWidth';

/**
 * Checks if the string contains variable-width chars.
 * If given value is not a string, then it returns false.
 */
export function isVariableWidth(value: unknown): boolean {
  return typeof value === 'string' && isVariableWidthValidator(value);
}

/**
 * Checks if the string contains variable-width chars.
 * If given value is not a string, then it returns false.
 */
export function IsVariableWidth(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_VARIABLE_WIDTH,
      validator: {
        validate: (value, args): boolean => isVariableWidth(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + getText('$property must contain a full-width and half-width characters'),
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
