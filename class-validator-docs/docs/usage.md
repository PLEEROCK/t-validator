# Basic Usage

## Creating a Validated Class

To start using class-validator, first create a class with validation decorators:

```typescript
import { Length, IsEmail, Min } from 'class-validator';

export class User {
    @Length(4, 20)
    username: string;

    @IsEmail()
    email: string;

    @Min(18)
    age: number;
}
```

## Validating an Object

Once you have a class with validation decorators, you can validate instances of this class:

```typescript
import { validate } from 'class-validator';

let user = new User();
user.username = "Sh"; // too short
user.email = "invalid-email"; // not an email
user.age = 16; // under 18

validate(user).then(errors => {
    if (errors.length > 0) {
        console.log('Validation failed:', errors);
    } else {
        console.log('Validation successful');
    }
});
```

## Validation Options

You can pass options to the validate function:

```typescript
validate(user, {
    skipMissingProperties: true, // skip validation of missing properties
    whitelist: true, // strip non-decorated properties
    forbidNonWhitelisted: true // throw error if non-whitelisted properties exist
});
```

## Synchronous Validation

If you don't need async validation, you can use `validateSync`:

```typescript
import { validateSync } from 'class-validator';

const errors = validateSync(user);
if (errors.length > 0) {
    console.log('Validation failed:', errors);
} else {
    console.log('Validation successful');
}
```