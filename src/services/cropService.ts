import { db } from '../db';
import type { Crop } from '../types';

export interface ICropService {
  getAllCrops(): Promise<Crop[]>;
  getCropById(id: number): Promise<Crop | undefined>;
  addCrop(crop: Omit<Crop, 'id'>): Promise<number>;
  updateCrop(id: number, crop: Partial<Crop>): Promise<void>;
  deleteCrop(id: number): Promise<void>;
}

export class IndexedDBCropService implements ICropService {
  async getAllCrops(): Promise<Crop[]> {
    return await db.crops.toArray();
  }

  async getCropById(id: number): Promise<Crop | undefined> {
    return await db.crops.get(id);
  }

  async addCrop(crop: Omit<Crop, 'id'>): Promise<number> {
    return await db.crops.add(crop as Crop);
  }

  async updateCrop(id: number, crop: Partial<Crop>): Promise<void> {
    await db.crops.update(id, crop);
  }

  async deleteCrop(id: number): Promise<void> {
    await db.crops.delete(id);
  }
}

export const cropService: ICropService = new IndexedDBCropService();
