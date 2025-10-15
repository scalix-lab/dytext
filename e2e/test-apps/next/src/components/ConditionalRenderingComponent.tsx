"use client";

import { useEffect, useState } from "react";
import { initDytext, getDytext } from "dytext";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

export default function ConditionalRenderingComponent() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [productCatalog, setProductCatalog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConditionalData() {
      try {
        await initDytext(TEST_TOKEN);

        // Fetch different models based on conditions
        const [userResult, productResult] = await Promise.all([
          getDytext("user-profile"),
          getDytext("product-catalog"),
        ]);

        setUserProfile(userResult);
        setProductCatalog(productResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchConditionalData();
  }, []);

  if (isLoading)
    return (
      <div data-testid="conditional-loading">Loading conditional data...</div>
    );
  if (error) return <div data-testid="conditional-error">Error: {error}</div>;

  // Conditional rendering based on data availability
  const hasUserProfile =
    userProfile && userProfile.fields && userProfile.fields.length > 0;
  const hasProductCatalog =
    productCatalog && productCatalog.fields && productCatalog.fields.length > 0;
  const hasBothModels = hasUserProfile && hasProductCatalog;

  return (
    <div data-testid="conditional-rendering-component">
      <h2 data-testid="conditional-title">Conditional Rendering Component</h2>

      <div data-testid="conditional-status">
        <div data-testid="user-profile-status">
          User Profile: {hasUserProfile ? "Available" : "Not Available"}
        </div>
        <div data-testid="product-catalog-status">
          Product Catalog: {hasProductCatalog ? "Available" : "Not Available"}
        </div>
        <div data-testid="both-models-status">
          Both Models: {hasBothModels ? "Available" : "Not Available"}
        </div>
      </div>

      {hasUserProfile && (
        <div data-testid="user-profile-section">
          <h3>User Profile</h3>
          <div data-testid="user-profile-name">{userProfile.name}</div>
          <div data-testid="user-profile-fields-count">
            Fields: {userProfile.fields.length}
          </div>
        </div>
      )}

      {hasProductCatalog && (
        <div data-testid="product-catalog-section">
          <h3>Product Catalog</h3>
          <div data-testid="product-catalog-name">{productCatalog.name}</div>
          <div data-testid="product-catalog-fields-count">
            Fields: {productCatalog.fields.length}
          </div>
        </div>
      )}

      {hasBothModels && (
        <div data-testid="combined-section">
          <h3>Combined Data</h3>
          <div data-testid="total-fields">
            Total Fields:{" "}
            {userProfile.fields.length + productCatalog.fields.length}
          </div>
        </div>
      )}

      {!hasUserProfile && !hasProductCatalog && (
        <div data-testid="no-data-message">
          No data available for conditional rendering
        </div>
      )}
    </div>
  );
}
