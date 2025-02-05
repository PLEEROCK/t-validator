# Validation Groups

## Overview

In different situations you may want to use different validation schemas for the same object. In such cases you can use validation groups.

## Basic Usage

```typescript
import { validate, Min, Length } from 'class-validator';

export class User {
    @Min(12, {
        groups: ['registration']
    })
    age: number;

    @Length(2, 20, {
        groups: ['registration', 'admin']
    })
    name: string;
}

let user = new User();
user.age = 10;
user.name = 'Alex';

validate(user, { 
    groups: ['registration'] 
}); // this will not pass validation

validate(user, { 
    groups: ['admin'] 
}); // this will pass validation

validate(user, { 
    groups: ['registration', 'admin'] 
}); // this will not pass validation

validate(user, { 
    groups: undefined // the default
}); // this will not pass validation
```

## Important Notes

1. The `always: true` flag in validation options means the validation must be applied regardless of groups
2. Multiple groups can be specified for a single decorator
3. If no groups are specified, the default group is used
4. Groups can be used to create different validation scenarios for the same object