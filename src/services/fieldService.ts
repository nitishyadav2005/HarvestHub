import { db } from '../db';
import type { Field } from '../types';

export interface IFieldService {
  getAllFields(): Promise<Field[]>;
  getFieldById(id: number): Promise<Field | undefined>;
  addField(field: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
  updateField(id: number, field: Partial<Field>): Promise<void>;
  deleteField(id: number): Promise<void>;
  assignCrop(fieldId: number, cropId: number, cropName: string): Promise<void>;
}

export class IndexedDBFieldService implements IFieldService {
  async getAllFields(): Promise<Field[]> {
    return await db.fields.toArray();
  }

  async getFieldById(id: number): Promise<Field | undefined> {
    return await db.fields.get(id);
  }

  async addField(field: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    const newField: Omit<Field, 'id'> = {
      ...field,
      createdAt: now,
      updatedAt: now
    };
    return await db.fields.add(newField as Field);
  }

  async updateField(id: number, field: Partial<Field>): Promise<void> {
    const now = new Date().toISOString();
    await db.fields.update(id, {
      ...field,
      updatedAt: now
    });
  }

  async deleteField(id: number): Promise<void> {
    await db.fields.delete(id);
  }

  async assignCrop(fieldId: number, cropId: number, cropName: string): Promise<void> {
    const now = new Date().toISOString();
    await db.fields.update(fieldId, {
      currentCropId: cropId,
      currentCropName: cropName,
      status: 'Active',
      updatedAt: now
    });
  }
}

export const fieldService: IFieldService = new IndexedDBFieldService();
