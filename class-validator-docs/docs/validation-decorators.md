# Validation Decorators Reference

## Common Validation Decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsDefined(value: any)` | Checks if value is defined (!== undefined, !== null). |
| `@IsOptional()` | Ignores all validators if value is empty. |
| `@Equals(comparison: any)` | Checks if value equals comparison. |
| `@NotEquals(comparison: any)` | Checks if value not equals comparison. |
| `@IsEmpty()` | Checks if given value is empty. |
| `@IsNotEmpty()` | Checks if given value is not empty. |
| `@IsIn(values: any[])` | Checks if value is in a array of allowed values. |
| `@IsNotIn(values: any[])` | Checks if value is not in a array of disallowed values. |

## String Validation Decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsString()` | Checks if the string is a string. |
| `@Length(min: number, max?: number)` | Checks if the string's length falls in range. |
| `@MinLength(min: number)` | Checks if the string's length is not less than given number. |
| `@MaxLength(max: number)` | Checks if the string's length is not more than given number. |
| `@Matches(pattern: RegExp)` | Checks if string matches the pattern. |
| `@IsEmail()` | Checks if the string is an email. |
| `@IsURL()` | Checks if the string is an URL. |
| `@IsFQDN()` | Checks if the string is a fully qualified domain name. |

## Number Validation Decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsNumber()` | Checks if the value is a number. |
| `@IsInt()` | Checks if the value is an integer. |
| `@Min(min: number)` | Checks if the value is greater than or equal to given number. |
| `@Max(max: number)` | Checks if the value is less than or equal to given number. |
| `@IsPositive()` | Checks if the value is a positive number. |
| `@IsNegative()` | Checks if the value is a negative number. |

## Date Validation Decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsDate()` | Checks if the value is a Date. |
| `@MinDate(date: Date)` | Checks if the date is greater than given date. |
| `@MaxDate(date: Date)` | Checks if the date is less than given date. |

## Array Validation Decorators

| Decorator | Description |
| --------- | ----------- |
| `@IsArray()` | Checks if the value is an array |
| `@ArrayContains(values: any[])` | Checks if array contains all values from the given array |
| `@ArrayNotContains(values: any[])` | Checks if array does not contain any of the given values |
| `@ArrayNotEmpty()` | Checks if given array is not empty |
| `@ArrayMinSize(min: number)` | Checks if array's length is greater than or equal to specified number |
| `@ArrayMaxSize(max: number)` | Checks if array's length is less or equal to specified number |
| `@ArrayUnique()` | Checks if all array's values are unique |