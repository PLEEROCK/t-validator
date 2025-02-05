# Installation

## Requirements

- npm version 6 or higher
- Node.js

## Installing the Package

```bash
npm install class-validator --save
```

!!! note
    It's important to use at least npm@6 when using class-validator. From npm@6 the dependency tree is flattened, which is required by class-validator to function properly.

## Basic Setup

1. Import the necessary decorators:

```typescript
import { validate } from 'class-validator';
```

2. Enable decorators in your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

You're now ready to start using class-validator in your project!