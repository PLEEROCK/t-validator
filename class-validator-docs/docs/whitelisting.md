# Whitelisting

## Overview

Even if your object is an instance of a validation class, it can contain additional properties that are not defined. If you don't want to have such properties on your object, you can use whitelisting.

## Basic Usage

```typescript
import { validate } from 'class-validator';

// ... class definition

validate(post, { whitelist: true });
```

This will strip all properties that don't have any decorators. If no other decorator is suitable for your property, you can use `@Allow` decorator:

```typescript
import { validate, Allow, Min } from 'class-validator';

export class Post {
    @Allow()
    title: string;

    @Min(0)
    views: number;

    nonWhitelistedProperty: number;
}

let post = new Post();
post.title = 'Hello world!';
post.views = 420;

post.nonWhitelistedProperty = 69;
(post as any).anotherNonWhitelistedProperty = "something";

validate(post, { whitelist: true }).then(errors => {
    // post.nonWhitelistedProperty is not defined
    // (post as any).anotherNonWhitelistedProperty is not defined
});
```

## Forbidding Non-whitelisted Properties

If you would rather have an error thrown when any non-whitelisted properties are present:

```typescript
import { validate } from 'class-validator';

validate(post, { 
    whitelist: true, 
    forbidNonWhitelisted: true 
});
```