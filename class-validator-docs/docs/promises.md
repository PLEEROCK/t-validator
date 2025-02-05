# Validating Promises

## Basic Promise Validation

If your object contains properties with Promise-returned values that should be validated, you need to use the `@ValidatePromise()` decorator:

```typescript
import { ValidatePromise, Min } from 'class-validator';

export class Post {
    @Min(0)
    @ValidatePromise()
    userId: Promise<number>;
}
```

## Combining with Nested Validation

It works great with `@ValidateNested` decorator:

```typescript
import { ValidateNested, ValidatePromise } from 'class-validator';

export class Post {
    @ValidateNested()
    @ValidatePromise()
    user: Promise<User>;
}
```

## Async Validation

When validating promises, the validation itself becomes asynchronous:

```typescript
import { validate } from 'class-validator';

let post = new Post();
post.userId = Promise.resolve(1);

validate(post).then(errors => {
    // handle errors
});
```