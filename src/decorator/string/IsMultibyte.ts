import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isMultibyteValidator from 'validator/lib/isMultibyte';
import { getText } from '../get-text';

export const IS_MULTIBYTE = 'isMultibyte';

/**
 * Checks if the string contains one or more multibyte chars.
 * If given value is not a string, then it returns false.
 */
export function isMultibyte(value: unknown): boolean {
  return typeof value === 'string' && isMultibyteValidator(value);
}

/**
 * Checks if the string contains one or more multibyte chars.
 * If given value is not a string, then it returns false.
 */
export function IsMultibyte(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_MULTIBYTE,
      validator: {
        validate: (value, args): boolean => isMultibyte(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + getText('$property must contain one or more multibyte chars'),
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
