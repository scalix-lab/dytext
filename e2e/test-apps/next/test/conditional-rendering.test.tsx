import { render, screen, waitFor } from "@testing-library/react";
import ConditionalRenderingComponent from "../src/components/ConditionalRenderingComponent";
import { resetConfig } from "dytext";
import "cross-fetch/polyfill";

jest.setTimeout(30000);

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("DyText Conditional Rendering", () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it("should render conditionally based on data availability", async () => {
    render(<ConditionalRenderingComponent />);

    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId("conditional-loading");
        const componentElement = screen.queryByTestId(
          "conditional-rendering-component",
        );
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 },
    );

    // Verify component renders
    expect(
      screen.getByTestId("conditional-rendering-component"),
    ).toBeInTheDocument();

    // Verify status indicators
    expect(screen.getByTestId("user-profile-status")).toBeInTheDocument();
    expect(screen.getByTestId("product-catalog-status")).toBeInTheDocument();
    expect(screen.getByTestId("both-models-status")).toBeInTheDocument();

    // Verify conditional sections render based on data
    expect(screen.getByTestId("user-profile-section")).toBeInTheDocument();
    expect(screen.getByTestId("product-catalog-section")).toBeInTheDocument();
    expect(screen.getByTestId("combined-section")).toBeInTheDocument();
  });

  it("should show appropriate content for available models", async () => {
    render(<ConditionalRenderingComponent />);

    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId("conditional-loading");
        const componentElement = screen.queryByTestId(
          "conditional-rendering-component",
        );
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 },
    );

    // Verify model names are displayed
    expect(screen.getByTestId("user-profile-name")).toHaveTextContent(
      "user-profile",
    );
    expect(screen.getByTestId("product-catalog-name")).toHaveTextContent(
      "product-catalog",
    );

    // Verify field counts are displayed
    expect(screen.getByTestId("user-profile-fields-count")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-catalog-fields-count"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("total-fields")).toBeInTheDocument();
  });
});
