# Class Validator

![Build Status](https://github.com/typestack/class-validator/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/typestack/class-validator/branch/develop/graph/badge.svg)](https://codecov.io/gh/typestack/class-validator)
[![npm version](https://badge.fury.io/js/class-validator.svg)](https://badge.fury.io/js/class-validator)
[![install size](https://packagephobia.now.sh/badge?p=class-validator)](https://packagephobia.now.sh/result?p=class-validator)

Class-validator is a powerful validation library for TypeScript and JavaScript that allows you to use decorator and non-decorator based validation. It uses [validator.js](https://github.com/chriso/validator.js) internally to perform validation and works on both browser and node.js platforms.

## Key Features

- Decorator and non-decorator based validation
- Cross-platform compatibility (browser & node.js)
- Works with TypeScript and JavaScript
- Validates objects against classes
- Validates arrays and nested objects
- Custom validation decorators
- Service container support
- Rich set of built-in validators

## Quick Example

```typescript
import { validate } from 'class-validator';
import { Length, Contains, IsInt, Min, Max, IsEmail } from 'class-validator';

export class Post {
    @Length(10, 20)
    title: string;

    @Contains('hello')
    text: string;

    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;

    @IsEmail()
    email: string;
}

let post = new Post();
post.title = 'Hello'; // too short
post.text = 'this is a great post about hell world'; // doesn't contain "hello"
post.rating = 11; // too high
post.email = 'google.com'; // not an email

validate(post).then(errors => {
    if (errors.length > 0) {
        console.log('validation failed. errors: ', errors);
    } else {
        console.log('validation succeed');
    }
});
```

## Contributing

For information about how to contribute to this project, see [TypeStack's general contribution guide](https://github.com/typestack/.github/blob/master/CONTRIBUTING.md).