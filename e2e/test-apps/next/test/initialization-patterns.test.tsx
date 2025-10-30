import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { initDytext, getDytext, resetConfig } from "dytext";
import "cross-fetch/polyfill";

jest.setTimeout(30000);

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

// Component that uses environment variable for initialization
function EnvVarComponent() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Don't call initDytext - rely on environment variable
        const result = await getDytext("*");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading)
    return <div data-testid="env-loading">Loading with env var...</div>;
  if (error) return <div data-testid="env-error">Error: {error}</div>;
  if (!data) return <div data-testid="env-no-data">No data available</div>;

  return (
    <div data-testid="env-component">
      <h2 data-testid="env-title">Environment Variable Initialization</h2>
      <div data-testid="env-models-count">
        Models: {Object.keys(data).length}
      </div>
      <div data-testid="env-models-list">{Object.keys(data).join(", ")}</div>
    </div>
  );
}

// Component that properly uses environment variable by calling initDytext without token
function ProperEnvVarComponent() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Call initDytext without token - it will use environment variable
        await initDytext();
        const result = await getDytext("*");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div data-testid="proper-env-loading">Loading with proper env var...</div>
    );
  if (error) return <div data-testid="proper-env-error">Error: {error}</div>;
  if (!data)
    return <div data-testid="proper-env-no-data">No data available</div>;

  return (
    <div data-testid="proper-env-component">
      <h2 data-testid="proper-env-title">
        Proper Environment Variable Initialization
      </h2>
      <div data-testid="proper-env-models-count">
        Models: {Object.keys(data).length}
      </div>
      <div data-testid="proper-env-models-list">
        {Object.keys(data).join(", ")}
      </div>
    </div>
  );
}

// Component that manually initializes without environment variable
function ManualInitComponent() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Manually initialize with token
        await initDytext(TEST_TOKEN);
        const result = await getDytext("*");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading)
    return <div data-testid="manual-loading">Loading with manual init...</div>;
  if (error) return <div data-testid="manual-error">Error: {error}</div>;
  if (!data) return <div data-testid="manual-no-data">No data available</div>;

  return (
    <div data-testid="manual-component">
      <h2 data-testid="manual-title">Manual Initialization</h2>
      <div data-testid="manual-models-count">
        Models: {Object.keys(data).length}
      </div>
      <div data-testid="manual-models-list">{Object.keys(data).join(", ")}</div>
    </div>
  );
}

// Component that tries to use SDK without any initialization
function NoInitComponent() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Try to use SDK without any initialization
        const result = await getDytext("*");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading)
    return <div data-testid="no-init-loading">Loading without init...</div>;
  if (error) return <div data-testid="no-init-error">Error: {error}</div>;
  if (!data) return <div data-testid="no-init-no-data">No data available</div>;

  return (
    <div data-testid="no-init-component">
      <h2 data-testid="no-init-title">No Initialization</h2>
      <div data-testid="no-init-models-count">
        Models: {Object.keys(data).length}
      </div>
    </div>
  );
}

