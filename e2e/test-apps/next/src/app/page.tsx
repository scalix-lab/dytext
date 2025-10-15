'use client';

import { useEffect, useState } from 'react';
import { initDytext, getDytext } from 'dytext';

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeDytext() {
      try {
        // Initialize DyText
        await initDytext(TEST_TOKEN);
        
        // Fetch data
        const result = await getDytext('*');
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    initializeDytext();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <main>
      <h1>DyText Next.js Test Page</h1>
      <pre data-testid="dytext-data">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}