import { initDytext, getDytext, resetConfig } from "../../src/index";

const TEST_TOKEN =
  "debuging.a1ec81ad309a04700e10d377a2663641d40890ecfa64f96ee4c2cc5942c4cec2";

describe("Data Fetching", () => {
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

  it('should fetch all data with wildcard "*"', async () => {
    const result = await getDytext("*");

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    expect(result["user-profile"]).toBeDefined();
    expect(result["product-catalog"]).toBeDefined();
    expect(result["blog-post"]).toBeDefined();
  });

  it("should fetch all data with empty string", async () => {
    const result = await getDytext("");

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    expect(result["user-profile"]).toBeDefined();
    expect(result["product-catalog"]).toBeDefined();
    expect(result["blog-post"]).toBeDefined();
  });

  it("should fetch a specific model", async () => {
    const result = await getDytext("product-catalog");

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    // Should return the product-catalog model data
    expect(result).toHaveProperty("name");
    expect(result.name).toBe("product-catalog");
    expect(result).toHaveProperty("fields");
    expect(Array.isArray(result.fields)).toBe(true);
  });

  it("should fetch a dotted subpath from model", async () => {
    const result = await getDytext("product-catalog.name");

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    // Should return the specific name value
    expect(result).toBe("product-catalog");
  });

  it("should fetch nested dotted subpath", async () => {
    const result = await getDytext("product-catalog.fields.0.name.value");

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).toBe("Sample Product");
  });

  it("should return undefined for non-existent model", async () => {
    const result = await getDytext("nonexistent");

    expect(result).toBeUndefined();
  });

  it("should return undefined for non-existent subpath", async () => {
    const result = await getDytext("product-catalog.nonexistent.path");

    expect(result).toBeUndefined();
  });
});

