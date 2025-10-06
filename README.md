# DyText

[![npm version](https://badge.fury.io/js/dytext.svg)](https://badge.fury.io/js/dytext)
[![npm downloads](https://img.shields.io/npm/dm/dytext.svg)](https://www.npmjs.com/package/dytext)
[![test coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/scalix-lab/dytext)
[![tests](https://img.shields.io/badge/tests-19%2F19%20passing-brightgreen.svg)](https://github.com/scalix-lab/dytext)

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
import { initDytext, getDytext } from 'dytext';

// Initialize the library (generic example)
// NOTE: For framework specific initialization (e.g., React, Vue), refer to the documentation.
await initDytext();

// Fetch all data
const allData = await getDytext('*');

// Fetch specific model
const productCatalog = await getDytext('product_catalog');

// Fetch nested data with dotted paths
const productName = await getDytext('product_catalog.fields.0.field_json.value');
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Links

- [npm package](https://www.npmjs.com/package/dytext)
- [GitHub repository](https://github.com/scalix-lab/dytext)

## License

MIT License - see LICENSE file for details.