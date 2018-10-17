import {buildMessage, ValidateBy} from "./ValidateBy";
import {ValidationOptions} from "./ValidationOptions";

/**
 * Checks if a given value is a real string.
 */
export function isString(value: any): boolean {
    return value instanceof String || typeof value === "string";
}

/**
 * Checks if a value is a string.
 */
export function IsString(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isString",
            validate: (value) => isString(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a string", validationOptions)
        },
        validationOptions
    );
}
