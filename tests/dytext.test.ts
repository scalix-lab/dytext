import { initDytext, getDytext } from '../src/index';
import { resetState } from '../src/state/state';

const TEST_TOKEN = 'PROJ11.ASDMK2MKMD22K1M12MD1K2MK2MM21';

describe('DyText Library Tests', () => {
  beforeEach(() => {
    // Reset initialization state before each test
    resetState();
  });

  describe('Library Initialization', () => {
    it('should initialize the library correctly', () => {
      const result = initDytext(TEST_TOKEN);
      
      expect(result.initialized).toBe(true);
      expect(result.dytextClientToken).toBe(TEST_TOKEN);
    });

    it('should initialize with options', () => {
      const config = {};
      const result = initDytext(TEST_TOKEN, config);
      
      expect(result.initialized).toBe(true);
      expect(result.dytextClientToken).toBe(TEST_TOKEN);
    });

    it('should prevent multiple initializations', () => {
      // First initialization
      const result1 = initDytext(TEST_TOKEN);
      expect(result1.initialized).toBe(true);
      
      // Second initialization should be ignored
      const result2 = initDytext(TEST_TOKEN);
      expect(result2.initialized).toBe(true);
    });

    it('should throw error when getDytext is called before initialization', async () => {
      await expect(getDytext()).rejects.toThrow(
        'DyText library must be initialized before use. Call initDytext() first.'
      );
    });
  });

  describe('Data Fetching', () => {
    beforeEach(() => {
      // Initialize library before each data fetching test
      initDytext(TEST_TOKEN);
    });

    it('should fetch all data with wildcard "*"', async () => {
      const result = await getDytext('*');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result['user-profile']).toBeDefined();
      expect(result['product-catalog']).toBeDefined();
      expect(result['blog-post']).toBeDefined();
    });

    it('should fetch all data with empty string', async () => {
      const result = await getDytext('');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result['user-profile']).toBeDefined();
      expect(result['product-catalog']).toBeDefined();
      expect(result['blog-post']).toBeDefined();
    });

    it('should fetch a specific model', async () => {
      const result = await getDytext('product-catalog');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      // Should return the product-catalog model data
      expect(result).toHaveProperty('name');
      expect(result.name).toBe('product-catalog');
      expect(result).toHaveProperty('fields');
      expect(Array.isArray(result.fields)).toBe(true);
    });

    it('should fetch a dotted subpath from model', async () => {
      const result = await getDytext('product-catalog.name');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Should return the specific name value
      expect(result).toBe('product-catalog');
    });

    it('should fetch nested dotted subpath', async () => {
      const result = await getDytext('product-catalog.fields.0.name.value');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toBe('Sample Product');
    });

    it('should return undefined for non-existent model', async () => {
      const result = await getDytext('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent subpath', async () => {
      const result = await getDytext('product-catalog.nonexistent.path');
      
      expect(result).toBeUndefined();
    });

  });

  describe('Caching Behavior', () => {
    beforeEach(() => {
      initDytext(TEST_TOKEN);
    });

    it('should cache module data and reuse for different subpaths', async () => {
      // First call - should fetch from API
      const result1 = await getDytext('product-catalog.name');
      
      // Second call with different subpath - should use cached module
      const result2 = await getDytext('product-catalog.fields');
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe(result2); // Different values
      expect(result1).toBe('product-catalog');
      expect(Array.isArray(result2)).toBe(true);
    });

    it('should cache wildcard results', async () => {
      // First call
      const result1 = await getDytext('*');
      
      // Second call should return cached result
      const result2 = await getDytext('*');
      
      expect(result1).toEqual(result2);
    });
  });
});
