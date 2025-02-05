# Conditional Validation

The conditional validation decorator (`@ValidateIf`) can be used to ignore the validators on a property when the provided condition function returns false.

## Basic Usage

```typescript
import { ValidateIf, IsNotEmpty } from 'class-validator';

export class Post {
    otherProperty: string;

    @ValidateIf(o => o.otherProperty === 'value')
    @IsNotEmpty()
    example: string;
}
```

In this example, the validation rules applied to `example` won't be run unless the object's `otherProperty` is `"value"`.

## Important Notes

1. When the condition is false, all validation decorators are ignored
2. The condition function takes the object being validated as a parameter
3. The condition function must return a boolean
4. Multiple `@ValidateIf` decorators can be used on the same property

## Advanced Example

```typescript
import { ValidateIf, IsNotEmpty, IsString } from 'class-validator';

export class User {
    @IsString()
    type: string;

    @ValidateIf(o => o.type === 'admin')
    @IsNotEmpty()
    adminKey: string;

    @ValidateIf(o => o.type === 'user')
    @IsNotEmpty()
    userKey: string;
}
```