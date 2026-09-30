import { db } from '../db';
import type { FieldOperation } from '../types';
import { authService } from './authService';

export interface IOperationService {
  getAllOperations(userId?: number): Promise<FieldOperation[]>;
  getOperationsByField(fieldId: number): Promise<FieldOperation[]>;
  addOperation(operation: Omit<FieldOperation, 'id'>): Promise<number>;
  updateOperation(id: number, operation: Partial<FieldOperation>): Promise<void>;
  deleteOperation(id: number): Promise<void>;
  completeOperation(id: number): Promise<void>;
}

export class IndexedDBOperationService implements IOperationService {
  async getAllOperations(userId?: number): Promise<FieldOperation[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    if (targetUserId) {
      return await db.operations
        .filter((o) => o.userId === targetUserId || (!o.userId && targetUserId === 1))
        .toArray();
    }
    return await db.operations.toArray();
  }

  async getOperationsByField(fieldId: number): Promise<FieldOperation[]> {
    return await db.operations.where('fieldId').equals(fieldId).toArray();
  }

  async addOperation(operation: Omit<FieldOperation, 'id'>): Promise<number> {
    const userId = operation.userId ?? authService.getCurrentUserId() ?? 1;
    return await db.operations.add({
      ...operation,
      userId
    } as FieldOperation);
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
