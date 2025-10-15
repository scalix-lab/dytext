import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("State Management", () => {
  beforeEach(() => {
    resetConfig();
    delete process.env.DYTEXT_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  });

  afterEach(() => {
    delete process.env.DYTEXT_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
    resetConfig();
  });

  it("should reset state correctly", async () => {
    await initDytext(TEST_TOKEN);

    resetConfig();

    // Should throw error after reset
    await expect(getDytext()).rejects.toThrow(
      "DyText library must be initialized before use",
    );
  });

  it("should allow re-initialization after reset", async () => {
    await initDytext(TEST_TOKEN);
    resetConfig();

    const result = await initDytext(TEST_TOKEN);

    expect(result.initialized).toBe(true);
  });

  it("should clear cache on reset", async () => {
    await initDytext(TEST_TOKEN);
    await getDytext("*"); // Cache the result

    resetConfig();
    await initDytext(TEST_TOKEN);

    // Should fetch fresh data (not throw error)
    const result = await getDytext("*");
    expect(result).toBeDefined();
  });
});
