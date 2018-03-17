# Changelog and release notes

### 0.8.1

#### Features

_no new features in this release_

#### Fixes

* fixed wrong type info in `ValidatorOptions`
* fixed wrong type info in `ValidationSchema` (the `options` key now is optional)

### 0.8.0 [BREAKING CHANGE]

#### Features

* updated [validator.js][2] from 7.0.0 to 9.2.0 (Check it's [changelog][3] for what has changed.)

  This caused breaking change, if you used the `IsUrl` decorator to validate `localhost` as a valid url, from now you must use the `require_tld: false` option.
  ```ts
  @IsUrl({ require_tld: false})
  url: string;
  ```
* added `@IsInstance` decorator and `validator.isInstance(value, target)` method.
* changed `@IsNumber` decorator has been changed to `@IsNumber(options: IsNumberOptions)`
* added option to strip unknown properties (`whitelist: true`)
* added option to throw error on unknown properties (`forbidNonWhitelisted: true`)
* added `@Allow` decorator to prevent stripping properties without other constraint

#### Fixes

* fixed issue with `@IsDateString` now it allow dates without fraction seconds to be set
* fixed issue with `@IsDateString` now it allow dates without with timezones to be set
* `@ValidateNested` correctly generates validation error on non object and non array values.

### 0.6.7

#### Features

_no new features in this release_

#### Fixes

* fixed issue with `@ValidateNested` when nested property is not defined and it throw an error (#59)

### 0.6.5

#### Features

_no new features in this release_

#### Fixes

* fixed bugs with `@IsUrl`, `@IsEmail` and several other decorators

### 0.6.4

#### Features

* added `@IsMilitaryTime` decorator.

#### Fixes

_no fixes in this release._

### 0.6.3

#### Features

* added `validateOrReject` method which rejects promise instead of returning array of errors in resolved result

#### Fixes

_no fixes in this release._

### 0.6.1

#### Features

* added `@IsArray` decorator.

#### Fixes

_no fixes in this release._

### 0.6.0 [BREAKING CHANGE]

#### Features

* breaking change with `@ValidateNested` on arrays: Validator now groups the validation errors by sub-object, rather than them all being grouped together. See #32 for a demonstration of the updated structure.
* added `@ValidateIf` decorator, see conditional validation in docs.

#### Fixes

_no fixes in this release._

### 0.5.0 [BREAKING CHANGE]

#### Features

* async validations must be marked with `{ async: true }` option now.

  This is optional, but it helps to determine which decorators are async to prevent their execution in `validateSync` method.
* added `validateSync` method that performs non asynchronous validation and ignores validations that marked with `async: true`.
* there is a breaking change in `registerDecorator` method. Now it accepts options object.
* breaking change with `@ValidatorConstraint` decorator. Now it accepts option object instead of single name.

#### Fixes

_no fixes in this release._

### 0.4.1

#### Features

_no new features in this release_

#### Fixes

* fixed issue with wrong source maps packaged

### 0.4.0 [BREAKING CHANGE]

#### Features

* everything should be imported from "class-validator" main entry point now
* `ValidatorInterface` has been renamed to `ValidatorConstraintInterface`
* contain can be set in the main entry point now
* some decorator's names changed. Be aware of this
* added few more non-string decorators
* validator now returns array of ValidationError instead of ValidationErrorInterface. Removed old ValidationError
* removed all other validation methods except `validator.validate`
* finally validate method is async now, so custom async validations are supported now
* added ability to validate inherited properties
* added support of separate validation schemas
* added support of default validation messages
* added support of special tokens in validation messages
* added support of message functions in validation options
* added support of custom decorators
* if no groups were specified, decorators with groups now are being ignored
* changed signature of the `ValidationError`. Now if it has nested errors it does not return them in a flat array

#### Fixes

* fixed all decorators that should not work only with strings

### 0.3.0

#### Features

* package has changed its name from `validator.ts` to `class-validator`.
* sanitation functionality has been removed from this library. Use [class-sanitizer][1] instead.

#### Fixes

_no fixes in this release._

[1]: https://github.com/pleerock/class-sanitizer
[2]: https://github.com/chriso/validator.js
[3]: https://github.com/chriso/validator.js/blob/master/CHANGELOG.md
