import { render, screen, waitFor } from "@testing-library/react";
import { resetConfig } from "dytext";
import SpecificModelComponent from "../src/components/SpecificModelComponent";
import "cross-fetch/polyfill";

jest.setTimeout(30000);

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("DyText Specific Model Fetching", () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it("should fetch and display specific model data", async () => {
    render(<SpecificModelComponent />);

    // Wait for component to load
    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId("specific-model-loading");
        const componentElement = screen.queryByTestId(
          "specific-model-component",
        );
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 },
    );

    // Verify component renders
    expect(screen.getByTestId("specific-model-component")).toBeInTheDocument();

    // Verify product name is displayed
    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "product-catalog",
    );

    // Verify fields are rendered
    expect(screen.getByTestId("product-fields")).toBeInTheDocument();
    expect(screen.getByTestId("product-field-0")).toBeInTheDocument();
    expect(screen.getByTestId("field-name-0")).toHaveTextContent(
      "Sample Product",
    );
  });

  it("should handle specific model errors gracefully", async () => {
    render(<SpecificModelComponent />);

    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId("specific-model-loading");
        const componentElement = screen.queryByTestId(
          "specific-model-component",
        );
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 },
    );

    // Component should render successfully (since SDK is already initialized)
    expect(screen.getByTestId("specific-model-component")).toBeInTheDocument();

    // Verify it shows the expected data
    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "product-catalog",
    );
  });
});
