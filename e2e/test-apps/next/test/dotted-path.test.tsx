import { render, screen, waitFor } from "@testing-library/react";
import DottedPathComponent from "../src/components/DottedPathComponent";
import { resetConfig } from "dytext";
import "cross-fetch/polyfill";

jest.setTimeout(30000);

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("DyText Dotted Path Access", () => {
  beforeEach(() => {
    resetConfig();
    process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN = TEST_TOKEN;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  it("should access nested values using dotted paths", async () => {
    render(<DottedPathComponent />);

    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId("dotted-path-loading");
        const componentElement = screen.queryByTestId("dotted-path-component");
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 },
    );

    // Verify component renders
    expect(screen.getByTestId("dotted-path-component")).toBeInTheDocument();

    // Verify dotted path results
    expect(screen.getByTestId("product-name-path")).toHaveTextContent(
      "product-catalog",
    );
    expect(screen.getByTestId("first-field-name")).toHaveTextContent(
      "Sample Product",
    );
    expect(screen.getByTestId("user-profile-name")).toBeInTheDocument();

    // Verify non-existent path returns undefined
    expect(screen.getByTestId("non-existent-path")).toHaveTextContent(
      "undefined",
    );
  });

  it("should handle deep nested paths correctly", async () => {
    render(<DottedPathComponent />);

    await waitFor(
      () => {
        const loadingElement = screen.queryByTestId("dotted-path-loading");
        const componentElement = screen.queryByTestId("dotted-path-component");
        expect(loadingElement === null || componentElement !== null).toBe(true);
      },
      { timeout: 5000 },
    );

    // Verify deep nested access works
    const firstFieldDescription = screen.getByTestId("first-field-description");
    expect(firstFieldDescription).toBeInTheDocument();
  });
});
