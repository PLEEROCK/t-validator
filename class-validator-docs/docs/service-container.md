# Using Service Container

## Overview

Validator supports service container integration when you want to inject dependencies into your custom validator constraint classes.

## Integration with TypeDI

```typescript
import { Container } from 'typedi';
import { useContainer, Validator } from 'class-validator';

// do this somewhere in the global application level:
useContainer(Container);
let validator = Container.get(Validator);

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraint-s
```

## Example with Dependencies

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserRepository } from './UserRepository';

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(protected userRepository: UserRepository) {}

    validate(userName: string) {
        return this.userRepository.findOneByName(userName).then(user => {
            if (user) return false;
            return true;
        });
    }
}
```