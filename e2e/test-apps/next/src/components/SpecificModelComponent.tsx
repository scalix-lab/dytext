'use client';

import { useEffect, useState } from 'react';
import { initDytext, getDytext } from 'dytext';

const TEST_TOKEN = "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

interface ProductCatalog {
  name: string;
  fields: Array<{
    name: {
      value: string;
    };
    description?: {
      value: string;
    };
  }>;
}

export default function SpecificModelComponent() {
  const [productData, setProductData] = useState<ProductCatalog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductCatalog() {
      try {
        await initDytext(TEST_TOKEN);
        const result = await getDytext('product-catalog') as ProductCatalog;
        setProductData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductCatalog();
  }, []);

  if (isLoading) return <div data-testid="specific-model-loading">Loading product catalog...</div>;
  if (error) return <div data-testid="specific-model-error">Error: {error}</div>;
  if (!productData) return <div data-testid="specific-model-no-data">No product data available</div>;

  return (
    <div data-testid="specific-model-component">
      <h2 data-testid="product-name">{productData.name}</h2>
      <div data-testid="product-fields">
        {productData.fields.map((field, index) => (
          <div key={index} data-testid={`product-field-${index}`}>
            <h3 data-testid={`field-name-${index}`}>{field.name.value}</h3>
            {field.description && (
              <p data-testid={`field-description-${index}`}>{field.description.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


