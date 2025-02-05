# Inheriting Validation Decorators

When you define a subclass that extends from another class, the subclass will automatically inherit the parent's decorators. If a property is redefined in the descendant class, decorators will be applied from both its own class and the base class.

## Example

```typescript
import { validate } from 'class-validator';

class BaseContent {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

class User extends BaseContent {
    @MinLength(10)
    @MaxLength(20)
    name: string;

    @Contains('hello')
    welcome: string;

    @MinLength(20)
    password: string;
}

let user = new User();

user.email = 'invalid email'; // inherited property
user.password = 'too short'; // password will be validated against IsString and MinLength
user.name = 'not valid';
user.welcome = 'helo';

validate(user).then(errors => {
    // handle errors
}); // it will return errors for email, password, name and welcome properties
```

## Inheritance Rules

1. All decorators from the base class are inherited
2. Decorators can be overridden in the child class
3. Multiple decorators are combined when a property is redefined
4. Inheritance works with multiple levels of inheritance