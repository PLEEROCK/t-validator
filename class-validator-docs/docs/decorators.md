# Validation Decorators

## Common validation decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsDefined(value: any)` | Checks if value is defined (!== undefined, !== null). This is the only decorator that ignores skipMissingProperties option. |
| `@IsOptional()` | Checks if given value is empty (=== null, === undefined) and if so, ignores all the validators on the property. |
| `@Equals(comparison: any)` | Checks if value equals ("===") comparison. |
| `@NotEquals(comparison: any)` | Checks if value not equal ("!==") comparison. |
| `@IsEmpty()` | Checks if given value is empty (=== '', === null, === undefined). |
| `@IsNotEmpty()` | Checks if given value is not empty (!== '', !== null, !== undefined). |
| `@IsIn(values: any[])` | Checks if value is in an array of allowed values. |
| `@IsNotIn(values: any[])` | Checks if value is not in an array of disallowed values. |

## Type validation decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsBoolean()` | Checks if a value is a boolean. |
| `@IsDate()` | Checks if the value is a date. |
| `@IsString()` | Checks if the value is a string. |
| `@IsNumber(options: IsNumberOptions)` | Checks if the value is a number. |
| `@IsInt()` | Checks if the value is an integer number. |
| `@IsArray()` | Checks if the value is an array |
| `@IsEnum(entity: object)` | Checks if the value is a valid enum |

See the [full list of validation decorators](validation-decorators.md) for more details.