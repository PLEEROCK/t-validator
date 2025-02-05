# Passing Context to Decorators

## Overview

It's possible to pass a custom object to decorators which will be accessible on the `ValidationError` instance of the property if validation failed.

## Example

```typescript
import { validate } from 'class-validator';

class MyClass {
    @MinLength(32, {
        message: 'EIC code must be at least 32 characters',
        context: {
            errorCode: 1003,
            developerNote: 'The validated string must contain 32 or more characters.',
        },
    })
    eicCode: string;
}

const model = new MyClass();

validate(model).then(errors => {
    // errors[0].contexts['minLength'].errorCode === 1003
});
```

## Use Cases

1. Adding error codes for API responses
2. Including developer notes in validation errors
3. Providing additional metadata for error handling
4. Customizing error messages based on context