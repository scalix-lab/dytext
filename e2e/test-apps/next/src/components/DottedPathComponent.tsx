'use client';

import { useEffect, useState } from 'react';
import { initDytext, getDytext } from 'dytext';

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

export default function DottedPathComponent() {
  const [dottedPathData, setDottedPathData] = useState<{
    productName: string | undefined;
    firstFieldName: string | undefined;
    firstFieldDescription: string | undefined;
    userProfileName: string | undefined;
    nonExistentPath: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDottedPaths() {
      try {
        await initDytext(TEST_TOKEN);
        
        // Fetch various dotted paths
        const [
          productName,
          firstFieldName,
          firstFieldDescription,
          userProfileName,
          nonExistentPath
        ] = await Promise.all([
          getDytext('product-catalog.name'),
          getDytext('product-catalog.fields.0.name.value'),
          getDytext('product-catalog.fields.0.description.value'),
          getDytext('user-profile.name'),
          getDytext('product-catalog.nonexistent.path')
        ]);

        setDottedPathData({
          productName,
          firstFieldName,
          firstFieldDescription,
          userProfileName,
          nonExistentPath
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDottedPaths();
  }, []);

  if (isLoading) return <div data-testid="dotted-path-loading">Loading dotted paths...</div>;
  if (error) return <div data-testid="dotted-path-error">Error: {error}</div>;
  if (!dottedPathData) return <div data-testid="dotted-path-no-data">No dotted path data available</div>;

  return (
    <div data-testid="dotted-path-component">
      <div data-testid="product-name-path">{dottedPathData.productName}</div>
      <div data-testid="first-field-name">{dottedPathData.firstFieldName}</div>
      <div data-testid="first-field-description">{dottedPathData.firstFieldDescription || 'No description'}</div>
      <div data-testid="user-profile-name">{dottedPathData.userProfileName}</div>
      <div data-testid="non-existent-path">{dottedPathData.nonExistentPath === undefined ? 'undefined' : 'exists'}</div>
    </div>
  );
}


