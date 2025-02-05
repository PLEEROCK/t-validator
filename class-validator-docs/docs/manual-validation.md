# Manual Validation

## Overview

There are several methods in the Validator that allow performing non-decorator based validation.

## Basic Usage

```typescript
import { isEmpty, isBoolean } from 'class-validator';

isEmpty(value);
isBoolean(value);
```

## Available Validation Functions

All validation decorators have corresponding functions that can be used manually:

```typescript
import { 
    isEmail,
    isLength,
    isInt,
    min,
    max 
} from 'class-validator';

// String validation
isEmail('example@email.com'); // true
isLength('text', 2, 10); // true

// Number validation
isInt(123); // true
min(5, 3); // true
max(5, 10); // true
```

## Synchronous vs Asynchronous

Most validation functions are synchronous, but some (like those involving database queries) are asynchronous:

```typescript
import { validate, validateOrReject } from 'class-validator';

// Synchronous
const errors = validateSync(object);
if (errors.length > 0) {
    console.log('Validation failed:', errors);
}

// Asynchronous
validate(object).then(errors => {
    if (errors.length > 0) {
        console.log('Validation failed:', errors);
    }
});

// Using validateOrReject
validateOrReject(object).catch(errors => {
    console.log('Validation failed:', errors);
});
```