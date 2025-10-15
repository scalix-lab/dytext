import { render, screen, waitFor } from "@testing-library/react";
import { resetConfig } from "dytext";
import Home from "../src/app/page";
import "cross-fetch/polyfill";

jest.setTimeout(30000); // Increase timeout to 30s for all tests

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("DyText Basic Integration Tests", () => {
  beforeEach(() => {
    resetConfig();
    // Set up environment variable
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it("should initialize DyText and load data", async () => {
    render(<Home />);

    // Initially should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(
      () => {
        const dataElement = screen.getByTestId("dytext-data");
        expect(dataElement).toBeInTheDocument();

        const data = JSON.parse(dataElement.textContent || "{}");

        // Verify expected models are present
        expect(data).toHaveProperty("user-profile");
        expect(data).toHaveProperty("product-catalog");
        expect(data).toHaveProperty("blog-post");

        // Verify data structure
        expect(data["product-catalog"]).toHaveProperty("fields");
        expect(data["product-catalog"].fields[0]).toHaveProperty(
          "name.value",
          "Sample Product",
        );
      },
      { timeout: 5000 },
    );
  });

  it("should handle initialization with environment variable", async () => {
    render(<Home />);

    await waitFor(
      () => {
        const dataElement = screen.getByTestId("dytext-data");
        expect(dataElement).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it("should cache repeated requests", async () => {
    render(<Home />);

    await waitFor(
      () => {
        const dataElement = screen.getByTestId("dytext-data");
        expect(dataElement).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Re-render to trigger another request (should use cache)
    render(<Home />);

    await waitFor(
      () => {
        const dataElement = screen.getByTestId("dytext-data");
        expect(dataElement).toBeInTheDocument();
      },
      { timeout: 1000 }, // Should be faster due to caching
    );
  });
});
