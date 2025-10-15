import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Error Handling", () => {
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

  it("should handle API errors gracefully", async () => {
    // This test depends on your API behavior
    // You might want to mock the API to test error scenarios
    const result = await getDytext("nonexistent-model");
    expect(result).toBeUndefined();
  });

  it("should handle empty path gracefully", async () => {
    const result = await getDytext("");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("should handle undefined path gracefully", async () => {
    const result = await getDytext();
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });
});

