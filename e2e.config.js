// E2E test configuration for framework integrations
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  testMatch: ['**/e2e/test-apps/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  setupFiles: [],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  maxWorkers: 1,
  roots: [
    path.join(__dirname, 'e2e/test-apps/next'),
  ]
};