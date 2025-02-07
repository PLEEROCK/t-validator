import {
  Contains,
  Equals,
  IsDefined,
  Matches,
  Max,
  MinLength,
  IsArray,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  IsOptional,
  Min,
} from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import {
  registerDecorator,
  ValidationArguments,
  ValidationError,
  ValidationOptions,
  ValidatorConstraintInterface,
  isValidationOptions,
} from '../../src';

const validator = new Validator();

describe('message', () => {
  it('should contain a custom message', () => {
    class MyClass {
      @Contains('hello', {
        message: 'String is not valid. You string must contain a hello word',
      })
      someProperty: string;
    }

    const model = new MyClass();
    // TODO: Why is this commented out?
    // model.someProperty = "hell no world";
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ contains: 'String is not valid. You string must contain a hello word' });
    });
  });

  it('$value token should be replaced in a custom message', () => {
    class MyClass {
      @Contains('hello', {
        message: '$value is not valid. You string must contain a hello word',
      })
      someProperty: string;
    }

    const model = new MyClass();
    model.someProperty = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        contains: 'hell no world is not valid. You string must contain a hello word',
      });
    });
  });

  it('$value token should be replaced in a custom message with a string', () => {
    class MyClass {
      @MinLength(2, {
        message: args => {
          if (args.value.length < 2) {
            return '$value is too short, minimum length is $constraint1 characters $property';
          }
        },
      })
      name: string;
    }

    const model = new MyClass();
    model.name = '';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ minLength: ' is too short, minimum length is 2 characters name' });
    });
  });

  it('$value token should be replaced in a custom message with a number', () => {
    class MyClass {
      @Max(100, { message: 'Maximum value is $constraint1, but actual is $value' })
      val: number = 50;
    }

    const model = new MyClass();
    model.val = 101;
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        max: 'Maximum value is 100, but actual is 101',
      });
    });
  });

  it('$value token should be replaced in a custom message with a boolean', () => {
    class MyClass {
      @Equals(true, { message: 'Value must be $constraint1, but actual is $value' })
      val: boolean = false;
    }

    const model = new MyClass();
    model.val = false;
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        equals: 'Value must be true, but actual is false',
      });
    });
  });

  it('$constraint1 token should be replaced in a custom message', () => {
    class MyClass {
      @Contains('hello', {
        message: 'String is not valid. You string must contain a $constraint1 word',
      })
      someProperty: string;
    }

    const model = new MyClass();
    model.someProperty = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ contains: 'String is not valid. You string must contain a hello word' });
    });
  });

  it('$target token should be replaced in a custom message', () => {
    class MyClass {
      @Contains('hello', {
        message: '$target is not valid.',
      })
      someProperty: string;
    }

    const model = new MyClass();
    model.someProperty = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ contains: 'MyClass is not valid.' });
    });
  });

  it('$property token should be replaced in a custom message', () => {
    class MyClass {
      @Contains('hello', {
        message: '$property is not valid.',
      })
      someProperty: string;
    }

    const model = new MyClass();
    model.someProperty = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ contains: 'someProperty is not valid.' });
    });
  });

  it('should replace all token', () => {
    class MyClass {
      @Contains('hello', {
        message: '$target#$property is not valid: $value must contain a $constraint1 word',
      })
      someProperty: string;
    }

    const model = new MyClass();
    model.someProperty = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        contains: 'MyClass#someProperty is not valid: hell no world must contain a hello word',
      });
    });
  });
});

