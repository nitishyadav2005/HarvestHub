import { db } from '../db';
import type { FieldOperation } from '../types';

export interface IOperationService {
  getAllOperations(): Promise<FieldOperation[]>;
  getOperationsByField(fieldId: number): Promise<FieldOperation[]>;
  addOperation(operation: Omit<FieldOperation, 'id'>): Promise<number>;
  updateOperation(id: number, operation: Partial<FieldOperation>): Promise<void>;
  deleteOperation(id: number): Promise<void>;
  completeOperation(id: number): Promise<void>;
}

export class IndexedDBOperationService implements IOperationService {
  async getAllOperations(): Promise<FieldOperation[]> {
    return await db.operations.toArray();
  }

  async getOperationsByField(fieldId: number): Promise<FieldOperation[]> {
    return await db.operations.where('fieldId').equals(fieldId).toArray();
  }

  async addOperation(operation: Omit<FieldOperation, 'id'>): Promise<number> {
    return await db.operations.add(operation as FieldOperation);
  }

  async updateOperation(id: number, operation: Partial<FieldOperation>): Promise<void> {
    await db.operations.update(id, operation);
  }

  async deleteOperation(id: number): Promise<void> {
    await db.operations.delete(id);
  }

  async completeOperation(id: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await db.operations.update(id, {
      status: 'Completed',
      completedDate: today
    });
  }
}

export const operationService: IOperationService = new IndexedDBOperationService();
