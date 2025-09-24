
import fs from 'fs';
import path from 'path';

// Pure API service for dytext data
export class DytextApiService {
  private static getJsonData() {
    const filePath = path.resolve(__dirname, '../../example.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }

  // Get a specific model or all models
  static async get(model?: string) {
    const data = DytextApiService.getJsonData();
    if (!model || model === '*') {
      // Return all models
      return data;
    }
    // Search for model in both roots
    if (data.e_commerce_platform[model]) {
      return data.e_commerce_platform[model];
    }
    if (data.content_management_system[model]) {
      return data.content_management_system[model];
    }
    return null;
  }

  // Simulate API route handler
  static async handleApiRequest(req: { query: { model?: string } }) {
    const { model } = req.query;
    if (!model) return { error: 'Model not specified' };
    const data = await DytextApiService.get(model);
    if (!data) return { error: 'Model not found' };
    return { data };
  }
}
