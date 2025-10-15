import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Caching Behavior", () => {
  beforeEach(async () => {
    resetConfig();
    delete process.env.DYTEXT_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
    await initDytext(TEST_TOKEN);
  });

  afterEach(() => {
    delete process.env.DYTEXT_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
    resetConfig();
  });

  it("should cache module data and reuse for different subpaths", async () => {
    // First call - should fetch from API
    const result1 = await getDytext("product-catalog.name");

    // Second call with different subpath - should use cached module
    const result2 = await getDytext("product-catalog.fields");

    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1).not.toBe(result2); // Different values
    expect(result1).toBe("product-catalog");
    expect(Array.isArray(result2)).toBe(true);
  });

  it("should cache wildcard results", async () => {
    // First call
    const result1 = await getDytext("*");

    // Second call should return cached result
    const result2 = await getDytext("*");

    expect(result1).toEqual(result2);
  });
});

