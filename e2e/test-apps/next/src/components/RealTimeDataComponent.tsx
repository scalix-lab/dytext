"use client";

import { useEffect, useState } from "react";
import { initDytext, getDytext } from "dytext";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

export default function RealTimeDataComponent() {
  const [data, setData] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await getDytext("*");
      setData(result);
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function initializeAndFetch() {
      try {
        await initDytext(TEST_TOKEN);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIsLoading(false);
      }
    }

    initializeAndFetch();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading && refreshCount === 0)
    return <div data-testid="realtime-loading">Loading real-time data...</div>;
  if (error) return <div data-testid="realtime-error">Error: {error}</div>;
  if (!data)
    return (
      <div data-testid="realtime-no-data">No real-time data available</div>
    );

  return (
    <div data-testid="realtime-data-component">
      <h2 data-testid="realtime-title">Real-Time Data Component</h2>

      <div data-testid="refresh-controls">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          data-testid="refresh-button"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
        <span data-testid="refresh-count">Refresh count: {refreshCount}</span>
      </div>

      <div data-testid="data-summary">
        <div data-testid="models-count">
          Models loaded: {Object.keys(data).length}
        </div>
        <div data-testid="models-list">{Object.keys(data).join(", ")}</div>
      </div>

      <div data-testid="last-updated">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
