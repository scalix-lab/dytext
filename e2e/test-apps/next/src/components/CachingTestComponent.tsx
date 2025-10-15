"use client";

import { useEffect, useState } from "react";
import { initDytext, getDytext } from "dytext";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

export default function CachingTestComponent() {
  const [cacheResults, setCacheResults] = useState<{
    firstCall: any;
    secondCall: any;
    thirdCall: any;
    callTimes: {
      first: number;
      second: number;
      third: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testCaching() {
      try {
        await initDytext(TEST_TOKEN);

        const startTime = Date.now();

        // First call - should fetch from API
        const firstCallStart = Date.now();
        const firstResult = await getDytext("*");
        const firstCallTime = Date.now() - firstCallStart;

        // Second call - should use cache
        const secondCallStart = Date.now();
        const secondResult = await getDytext("*");
        const secondCallTime = Date.now() - secondCallStart;

        // Third call with different path - should use cached module
        const thirdCallStart = Date.now();
        const thirdResult = await getDytext("product-catalog.name");
        const thirdCallTime = Date.now() - thirdCallStart;

        setCacheResults({
          firstCall: firstResult,
          secondCall: secondResult,
          thirdCall: thirdResult,
          callTimes: {
            first: firstCallTime,
            second: secondCallTime,
            third: thirdCallTime,
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    testCaching();
  }, []);

  if (isLoading)
    return <div data-testid="cache-loading">Testing caching behavior...</div>;
  if (error) return <div data-testid="cache-error">Error: {error}</div>;
  if (!cacheResults)
    return <div data-testid="cache-no-data">No cache test data available</div>;

  const isCached =
    JSON.stringify(cacheResults.firstCall) ===
    JSON.stringify(cacheResults.secondCall);
  const isFaster = cacheResults.callTimes.second < cacheResults.callTimes.first;

  return (
    <div data-testid="caching-test-component">
      <h2 data-testid="cache-title">Caching Test Results</h2>

      <div data-testid="cache-comparison">
        <div data-testid="first-call-result">
          First call result:{" "}
          {JSON.stringify(cacheResults.firstCall).substring(0, 100)}...
        </div>
        <div data-testid="second-call-result">
          Second call result:{" "}
          {JSON.stringify(cacheResults.secondCall).substring(0, 100)}...
        </div>
        <div data-testid="third-call-result">
          Third call result: {cacheResults.thirdCall}
        </div>
      </div>

      <div data-testid="performance-metrics">
        <div data-testid="first-call-time">
          First call time: {cacheResults.callTimes.first}ms
        </div>
        <div data-testid="second-call-time">
          Second call time: {cacheResults.callTimes.second}ms
        </div>
        <div data-testid="third-call-time">
          Third call time: {cacheResults.callTimes.third}ms
        </div>
      </div>

      <div data-testid="cache-status">
        <div data-testid="is-cached">
          Results are identical: {isCached ? "Yes" : "No"}
        </div>
        <div data-testid="is-faster">
          Second call is faster: {isFaster ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
}