describe("DyText Initialization Patterns", () => {
  beforeEach(() => {
    // Reset SDK state before each test
    resetConfig();
    // Clean up environment variable
    delete process.env.DYTEXT_CLIENT_TOKEN;
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.DYTEXT_CLIENT_TOKEN;
    resetConfig();
  });

  describe("Initialization Requirements", () => {
    it("should auto-initialize when environment variable is set (no manual init)", async () => {
      // Set environment variable but don't call initDytext
      process.env.DYTEXT_CLIENT_TOKEN = TEST_TOKEN;

      render(<EnvVarComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("env-loading");
          const componentElement = screen.queryByTestId("env-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Should render successfully using env-based auto initialization
      expect(screen.getByTestId("env-component")).toBeInTheDocument();
      expect(screen.queryByTestId("env-error")).toBeNull();
      expect(screen.getByTestId("env-title")).toHaveTextContent(
        "Environment Variable Initialization",
      );
      expect(screen.getByTestId("env-models-count")).toBeInTheDocument();
      expect(screen.getByTestId("env-models-list")).toBeInTheDocument();
    });

    it("should work with explicit token initialization", async () => {
      // Call initDytext with explicit token (this is the recommended approach)
      await initDytext(TEST_TOKEN);

      render(<ProperEnvVarComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("proper-env-loading");
          const componentElement = screen.queryByTestId("proper-env-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Verify component renders successfully
      expect(screen.getByTestId("proper-env-component")).toBeInTheDocument();
      expect(screen.getByTestId("proper-env-title")).toHaveTextContent(
        "Proper Environment Variable Initialization",
      );

      // Verify data is loaded
      expect(screen.getByTestId("proper-env-models-count")).toBeInTheDocument();
      expect(screen.getByTestId("proper-env-models-list")).toBeInTheDocument();

      // Verify expected models are present
      const modelsList = screen.getByTestId(
        "proper-env-models-list",
      ).textContent;
      expect(modelsList).toContain("user-profile");
      expect(modelsList).toContain("product-catalog");
      expect(modelsList).toContain("blog-post");
    });

    it("should fail without environment variable or manual initialization", async () => {
      // Don't set environment variable and don't call initDytext
      render(<NoInitComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("no-init-loading");
          const errorElement = screen.queryByTestId("no-init-error");
          expect(loadingElement === null || errorElement !== null).toBe(true);
        },
        { timeout: 5000 },
      );

      // Should show error about initialization
      expect(screen.getByTestId("no-init-error")).toBeInTheDocument();
      expect(screen.getByTestId("no-init-error").textContent).toContain(
        "initialized",
      );
    });
  });

  describe("Manual Initialization", () => {
    it("should work with manual initialization without environment variable", async () => {
      // Don't set environment variable, but manually initialize
      render(<ManualInitComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("manual-loading");
          const componentElement = screen.queryByTestId("manual-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Verify component renders successfully
      expect(screen.getByTestId("manual-component")).toBeInTheDocument();
      expect(screen.getByTestId("manual-title")).toHaveTextContent(
        "Manual Initialization",
      );

      // Verify data is loaded
      expect(screen.getByTestId("manual-models-count")).toBeInTheDocument();
      expect(screen.getByTestId("manual-models-list")).toBeInTheDocument();

      // Verify expected models are present
      const modelsList = screen.getByTestId("manual-models-list").textContent;
      expect(modelsList).toContain("user-profile");
      expect(modelsList).toContain("product-catalog");
      expect(modelsList).toContain("blog-post");
    });
  });

  describe("Mixed Initialization Scenarios", () => {
    it("should handle multiple initialization attempts gracefully", async () => {
      // First, manually initialize
      await initDytext(TEST_TOKEN);

      // Then try to use proper environment variable component
      render(<ProperEnvVarComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("proper-env-loading");
          const componentElement = screen.queryByTestId("proper-env-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Should still work (SDK should ignore subsequent initializations)
      expect(screen.getByTestId("proper-env-component")).toBeInTheDocument();
    });

    it("should work with multiple components using same initialization", async () => {
      // First manually initialize
      await initDytext(TEST_TOKEN);

      // Use proper environment variable component
      render(<ProperEnvVarComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("proper-env-loading");
          const componentElement = screen.queryByTestId("proper-env-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Should work fine
      expect(screen.getByTestId("proper-env-component")).toBeInTheDocument();
    });
  });

  describe("Initialization State Management", () => {
    it("should maintain initialization state across components", async () => {
      // Set environment variable
      process.env.DYTEXT_CLIENT_TOKEN = TEST_TOKEN;

      // Render proper environment variable component first
      const { rerender } = render(<ProperEnvVarComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("proper-env-loading");
          const componentElement = screen.queryByTestId("proper-env-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      expect(screen.getByTestId("proper-env-component")).toBeInTheDocument();

      // Now render manual init component (should reuse existing initialization)
      rerender(<ManualInitComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("manual-loading");
          const componentElement = screen.queryByTestId("manual-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Should work without re-initializing
      expect(screen.getByTestId("manual-component")).toBeInTheDocument();
    });

    it("should handle reset and re-initialization", async () => {
      // First initialize manually
      await initDytext(TEST_TOKEN);

      // Reset the configuration
      resetConfig();

      // Now set environment variable
      process.env.DYTEXT_CLIENT_TOKEN = TEST_TOKEN;

      // Use proper environment variable component
      render(<ProperEnvVarComponent />);

      await waitFor(
        () => {
          const loadingElement = screen.queryByTestId("proper-env-loading");
          const componentElement = screen.queryByTestId("proper-env-component");
          expect(loadingElement === null || componentElement !== null).toBe(
            true,
          );
        },
        { timeout: 10000 },
      );

      // Should work after reset
      expect(screen.getByTestId("proper-env-component")).toBeInTheDocument();
    });
  });
});
