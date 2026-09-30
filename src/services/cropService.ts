import { db } from '../db';
import type { Crop } from '../types';
import { authService } from './authService';

export interface ICropService {
  getAllCrops(userId?: number): Promise<Crop[]>;
  getCropById(id: number): Promise<Crop | undefined>;
  addCrop(crop: Omit<Crop, 'id'>): Promise<number>;
  updateCrop(id: number, crop: Partial<Crop>): Promise<void>;
  deleteCrop(id: number): Promise<void>;
}

export class IndexedDBCropService implements ICropService {
  async getAllCrops(userId?: number): Promise<Crop[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    // Return standard crops (no userId or userId = 1) plus current user's crops
    if (targetUserId) {
      return await db.crops
        .filter((c) => !c.userId || c.userId === 1 || c.userId === targetUserId)
        .toArray();
    }
    return await db.crops.toArray();
  }

  async getCropById(id: number): Promise<Crop | undefined> {
    return await db.crops.get(id);
  }

  async addCrop(crop: Omit<Crop, 'id'>): Promise<number> {
    const userId = crop.userId ?? authService.getCurrentUserId() ?? 1;
    return await db.crops.add({
      ...crop,
      userId
    } as Crop);
  }

  async updateCrop(id: number, crop: Partial<Crop>): Promise<void> {
    await db.crops.update(id, crop);
  }

  async deleteCrop(id: number): Promise<void> {
    await db.crops.delete(id);
  }
}

export const cropService: ICropService = new IndexedDBCropService();
