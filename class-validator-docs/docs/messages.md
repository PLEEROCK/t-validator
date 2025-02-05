# Validation Messages

You can specify validation messages in the decorator options and that message will be returned in the `ValidationError` returned by the `validate` method (in the case that validation for this field fails).

## Basic Usage

```typescript
import { MinLength, MaxLength } from 'class-validator';

export class Post {
    @MinLength(10, {
        message: 'Title is too short',
    })
    @MaxLength(50, {
        message: 'Title is too long',
    })
    title: string;
}
```

## Message Variables

There are few special tokens you can use in your messages:

- `$value` - the value that is being validated
- `$property` - name of the object's property being validated
- `$target` - name of the object's class being validated
- `$constraint1`, `$constraint2`, ... `$constraintN` - constraints defined by specific validation type

Example:

```typescript
import { MinLength, MaxLength } from 'class-validator';

export class Post {
    @MinLength(10, {
        message: 'Title is too short. Minimal length is $constraint1 characters, but actual is $value',
    })
    @MaxLength(50, {
        message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
    })
    title: string;
}
```

## Dynamic Messages

You can also provide a function that returns a message:

```typescript
import { MinLength, ValidationArguments } from 'class-validator';

export class Post {
    @MinLength(10, {
        message: (args: ValidationArguments) => {
            if (args.value.length === 1) {
                return 'Too short, minimum length is 1 character';
            } else {
                return 'Too short, minimum length is ' + args.constraints[0] + ' characters';
            }
        },
    })
    title: string;
}
```