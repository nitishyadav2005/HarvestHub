import Dexie, { type Table } from 'dexie';
import type { Field, Crop, CropRotation, FieldOperation, Expense, YieldRecord } from '../types';

export class HarvestHubDatabase extends Dexie {
  fields!: Table<Field>;
  crops!: Table<Crop>;
  cropRotations!: Table<CropRotation>;
  operations!: Table<FieldOperation>;
  expenses!: Table<Expense>;
  yields!: Table<YieldRecord>;

  constructor() {
    super('HarvestHubDB');
    this.version(1).stores({
      fields: '++id, name, code, status, soilType',
      crops: '++id, name, category, season',
      cropRotations: '++id, fieldId, previousCrop, currentCrop, status, rotationYear',
      operations: '++id, fieldId, operationType, status, operationDate',
      expenses: '++id, fieldId, category, date',
      yields: '++id, fieldId, cropName, harvestDate'
    });
  }
}

export const db = new HarvestHubDatabase();
