import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Concurrent Operations", () => {
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

  it("should handle concurrent getDytext calls", async () => {
    const promises = [
      getDytext("product-catalog"),
      getDytext("user-profile"),
      getDytext("blog-post"),
    ];

    const results = await Promise.all(promises);

    expect(results[0]).toBeDefined();
    expect(results[1]).toBeDefined();
    expect(results[2]).toBeDefined();
  });

  it("should handle concurrent initialization attempts", async () => {
    resetConfig();

    const promises = [
      initDytext(TEST_TOKEN),
      initDytext(TEST_TOKEN),
      initDytext(TEST_TOKEN),
    ];

    const results = await Promise.all(promises);

    results.forEach(result => {
      expect(result.initialized).toBe(true);
    });
  });
});

