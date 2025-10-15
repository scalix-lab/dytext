/**
 * DyText Next.js Integration Test Suite
 *
 * This is the main test file that imports and runs all individual test suites.
 * Each test category has been broken down into its own focused test file for better maintainability.
 *
 * Test Files:
 * - basic-integration.test.tsx: Basic SDK initialization and data loading
 * - specific-model.test.tsx: Specific model fetching and display
 * - dotted-path.test.tsx: Dotted path access for nested values
 * - form-mapping.test.tsx: Form field mapping and interactions
 * - caching-behavior.test.tsx: Caching performance and effectiveness
 * - error-handling.test.tsx: Error handling scenarios
 * - realtime-data.test.tsx: Real-time data management and refresh
 * - conditional-rendering.test.tsx: Conditional rendering based on data
 * - advanced-integration.test.tsx: Advanced scenarios and comprehensive testing
 * - initialization-patterns.test.tsx: Different initialization patterns and scenarios
 */

// Import all test files to ensure they are executed
import "./basic-integration.test.tsx";
import "./specific-model.test.tsx";
import "./dotted-path.test.tsx";
import "./form-mapping.test.tsx";
import "./caching-behavior.test.tsx";
import "./error-handling.test.tsx";
import "./realtime-data.test.tsx";
import "./conditional-rendering.test.tsx";
import "./advanced-integration.test.tsx";
import "./initialization-patterns.test.tsx";

// This file serves as the main entry point for all DyText Next.js integration tests
// Individual test files contain the actual test implementations
