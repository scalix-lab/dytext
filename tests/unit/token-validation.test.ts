import { initDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Token Validation", () => {
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

  it("should throw error for invalid token format (no dot)", async () => {
    await expect(initDytext("invalid-token-no-dot")).rejects.toThrow(
      "Invalid dytext_client_token format",
    );
  });

  it("should throw error for invalid token format (missing projectId)", async () => {
    await expect(initDytext(".token-only")).rejects.toThrow(
      "Invalid dytext_client_token format",
    );
  });

  it("should throw error for invalid token format (missing token)", async () => {
    await expect(initDytext("projectid.")).rejects.toThrow(
      "Invalid dytext_client_token format",
    );
  });

  it("should parse valid token correctly", async () => {
    const result = await initDytext(TEST_TOKEN);

    expect(result.projectId).toBe("debuging");
    expect(result.token).toBe(
      "a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2",
    );
  });
});
