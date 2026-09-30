import Dexie, { type Table } from 'dexie';
import type { 
  User,
  Field, 
  Crop, 
  CropRotation, 
  FieldOperation, 
  Expense, 
  YieldRecord,
  Equipment,
  MaintenanceRecord
} from '../types';

export class HarvestHubDatabase extends Dexie {
  users!: Table<User>;
  fields!: Table<Field>;
  crops!: Table<Crop>;
  cropRotations!: Table<CropRotation>;
  operations!: Table<FieldOperation>;
  expenses!: Table<Expense>;
  yields!: Table<YieldRecord>;
  equipment!: Table<Equipment>;
  maintenance!: Table<MaintenanceRecord>;

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
    this.version(2).stores({
      equipment: '++id, name, type, status, nextMaintenanceDate',
      maintenance: '++id, equipmentId, scheduledDate, status'
    });
    this.version(3).stores({
      operations: '++id, fieldId, operationType, status, operationDate, costInr'
    });
    this.version(4).stores({
      users: '++id, &email, fullName, farmName',
      fields: '++id, userId, name, code, status, soilType',
      crops: '++id, userId, name, category, season',
      cropRotations: '++id, userId, fieldId, previousCrop, currentCrop, status, rotationYear',
      operations: '++id, userId, fieldId, operationType, status, operationDate, costInr',
      expenses: '++id, userId, fieldId, category, date',
      yields: '++id, userId, fieldId, cropName, harvestDate',
      equipment: '++id, userId, name, type, status, nextMaintenanceDate',
      maintenance: '++id, userId, equipmentId, scheduledDate, status'
    });
  }
}

export const db = new HarvestHubDatabase();
