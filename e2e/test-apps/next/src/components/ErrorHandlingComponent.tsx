"use client";

import { useEffect, useState } from "react";
import { initDytext, getDytext } from "dytext";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

export default function ErrorHandlingComponent() {
  const [errorResults, setErrorResults] = useState<{
    nonExistentModel: any;
    invalidPath: any;
    deepInvalidPath: any;
    emptyPath: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testErrorHandling() {
      try {
        await initDytext(TEST_TOKEN);

        // Test various error scenarios
        const [nonExistentModel, invalidPath, deepInvalidPath, emptyPath] =
          await Promise.all([
            getDytext("non-existent-model"),
            getDytext("product-catalog.invalid.field"),
            getDytext("product-catalog.fields.999.nonexistent.deep.path"),
            getDytext(""),
          ]);

        setErrorResults({
          nonExistentModel,
          invalidPath,
          deepInvalidPath,
          emptyPath,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    testErrorHandling();
  }, []);

  if (isLoading)
    return <div data-testid="error-loading">Testing error handling...</div>;
  if (error)
    return <div data-testid="error-component-error">Error: {error}</div>;
  if (!errorResults)
    return <div data-testid="error-no-data">No error test data available</div>;

  return (
    <div data-testid="error-handling-component">
      <h2 data-testid="error-title">Error Handling Test Results</h2>

      <div data-testid="error-scenarios">
        <div data-testid="non-existent-model-result">
          Non-existent model result:{" "}
          {errorResults.nonExistentModel === undefined ? "undefined" : "exists"}
        </div>
        <div data-testid="invalid-path-result">
          Invalid path result:{" "}
          {errorResults.invalidPath === undefined ? "undefined" : "exists"}
        </div>
        <div data-testid="deep-invalid-path-result">
          Deep invalid path result:{" "}
          {errorResults.deepInvalidPath === undefined ? "undefined" : "exists"}
        </div>
        <div data-testid="empty-path-result">
          Empty path result: {errorResults.emptyPath ? "has data" : "no data"}
        </div>
      </div>

      <div data-testid="error-summary">
        <div data-testid="graceful-handling">
          All error scenarios handled gracefully:{" "}
          {errorResults.nonExistentModel === undefined &&
          errorResults.invalidPath === undefined &&
          errorResults.deepInvalidPath === undefined &&
          errorResults.emptyPath !== undefined
            ? "Yes"
            : "No"}
        </div>
      </div>
    </div>
  );
}
