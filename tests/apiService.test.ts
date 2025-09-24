import { DytextApiService } from '../src/api/apiService';

describe('DytextApiService', () => {
  describe('handleApiRequest', () => {
    it('should handle API requests successfully', async () => {
      const req = { query: { model: 'product_catalog' } };
      const result = await DytextApiService.handleApiRequest(req);
      
      expect(result).toHaveProperty('data');
      expect(result.data).toBeDefined();
      expect(result.data.title).toBe('Product Catalog Management');
    });

    it('should return error when model not specified', async () => {
      const req = { query: {} };
      const result = await DytextApiService.handleApiRequest(req);
      
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Model not specified');
    });

    it('should return error when model not found', async () => {
      const req = { query: { model: 'nonexistent_model' } };
      const result = await DytextApiService.handleApiRequest(req);
      
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Model not found');
    });
  });

  describe('get method', () => {
    it('should fetch model from content_management_system', async () => {
      const result = await DytextApiService.get('blog_articles');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.title).toBe('Blog Article Management');
      expect(result.description).toBe('Content creation and publishing system for blog posts');
    });

    it('should return null for non-existent model', async () => {
      const result = await DytextApiService.get('nonexistent_model');
      
      expect(result).toBeNull();
    });

    it('should return all data when model is "*"', async () => {
      const result = await DytextApiService.get('*');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.e_commerce_platform).toBeDefined();
      expect(result.content_management_system).toBeDefined();
    });
  });
});
