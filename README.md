# DyText

[![npm version](https://badge.fury.io/js/dytext.svg)](https://badge.fury.io/js/dytext)
[![npm downloads](https://img.shields.io/npm/dm/dytext.svg)](https://www.npmjs.com/package/dytext)

A lightweight TypeScript library for content management in static websites with dotted path access and caching.

## Features

- 🔑 **Client Token Authentication** - Secure API access with client tokens
- 🎯 **Dotted Path Access** - Access nested data using simple dot notation (`user.profile.name`)
- ⚡ **Built-in Caching** - Configurable caching layer for improved performance
- 📦 **TypeScript Support** - Full TypeScript support with type definitions
- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 🔧 **Framework Agnostic** - Use with any JavaScript framework or vanilla JS

## Installation

```bash
npm install dytext
```

## Quick Start

```typescript
import { createClient } from 'dytext';

// Initialize the client
const client = createClient({
  clientToken: 'your-client-token'
});

// Or use environment variable DYTEXT_TOKEN
const client = createClient();

// Get data using dotted path notation
const data = await client.get('user.profile.name');
console.log(data); // Hello from DyText! You requested: "user.profile.name"
```

### Utility Functions

```typescript
import { getByPath } from 'dytext';

const data = {
  user: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
};

const name = getByPath(data, 'user.profile.name');
console.log(name); // 'John Doe'
```

## API Reference

### `createClient(config?: DyTextConfig)`

Creates a new DyText client instance.

**Parameters:**
- `config.clientToken` (optional): Your client authentication token. If not provided, will use `DYTEXT_TOKEN` environment variable.

**Returns:** `DyTextClient`

### `client.get(path: string)`

Retrieves data using dotted path notation.

**Parameters:**
- `path`: Dotted path string (e.g., 'user.profile.name')

**Returns:** `Promise<any>`

### `getByPath(obj: any, path: string)`

Utility function to extract values from objects using dotted paths.

**Parameters:**
- `obj`: Source object
- `path`: Dotted path string

**Returns:** `any`

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch for changes during development
npm run dev
```

## Links

- [npm package](https://www.npmjs.com/package/dytext)
- [GitHub repository](https://github.com/scalix-lab/dytext)

## License

MIT License - see LICENSE file for details.