describe('each', () => {
  describe('Array', () => {
    it('should apply validation to each item in the array', () => {
      class MyClass {
        @Contains('hello', {
          each: true,
        })
        someProperty: string[];
      }

      const model = new MyClass();
      model.someProperty = ['hell no world', 'hello', 'helo world', 'hello world', 'hello dear friend'];
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ contains: 'each value in someProperty must contain a hello string' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class to array items (but not array itself)', () => {
      @ValidatorConstraint({ name: 'customIsNotArrayConstraint', async: false })
      class CustomIsNotArrayConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean {
          return !Array.isArray(value);
        }
      }

      class MyClass {
        @Validate(CustomIsNotArrayConstraint, {
          each: true,
        })
        someArrayOfNonArrayItems: string[];
      }

      const model = new MyClass();
      model.someArrayOfNonArrayItems = ['not array', 'also not array', 'not array at all'];
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('should apply validation via custom constraint class with synchronous logic to each item in the array', () => {
      @ValidatorConstraint({ name: 'customContainsHelloConstraint', async: false })
      class CustomContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean {
          return !Array.isArray(value) && String(value).includes('hello');
        }
      }

      class MyClass {
        @Validate(CustomContainsHelloConstraint, {
          each: true,
        })
        someProperty: string[];
      }

      const model = new MyClass();
      model.someProperty = ['hell no world', 'hello', 'helo world', 'hello world', 'hello dear friend'];
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class with async logic to each item in the array', () => {
      @ValidatorConstraint({ name: 'customAsyncContainsHelloConstraint', async: true })
      class CustomAsyncContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): Promise<boolean> {
          const isValid = !Array.isArray(value) && String(value).includes('hello');
          return Promise.resolve(isValid);
        }
      }

      class MyClass {
        @Validate(CustomAsyncContainsHelloConstraint, {
          each: true,
        })
        someProperty: string[];
      }

      const model = new MyClass();
      model.someProperty = ['hell no world', 'hello', 'helo world', 'hello world', 'hello dear friend'];
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customAsyncContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class with mixed (synchronous + async) logic to each item in the array', () => {
      @ValidatorConstraint({ name: 'customMixedContainsHelloConstraint', async: true })
      class CustomMixedContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean | Promise<boolean> {
          const isValid = !Array.isArray(value) && String(value).includes('hello');
          return isValid ? isValid : Promise.resolve(isValid);
        }
      }

      class MyClass {
        @Validate(CustomMixedContainsHelloConstraint, {
          each: true,
        })
        someProperty: string[];
      }

      const model = new MyClass();
      model.someProperty = ['hell no world', 'hello', 'helo world', 'hello world', 'hello dear friend'];
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customMixedContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });
  });

  describe('Set', () => {
    it('should apply validation to each item in the Set', () => {
      class MyClass {
        @Contains('hello', {
          each: true,
        })
        someProperty: Set<string>;
      }

      const model = new MyClass();
      model.someProperty = new Set<string>([
        'hell no world',
        'hello',
        'helo world',
        'hello world',
        'hello dear friend',
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ contains: 'each value in someProperty must contain a hello string' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class to Set items (but not Set itself)', () => {
      @ValidatorConstraint({ name: 'customIsNotSetConstraint', async: false })
      class CustomIsNotSetConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean {
          return !(value instanceof Set);
        }
      }

      class MyClass {
        @Validate(CustomIsNotSetConstraint, {
          each: true,
        })
        someSetOfNonSetItems: Set<string>;
      }

      const model = new MyClass();
      model.someSetOfNonSetItems = new Set<string>(['not array', 'also not array', 'not array at all']);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('should apply validation via custom constraint class with synchronous logic to each item in the Set', () => {
      @ValidatorConstraint({ name: 'customContainsHelloConstraint', async: false })
      class CustomContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean {
          return !(value instanceof Set) && String(value).includes('hello');
        }
      }

      class MyClass {
        @Validate(CustomContainsHelloConstraint, {
          each: true,
        })
        someProperty: Set<string>;
      }

      const model = new MyClass();
      model.someProperty = new Set<string>([
        'hell no world',
        'hello',
        'helo world',
        'hello world',
        'hello dear friend',
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class with async logic to each item in the Set', () => {
      @ValidatorConstraint({ name: 'customAsyncContainsHelloConstraint', async: true })
      class CustomAsyncContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): Promise<boolean> {
          const isValid = !(value instanceof Set) && String(value).includes('hello');
          return Promise.resolve(isValid);
        }
      }

      class MyClass {
        @Validate(CustomAsyncContainsHelloConstraint, {
          each: true,
        })
        someProperty: Set<string>;
      }

      const model = new MyClass();
      model.someProperty = new Set<string>([
        'hell no world',
        'hello',
        'helo world',
        'hello world',
        'hello dear friend',
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customAsyncContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class with mixed (synchronous + async) logic to each item in the Set', () => {
      @ValidatorConstraint({ name: 'customMixedContainsHelloConstraint', async: true })
      class CustomMixedContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean | Promise<boolean> {
          const isValid = !(value instanceof Set) && String(value).includes('hello');
          return isValid ? isValid : Promise.resolve(isValid);
        }
      }

      class MyClass {
        @Validate(CustomMixedContainsHelloConstraint, {
          each: true,
        })
        someProperty: Set<string>;
      }

      const model = new MyClass();
      model.someProperty = new Set<string>([
        'hell no world',
        'hello',
        'helo world',
        'hello world',
        'hello dear friend',
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customMixedContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });
  });

  describe('Map', () => {
    it('should apply validation to each item in the Map', () => {
      class MyClass {
        @Contains('hello', {
          each: true,
        })
        someProperty: Map<string, string>;
      }

      const model = new MyClass();
      model.someProperty = new Map<string, string>([
        ['key1', 'hell no world'],
        ['key2', 'hello'],
        ['key3', 'helo world'],
        ['key4', 'hello world'],
        ['key5', 'hello dear friend'],
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ contains: 'each value in someProperty must contain a hello string' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class to Map items (but not Map itself)', () => {
      @ValidatorConstraint({ name: 'customIsNotMapConstraint', async: false })
      class CustomIsNotMapConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean {
          return !(value instanceof Map);
        }
      }

      class MyClass {
        @Validate(CustomIsNotMapConstraint, {
          each: true,
        })
        someArrayOfNonArrayItems: Map<string, string>;
      }

      const model = new MyClass();
      model.someArrayOfNonArrayItems = new Map<string, string>([
        ['key1', 'not array'],
        ['key2', 'also not array'],
        ['key3', 'not array at all'],
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('should apply validation via custom constraint class with synchronous logic to each item in the Map', () => {
      @ValidatorConstraint({ name: 'customContainsHelloConstraint', async: false })
      class CustomContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean {
          return !(value instanceof Map) && String(value).includes('hello');
        }
      }

      class MyClass {
        @Validate(CustomContainsHelloConstraint, {
          each: true,
        })
        someProperty: Map<string, string>;
      }

      const model = new MyClass();
      model.someProperty = new Map<string, string>([
        ['key1', 'hell no world'],
        ['key2', 'hello'],
        ['key3', 'helo world'],
        ['key4', 'hello world'],
        ['key5', 'hello dear friend'],
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class with async logic to each item in the Map', () => {
      @ValidatorConstraint({ name: 'customAsyncContainsHelloConstraint', async: true })
      class CustomAsyncContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): Promise<boolean> {
          const isValid = !(value instanceof Map) && String(value).includes('hello');
          return Promise.resolve(isValid);
        }
      }

      class MyClass {
        @Validate(CustomAsyncContainsHelloConstraint, {
          each: true,
        })
        someProperty: Map<string, string>;
      }

      const model = new MyClass();
      model.someProperty = new Map<string, string>([
        ['key1', 'hell no world'],
        ['key2', 'hello'],
        ['key3', 'helo world'],
        ['key4', 'hello world'],
        ['key5', 'hello dear friend'],
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customAsyncContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });

    it('should apply validation via custom constraint class with mixed (synchronous + async) logic to each item in the Map', () => {
      @ValidatorConstraint({ name: 'customMixedContainsHelloConstraint', async: true })
      class CustomMixedContainsHelloConstraint implements ValidatorConstraintInterface {
        validate(value: any): boolean | Promise<boolean> {
          const isValid = !(value instanceof Map) && String(value).includes('hello');
          return isValid ? isValid : Promise.resolve(isValid);
        }
      }

      class MyClass {
        @Validate(CustomMixedContainsHelloConstraint, {
          each: true,
        })
        someProperty: Map<string, string>;
      }

      const model = new MyClass();
      model.someProperty = new Map<string, string>([
        ['key1', 'hell no world'],
        ['key2', 'hello'],
        ['key3', 'helo world'],
        ['key4', 'hello world'],
        ['key5', 'hello dear friend'],
      ]);
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({ customMixedContainsHelloConstraint: '' });
        expect(errors[0].value).toEqual(model.someProperty);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('someProperty');
      });
    });
  });
});

describe('groups', () => {
  function expectTitleContains(error: ValidationError): void {
    expect(error.constraints).toEqual({ contains: 'title must contain a hello string' });
  }

  function expectTextContains(error: ValidationError): void {
    expect(error.constraints).toEqual({ contains: 'text must contain a bye string' });
  }

  class MyClass {
    @Contains('hello', {
      groups: ['title-validation'],
    })
    title: string;

    @Contains('bye', {
      groups: ['text-validation'],
    })
    text: string;
  }

  const validTitle = new MyClass();
  validTitle.title = 'hello world';
  validTitle.text = 'hello world';

  const validText = new MyClass();
  validText.title = 'bye world';
  validText.text = 'bye world';

  const validBoth = new MyClass();
  validBoth.title = 'hello world';
  validBoth.text = 'bye world';

  const validNone = new MyClass();
  validNone.title = 'bye world';
  validNone.text = 'hello world';

  describe('should validate only properties of the given group: title-validation', () => {
    it('with valid title', () => {
      return validator.validate(validTitle, { groups: ['title-validation'] }).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with valid text', () => {
      return validator.validate(validText, { groups: ['title-validation'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTitleContains(errors[0]);
      });
    });

    it('with both valid', () => {
      return validator.validate(validBoth, { groups: ['title-validation'] }).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with none valid', () => {
      return validator.validate(validNone, { groups: ['title-validation'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTitleContains(errors[0]);
      });
    });
  });

  describe('should validate only properties of the given group: text-validation', () => {
    it('with valid title', () => {
      return validator.validate(validTitle, { groups: ['text-validation'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTextContains(errors[0]);
      });
    });

    it('with valid text', () => {
      return validator.validate(validText, { groups: ['text-validation'] }).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with both valid', () => {
      return validator.validate(validBoth, { groups: ['text-validation'] }).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with none valid', () => {
      return validator.validate(validNone, { groups: ['text-validation'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTextContains(errors[0]);
      });
    });
  });

  describe('should validate only properties of the given groups: both groups', () => {
    it('with valid title', () => {
      return validator.validate(validTitle, { groups: ['title-validation', 'text-validation'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTextContains(errors[0]);
      });
    });

    it('with valid text', () => {
      return validator.validate(validText, { groups: ['title-validation', 'text-validation'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTitleContains(errors[0]);
      });
    });

    it('with both valid', () => {
      return validator.validate(validBoth, { groups: ['title-validation', 'text-validation'] }).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with none valid', () => {
      return validator.validate(validNone, { groups: ['title-validation', 'text-validation'] }).then(errors => {
        expect(errors.length).toEqual(2);
        expectTitleContains(errors[0]);
        expectTextContains(errors[1]);
      });
    });
  });

  describe('should validate all if no group is given', () => {
    it('with valid title', () => {
      // todo: all or without? what is better expected behaviour?
      return validator.validate(validTitle).then(errors => {
        expect(errors.length).toEqual(1);
        expectTextContains(errors[0]);
      });
    });

    it('with valid text', () => {
      // todo: all or without? what is better expected behaviour?
      return validator.validate(validText).then(errors => {
        expect(errors.length).toEqual(1);
        expectTitleContains(errors[0]);
      });
    });

    it('with both valid', () => {
      // todo: all or without? what is better expected behaviour?
      return validator.validate(validBoth).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with none valid', () => {
      // todo: all or without? what is better expected behaviour?
      return validator.validate(validNone).then(errors => {
        expect(errors.length).toEqual(2);
        expectTitleContains(errors[0]);
        expectTextContains(errors[1]);
      });
    });
  });

  describe('should validate all groups if empty group array is given', () => {
    it('with valid title', () => {
      return validator.validate(validTitle, { groups: [] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTextContains(errors[0]);
      });
    });

    it('with valid text', () => {
      return validator.validate(validText, { groups: [] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTitleContains(errors[0]);
      });
    });

    it('with both valid', () => {
      return validator.validate(validBoth, { groups: [] }).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it('with none valid', () => {
      return validator.validate(validNone, { groups: [] }).then(errors => {
        expect(errors.length).toEqual(2);
        expectTitleContains(errors[0]);
        expectTextContains(errors[1]);
      });
    });
  });

  describe('multiple groups per property', () => {
    class MyClass {
      @Contains('hello', { groups: ['contains'] })
      @Matches(/.*stranger.*/, { groups: ['matches'] })
      title: string;
    }

    function expectTitleMatches(error: ValidationError): void {
      expect(error.constraints).toEqual({ matches: 'title must match /.*stranger.*/ regular expression' });
    }

    const validContains = new MyClass();
    validContains.title = 'hello';

    const validMatches = new MyClass();
    validMatches.title = 'stranger';

    const validBoth = new MyClass();
    validBoth.title = 'hello stranger';

    const validNone = new MyClass();
    validNone.title = 'howdy rowdy';

    describe('group: contains', () => {
      it('with valid contains', () => {
        return validator.validate(validContains, { groups: ['contains'] }).then(errors => {
          expect(errors.length).toEqual(0);
        });
      });

      it('with valid matches', () => {
        return validator.validate(validMatches, { groups: ['contains'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expectTitleContains(errors[0]);
        });
      });

      it('with valid both', () => {
        return validator.validate(validBoth, { groups: ['contains'] }).then(errors => {
          expect(errors.length).toEqual(0);
        });
      });

      it('with valid none', () => {
        return validator.validate(validNone, { groups: ['contains'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expectTitleContains(errors[0]);
        });
      });
    });

    describe('group: matches', () => {
      it('with valid contains', () => {
        return validator.validate(validContains, { groups: ['matches'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expectTitleMatches(errors[0]);
        });
      });

      it('with valid matches', () => {
        return validator.validate(validMatches, { groups: ['matches'] }).then(errors => {
          expect(errors.length).toEqual(0);
        });
      });

      it('with valid both', () => {
        return validator.validate(validBoth, { groups: ['matches'] }).then(errors => {
          expect(errors.length).toEqual(0);
        });
      });

      it('with valid none', () => {
        return validator.validate(validNone, { groups: ['matches'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expectTitleMatches(errors[0]);
        });
      });
    });

    describe('groups: contains & matches', () => {
      it('with valid contains', () => {
        return validator.validate(validContains, { groups: ['contains', 'matches'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expectTitleMatches(errors[0]);
        });
      });

      it('with valid matches', () => {
        return validator.validate(validMatches, { groups: ['contains', 'matches'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expectTitleContains(errors[0]);
        });
      });

      it('with valid both', () => {
        return validator.validate(validBoth, { groups: ['contains', 'matches'] }).then(errors => {
          expect(errors.length).toEqual(0);
        });
      });

      it('with valid none', () => {
        return validator.validate(validNone, { groups: ['contains', 'matches'] }).then(errors => {
          expect(errors.length).toEqual(1);
          expect(errors[0].constraints).toEqual({
            contains: 'title must contain a hello string',
            matches: 'title must match /.*stranger.*/ regular expression',
          });
        });
      });
    });
  });

  describe('ValidationOptions.always', function () {
    class MyClass {
      @Contains('noOptions')
      noOptions: string;

      @Contains('groupA', {
        groups: ['A'],
      })
      groupA: string;

      @Contains('alwaysFalse', {
        always: false,
      })
      alwaysFalse: string;

      @Contains('alwaysTrue', {
        always: true,
      })
      alwaysTrue: string;
    }

    const model1 = new MyClass();
    model1.noOptions = 'XXX';
    model1.groupA = 'groupA';
    model1.alwaysFalse = 'alwaysFalse';
    model1.alwaysTrue = 'alwaysTrue';

    const model2 = new MyClass();
    model2.noOptions = 'noOptions';
    model2.groupA = 'XXX';
    model2.alwaysFalse = 'alwaysFalse';
    model2.alwaysTrue = 'alwaysTrue';

    const model3 = new MyClass();
    model3.noOptions = 'noOptions';
    model3.groupA = 'groupA';
    model3.alwaysFalse = 'XXX';
    model3.alwaysTrue = 'alwaysTrue';

    const model4 = new MyClass();
    model4.noOptions = 'noOptions';
    model4.groupA = 'groupA';
    model4.alwaysFalse = 'alwaysFalse';
    model4.alwaysTrue = 'XXX';

    it('should validate decorator without options', function () {
      return validator.validate(model1, { always: true, groups: ['A'] }).then(errors => {
        expect(errors).toHaveLength(1);
      });
    });

    it('should not validate decorator with groups if validating without matching groups', function () {
      return validator.validate(model2, { always: true, groups: ['B'] }).then(errors => {
        expect(errors).toHaveLength(0);
      });
    });

    it('should not validate decorator with always set to false', function () {
      return validator.validate(model3, { always: true, groups: ['A'] }).then(errors => {
        expect(errors).toHaveLength(0);
      });
    });

    it('should validate decorator with always set to true', function () {
      return validator.validate(model4, { always: true, groups: ['A'] }).then(errors => {
        expect(errors).toHaveLength(1);
      });
    });
  });

  describe('strictGroups', function () {
    class MyPayload {
      /**
       * Since forbidUnknownValues defaults to true, we must add a property to
       * register the class in the metadata storage. Otherwise the unknown value check
       * would take priority (first check) and exit without running the grouping logic.
       *
       * To solve this we register this property with always: true, so at least a single
       * metadata is returned for each validation preventing the unknown value was passed error.
       */
      @IsOptional({ always: true })
      propertyToRegisterClass: string;

      @Contains('hello', { groups: ['A'] })
      title: string;
    }

    const instance = new MyPayload();

    it('should ignore decorators with groups if validating without groups', function () {
      return validator.validate(instance, { strictGroups: true }).then(errors => {
        expect(errors).toHaveLength(0);
      });
    });

    it('should ignore decorators with groups if validating with empty groups array', function () {
      return validator.validate(instance, { strictGroups: true, groups: [] }).then(errors => {
        expect(errors).toHaveLength(0);
      });
    });

    it('should include decorators with groups if validating with matching groups', function () {
      return validator.validate(instance, { strictGroups: true, groups: ['A'] }).then(errors => {
        expect(errors).toHaveLength(1);
        expectTitleContains(errors[0]);
      });
    });

    it('should not include decorators with groups if validating with different groups', function () {
      return validator.validate(instance, { strictGroups: true, groups: ['B'] }).then(errors => {
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('always', () => {
    class MyClass {
      @Contains('hello', {
        groups: ['sometimes'],
      })
      title: string;

      @Contains('bye', {
        groups: ['always'],
        always: true,
      })
      text: string;
    }

    const model = new MyClass();

    it('should always validate a marked field even if another group is specified', () => {
      return validator.validate(model, { groups: ['sometimes'] }).then(errors => {
        expect(errors.length).toEqual(2);
        expectTitleContains(errors[0]);
        expectTextContains(errors[1]);
      });
    });

    it('should always validate a marked field if its group is specified also (doubly enabled)', () => {
      return validator.validate(model, { groups: ['always'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectTextContains(errors[0]);
      });
    });

    it('should always validate *all* fields if group is not specified', () => {
      return validator.validate(model, { groups: undefined }).then(errors => {
        expect(errors.length).toEqual(2);
        expectTitleContains(errors[0]);
        expectTextContains(errors[1]);
      });
    });

    it('should always validate *all* fields if groups array is empty', () => {
      return validator.validate(model, { groups: [] }).then(errors => {
        expect(errors.length).toEqual(2);
        expectTitleContains(errors[0]);
        expectTextContains(errors[1]);
      });
    });
  });

  describe('groups - nested', () => {
    class Nested {
      @Contains('hello', {
        groups: ['always'],
        always: true,
      })
      text: string;
    }

    class Root {
      @ValidateNested({ groups: ['always'], always: true })
      always = new Nested();

      @ValidateNested({ groups: ['sometimes'] })
      sometimes = new Nested();

      @ValidateNested({ groups: ['other'] })
      other = new Nested();
    }

    const model = new Root();

    function expectChildConstraint(error: ValidationError, childName: string): void {
      expect(error.property).toEqual(childName);
      expect(error.children.length).toEqual(1);
      expect(error.children[0].property).toEqual('text');
      expect(error.children[0].constraints).toEqual({ contains: 'text must contain a hello string' });
    }

    it('should validate all children if no group is given', () => {
      return validator.validate(model, { groups: undefined }).then(errors => {
        expect(errors.length).toEqual(3);
        expectChildConstraint(errors[0], 'always');
        expectChildConstraint(errors[1], 'sometimes');
        expectChildConstraint(errors[2], 'other');
      });
    });

    it('should validate only the given group + always', () => {
      return validator.validate(model, { groups: ['sometimes'] }).then(errors => {
        expect(errors.length).toEqual(2);
        expectChildConstraint(errors[0], 'always');
        expectChildConstraint(errors[1], 'sometimes');
      });
    });

    it('should validate only the given group + always', () => {
      return validator.validate(model, { groups: ['always'] }).then(errors => {
        expect(errors.length).toEqual(1);
        expectChildConstraint(errors[0], 'always');
      });
    });
  });
});

describe('context', () => {
  it('should map context', () => {
    function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
      return function (object: object, propertyName: string): void {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [property],
          name: 'isLongerThan',
          validator: {
            validate(value: any, args: ValidationArguments): boolean {
              const [relatedPropertyName] = args.constraints;
              const relatedValue = (args.object as any)[relatedPropertyName];
              if (relatedValue === undefined || relatedValue === null) return true;

              return (
                typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length
              );
            },
          },
        });
      };
    }

    class MyClass {
      @Contains('hello', {
        message: 'String is not valid. You string must contain a hello word',
        context: {
          hi: 'there',
        },
      })
      someProperty: string;

      @Contains('bye', {
        message: 'String is not valid. You string must contain a bye word',
        context: {
          bye: 'now',
        },
      })
      someOtherProperty: string;

      @IsDefined({
        context: {
          foo: 'bar',
        },
      })
      requiredProperty: string;

      @IsLongerThan('lastName', {
        context: { baz: 'qux' },
        message: '$property must be longer then $constraint1. Given value: $value',
      })
      firstName: string;

      lastName: string;
    }

    const model = new MyClass();
    model.firstName = 'Short';
    model.lastName = 'LongerThanFirstName';

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(4);
      expect(errors[0].contexts['contains']).toEqual({ hi: 'there' });
      expect(errors[1].contexts['contains']).toEqual({ bye: 'now' });
      expect(errors[2].contexts['isDefined']).toEqual({ foo: 'bar' });
      expect(errors[3].contexts['isLongerThan']).toEqual({ baz: 'qux' });
    });
  });

  it('should map multiple context on a single property for different constraints', () => {
    class MyClass {
      @Contains('hello', {
        message: 'String is not valid. You string must contain a hello word',
        context: {
          hi: 'there',
        },
      })
      @MinLength(20, {
        context: {
          whats: 'up',
        },
      })
      someProperty: string;
    }

    const model = new MyClass();
    model.someProperty = 'bippity';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].contexts['contains']).toEqual({ hi: 'there' });
      expect(errors[0].contexts['minLength']).toEqual({ whats: 'up' });
    });
  });

  it('should not map no context', () => {
    class MyClass {
      @Contains('hello', {
        message: 'String is not valid. You string must contain a hello word',
      })
      someProperty: string;

      @Contains('bye', {
        message: 'String is not valid. You string must contain a bye word',
        context: {
          bye: 'now',
        },
      })
      someOtherProperty: string;
    }

    const model = new MyClass();
    // model.someProperty = "hell no world";
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(2);
      expect(errors[0].contexts).toBeUndefined();
      expect(errors[1].contexts['contains']).toEqual({ bye: 'now' });
    });
  });

  it('should stop at first error.', () => {
    class MySubClass {
      @IsDefined({
        message: 'isDefined',
      })
      name: string;
    }

    class MyClass {
      @IsDefined({
        message: 'isDefined',
      })
      @Contains('hello', {
        message: 'String is not valid. You string must contain a hello word',
      })
      sameProperty: string;

      @ValidateNested()
      @IsArray()
      nestedWithPrimitiveValue: MySubClass[];
    }

    const model = new MyClass();
    model.nestedWithPrimitiveValue = 'invalid' as any;

    const hasStopAtFirstError = validator.validate(model, { stopAtFirstError: true }).then(errors => {
      expect(errors.length).toEqual(2);
      expect(Object.keys(errors[0].constraints).length).toBe(1);
      expect(errors[0].constraints['isDefined']).toBe('isDefined');
      expect(Object.keys(errors[1].constraints).length).toBe(1);
      expect(errors[1].constraints).toHaveProperty('isArray');
    });
    const hasNotStopAtFirstError = validator.validate(model, { stopAtFirstError: false }).then(errors => {
      expect(errors.length).toEqual(2);
      expect(Object.keys(errors[0].constraints).length).toBe(2);
      expect(errors[0].constraints).toHaveProperty('contains');
      expect(errors[0].constraints).toHaveProperty('isDefined');
      expect(Object.keys(errors[1].constraints).length).toBe(2);
      expect(errors[1].constraints).toHaveProperty('isArray');
      expect(errors[1].constraints).toHaveProperty('nestedValidation');
    });

    return Promise.all([hasStopAtFirstError, hasNotStopAtFirstError]);
  });
});

describe('validateIf', () => {
  class MyClass {
    @Min(5, {
      message: 'min',
      validateIf: (obj: MyClass, value) => {
        return !obj.someOtherProperty || obj.someOtherProperty === 'min';
      },
    })
    @Max(3, {
      message: 'max',
      validateIf: (o: MyClass) => !o.someOtherProperty || o.someOtherProperty === 'max',
    })
    someProperty: number;

    someOtherProperty: string;
  }

  describe('should validate if validateIf return true.', () => {
    it('should be true', () => {
      const result = isValidationOptions({
        validateIf: (obj: MyClass, value) => {
          return obj.someOtherProperty;
        }
      });
      expect(result).toEqual(true);
    });

    it('should only validate min', () => {
      const model = new MyClass();
      model.someProperty = 4;
      model.someOtherProperty = 'min';
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints['min']).toBe('min');
        expect(errors[0].constraints['max']).toBe(undefined);
      });
    });
    it('should only validate max', () => {
      const model = new MyClass();
      model.someProperty = 4;
      model.someOtherProperty = 'max';
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints['min']).toBe(undefined);
        expect(errors[0].constraints['max']).toBe('max');
      });
    });
    it('should validate both', () => {
      const model = new MyClass();
      model.someProperty = 4;
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints['min']).toBe('min');
        expect(errors[0].constraints['max']).toBe('max');
      });
    });
    it('should validate none', () => {
      const model = new MyClass();
      model.someProperty = 4;
      model.someOtherProperty = 'other';
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });
  });
});
