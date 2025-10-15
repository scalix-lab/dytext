import { initDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Environment Variable Initialization", () => {
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

  it("should initialize from DYTEXT_CLIENT_TOKEN environment variable", async () => {
    process.env.DYTEXT_CLIENT_TOKEN = TEST_TOKEN;

    const result = await initDytext();

    expect(result.initialized).toBe(true);
    expect(result.dytextClientToken).toBe(TEST_TOKEN);
  });

  it("should prioritize explicit token over environment variable", async () => {
    process.env.DYTEXT_CLIENT_TOKEN = "wrong-token";

    const result = await initDytext(TEST_TOKEN);

    expect(result.initialized).toBe(true);
    expect(result.dytextClientToken).toBe(TEST_TOKEN);
  });

  it("should throw error when no token provided and no environment variable", async () => {
    await expect(initDytext()).rejects.toThrow(
      "dytext_client_token is required"
    );
  });
});

