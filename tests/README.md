# DyText Test Suite

This directory contains the comprehensive test suite for the DyText library.

## Structure

```
tests/
├── unit/                           # Unit tests for core library functionality
│   ├── initialization.test.ts      # Library initialization and setup
│   ├── environment-variables.test.ts # Environment variable initialization
│   ├── token-validation.test.ts    # Token format validation and parsing
│   ├── data-fetching.test.ts       # Data fetching with various paths
│   ├── caching.test.ts             # Caching behavior and performance
│   ├── state-management.test.ts    # State reset and re-initialization
│   ├── error-handling.test.ts      # Error scenarios and edge cases
│   ├── concurrent-operations.test.ts # Concurrent calls and race conditions
│   └── index.test.ts               # Main entry point for all unit tests
└── README.md                       # This file
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run specific test file

```bash
npm test initialization
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Test Categories

### 1. Initialization Tests (4 tests)

Tests for library initialization, configuration, and setup.

- Basic initialization
- Initialization with options
- Multiple initialization prevention
- Pre-initialization error handling

### 2. Environment Variable Tests (3 tests)

Tests for environment variable-based initialization.

- Initialize from `DYTEXT_CLIENT_TOKEN`
- Token priority (explicit vs environment)
- Missing token error handling

### 3. Token Validation Tests (4 tests)

Tests for token format validation and parsing.

- Invalid token formats
- Missing components
- Correct token parsing

### 4. Data Fetching Tests (7 tests)

Tests for data retrieval with various path patterns.

- Wildcard fetching (`*`)
- Specific model fetching
- Dotted path navigation
- Non-existent path handling

### 5. Caching Tests (2 tests)

Tests for caching behavior and performance.

- Module-level caching
- Wildcard result caching

### 6. State Management Tests (3 tests)

Tests for state reset and re-initialization.

- State reset
- Re-initialization after reset
- Cache clearing on reset

### 7. Error Handling Tests (3 tests)

Tests for error scenarios and edge cases.

- API error handling
- Empty path handling
- Undefined path handling

### 8. Concurrent Operations Tests (2 tests)

Tests for concurrent calls and race conditions.

- Concurrent data fetching
- Concurrent initialization

## Total Coverage

- **Unit Tests**: 28 tests
- **E2E Tests** (in `/e2e/test-apps/next`): 58 tests
- **Total**: 86 tests

## Writing New Tests

When adding new tests:

1. **Choose the right file**: Add tests to the appropriate category file
2. **Follow the pattern**: Use the same structure as existing tests
3. **Clean up**: Always use `beforeEach` and `afterEach` for cleanup
4. **Be specific**: Write clear, focused test descriptions
5. **Test one thing**: Each test should verify one specific behavior

### Example Test Structure

```typescript
import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN = "your-test-token";

describe("Your Test Category", () => {
  beforeEach(() => {
    resetConfig();
    delete process.env.DYTEXT_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  afterEach(() => {
    delete process.env.DYTEXT_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
    resetConfig();
  });

  it("should do something specific", async () => {
    // Arrange
    await initDytext(TEST_TOKEN);

    // Act
    const result = await getDytext("some-path");

    // Assert
    expect(result).toBeDefined();
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on others
2. **Cleanup**: Always clean up environment variables and reset state
3. **Async/Await**: Use async/await for asynchronous operations
4. **Clear Names**: Test names should clearly describe what they test
5. **Arrange-Act-Assert**: Follow the AAA pattern for test structure

## Adding Framework-Specific E2E Tests

When adding tests for a new framework (React, Vue, Svelte, etc.):

### 1. Create Framework Test App

```bash
# Create directory structure
mkdir -p e2e/test-apps/{framework-name}
cd e2e/test-apps/{framework-name}

# Initialize framework app
# (use framework-specific CLI)
```

### 2. Add Test Files

Follow the Next.js pattern:

```
e2e/test-apps/{framework-name}/
├── test/
│   ├── initialization-patterns.test.tsx
│   ├── basic-integration.test.tsx
│   ├── data-fetching.test.tsx
│   └── ...
├── jest.config.js
├── jest.setup.js
└── package.json
```

### 3. Update Documentation

**a) Add badge to main README.md:**

```markdown
[![framework](https://img.shields.io/badge/framework-XX%20tests-brightgreen.svg)](./e2e/test-apps/framework)
```

**b) Add to Test Summary table:**

```markdown
| **Framework E2E** | XX | Framework integration tests | ✅ |
```

**c) Add section under E2E Tests:**

```markdown
##### Framework Name (XX tests) ✅

\`\`\`bash
npm run test:e2e:framework
\`\`\`
```

### 4. Add NPM Script

In root `package.json`:

```json
{
  "scripts": {
    "test:e2e:framework": "cd e2e/test-apps/framework && npm install && npm run test:e2e"
  }
}
```

### 5. Key Test Areas to Cover

- ✅ Initialization patterns (manual + environment variables)
- ✅ Component integration
- ✅ Framework-specific environment variables
- ✅ Caching behavior
- ✅ Error handling
- ✅ Data fetching patterns
- ✅ Real-time updates (if applicable)
- ✅ Form integration (if applicable)

### Example: Adding React Tests

```bash
# 1. Create React app
mkdir -p e2e/test-apps/react
cd e2e/test-apps/react
npx create-react-app . --template typescript

# 2. Install dependencies
npm install dytext@file:../../.. @testing-library/react @testing-library/jest-dom

# 3. Create test files (follow Next.js pattern)

# 4. Update README badges:
# [![react](https://img.shields.io/badge/react-XX%20tests-brightgreen.svg)](./e2e/test-apps/react)

# 5. Add npm script:
# "test:e2e:react": "cd e2e/test-apps/react && npm install && npm test"
```
