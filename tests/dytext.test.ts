import { initDytext, getDytext } from '../src/index';
import { resetInitialization } from '../src/state/state';

describe('DyText Library Tests', () => {
  beforeEach(() => {
    // Reset initialization state before each test
    resetInitialization();
  });

  describe('Library Initialization', () => {
    it('should initialize the library correctly', () => {
      const result = initDytext();
      
      expect(result.status).toBe('initialized');
      expect(result.options).toBeUndefined();
    });

    it('should initialize with options', () => {
      const options = { apiKey: 'test-key' };
      const result = initDytext(options);
      
      expect(result.status).toBe('initialized');
      expect(result.options).toEqual(options);
    });

    it('should prevent multiple initializations', () => {
      // First initialization
      const result1 = initDytext();
      expect(result1.status).toBe('initialized');
      
      // Second initialization should be ignored
      const result2 = initDytext();
      expect(result2.status).toBe('already-initialized');
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
      initDytext();
    });

    it('should fetch all data with wildcard "*"', async () => {
      const result = await getDytext('*');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.e_commerce_platform).toBeDefined();
      expect(result.content_management_system).toBeDefined();
    });

    it('should fetch all data with empty string', async () => {
      const result = await getDytext('');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.e_commerce_platform).toBeDefined();
      expect(result.content_management_system).toBeDefined();
    });

    it('should fetch a specific model', async () => {
      const result = await getDytext('product_catalog');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      // Should return the product_catalog model data
      expect(result).toHaveProperty('title');
      expect(result.title).toBe('Product Catalog Management');
    });

    it('should fetch a dotted subpath from model', async () => {
      const result = await getDytext('product_catalog.title');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Should return the specific title value
      expect(result).toBe('Product Catalog Management');
    });

    it('should fetch nested dotted subpath', async () => {
      const result = await getDytext('product_catalog.fields.0.field_json.value');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toBe('Wireless Bluetooth Headphones');
    });

    it('should return undefined for non-existent model', async () => {
      const result = await getDytext('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent subpath', async () => {
      const result = await getDytext('product_catalog.nonexistent.path');
      
      expect(result).toBeUndefined();
    });

  });

  describe('Caching Behavior', () => {
    beforeEach(() => {
      initDytext();
    });

    it('should cache module data and reuse for different subpaths', async () => {
      // First call - should fetch from API
      const result1 = await getDytext('product_catalog.title');
      
      // Second call with different subpath - should use cached module
      const result2 = await getDytext('product_catalog.description');
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe(result2); // Different values
      expect(result1).toBe('Product Catalog Management');
      expect(result2).toBe('Comprehensive product listing and inventory management system');
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
