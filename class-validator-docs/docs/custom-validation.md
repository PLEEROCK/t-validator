# Custom Validation

## Custom Validation Classes

### Creating a Custom Validator

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextLength implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.length > 1 && text.length < 10; 
    }

    defaultMessage(args: ValidationArguments) {
        return 'Text ($value) is too short or too long!';
    }
}
```

### Using Custom Validator

```typescript
import { Validate } from 'class-validator';
import { CustomTextLength } from './CustomTextLength';

export class Post {
    @Validate(CustomTextLength, {
        message: 'Title is too short or long!'
    })
    title: string;
}
```

## Custom Validation Decorators

### Creating a Custom Decorator

```typescript
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isLongerThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return typeof value === 'string' && 
                           typeof relatedValue === 'string' && 
                           value.length > relatedValue.length;
                }
            }
        });
    };
}
```

### Using Custom Decorator

```typescript
import { IsLongerThan } from './IsLongerThan';

export class Post {
    title: string;

    @IsLongerThan('title', {
        message: 'Text must be longer than the title'
    })
    text: string;
}
```