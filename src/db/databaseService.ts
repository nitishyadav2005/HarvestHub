import { db } from './index';
import {
  SAMPLE_CROPS,
  SAMPLE_FIELDS,
  SAMPLE_CROP_ROTATIONS,
  SAMPLE_OPERATIONS,
  SAMPLE_EXPENSES,
  SAMPLE_YIELDS
} from './seedData';

export async function initializeDatabase(forceReset = false): Promise<boolean> {
  try {
    if (forceReset) {
      await db.transaction('rw', [db.fields, db.crops, db.cropRotations, db.operations, db.expenses, db.yields], async () => {
        await db.fields.clear();
        await db.crops.clear();
        await db.cropRotations.clear();
        await db.operations.clear();
        await db.expenses.clear();
        await db.yields.clear();
      });
    }

    const fieldsCount = await db.fields.count();
    
    if (fieldsCount === 0) {
      console.log('Seeding IndexedDB with realistic Indian agricultural sample data...');
      await db.transaction('rw', [db.fields, db.crops, db.cropRotations, db.operations, db.expenses, db.yields], async () => {
        await db.crops.bulkAdd(SAMPLE_CROPS);
        await db.fields.bulkAdd(SAMPLE_FIELDS);
        await db.cropRotations.bulkAdd(SAMPLE_CROP_ROTATIONS);
        await db.operations.bulkAdd(SAMPLE_OPERATIONS);
        await db.expenses.bulkAdd(SAMPLE_EXPENSES);
        await db.yields.bulkAdd(SAMPLE_YIELDS);
      });
      console.log('IndexedDB seed complete.');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize IndexedDB database:', error);
    return false;
  }
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.fields, db.crops, db.cropRotations, db.operations, db.expenses, db.yields], async () => {
    await db.fields.clear();
    await db.crops.clear();
    await db.cropRotations.clear();
    await db.operations.clear();
    await db.expenses.clear();
    await db.yields.clear();
  });
}
