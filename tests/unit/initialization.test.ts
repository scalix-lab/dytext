import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Library Initialization", () => {
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

  it("should initialize the library correctly", async () => {
    const result = await initDytext(TEST_TOKEN);

    expect(result.initialized).toBe(true);
    expect(result.dytextClientToken).toBe(TEST_TOKEN);
  });

  it("should initialize with options", async () => {
    const config = {};
    const result = await initDytext(TEST_TOKEN, config);

    expect(result.initialized).toBe(true);
    expect(result.dytextClientToken).toBe(TEST_TOKEN);
  });

  it("should prevent multiple initializations", async () => {
    // First initialization
    const result1 = await initDytext(TEST_TOKEN);
    expect(result1.initialized).toBe(true);

    // Second initialization should be ignored
    const result2 = await initDytext(TEST_TOKEN);
    expect(result2.initialized).toBe(true);
  });

  it("should throw error when getDytext is called before initialization", async () => {
    await expect(getDytext()).rejects.toThrow(
      "DyText library must be initialized before use. Call initDytext() first.",
    );
  });
});
