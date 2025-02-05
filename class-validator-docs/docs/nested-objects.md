# Validating Nested Objects

## Basic Nested Validation

If your object contains nested objects and you want the validator to perform their validation too, then you need to use the `@ValidateNested()` decorator:

```typescript
import { ValidateNested } from 'class-validator';

export class Post {
    @ValidateNested()
    user: User;
}
```

## Array of Nested Objects

It also works with arrays of nested objects:

```typescript
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Post {
    @ValidateNested({ each: true })
    @Type(() => User)
    users: User[];
}
```

## Deep Nested Objects

You can validate deeply nested objects:

```typescript
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Profile {
    @IsString()
    name: string;
}

export class User {
    @ValidateNested()
    @Type(() => Profile)
    profile: Profile;
}

export class Post {
    @ValidateNested()
    @Type(() => User)
    user: User;
}
```

Note: The nested object must be an instance of a class, otherwise `@ValidateNested` won't know what to validate against.