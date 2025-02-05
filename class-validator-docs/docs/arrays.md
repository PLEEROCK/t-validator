# Validating Arrays

## Basic Array Validation

If your field is an array and you want to perform validation of each item in the array, you must specify a special `each: true` decorator option:

```typescript
import { MaxLength } from 'class-validator';

export class Post {
    @MaxLength(20, {
        each: true,
    })
    tags: string[];
}
```

## Array-specific Decorators

There are also several decorators specifically for array validation:

| Decorator | Description |
| --------- | ----------- |
| `@ArrayContains(values: any[])` | Checks if array contains all values from the given array of values. |
| `@ArrayNotContains(values: any[])` | Checks if array does not contain any of the given values. |
| `@ArrayNotEmpty()` | Checks if given array is not empty. |
| `@ArrayMinSize(min: number)` | Checks if array's length is greater than or equal to the specified number. |
| `@ArrayMaxSize(max: number)` | Checks if array's length is less or equal to the specified number. |
| `@ArrayUnique()` | Checks if all array's values are unique. |

Example:

```typescript
import { ArrayMinSize, ArrayMaxSize, ArrayUnique } from 'class-validator';

export class Post {
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ArrayUnique()
    tags: string[];
}
```