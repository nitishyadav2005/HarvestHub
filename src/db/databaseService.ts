import { db } from './index';
import {
  SAMPLE_CROPS,
  SAMPLE_FIELDS,
  SAMPLE_CROP_ROTATIONS,
  SAMPLE_OPERATIONS,
  SAMPLE_EXPENSES,
  SAMPLE_YIELDS,
  SAMPLE_EQUIPMENT,
  SAMPLE_MAINTENANCE
} from './seedData';

export const SEED_VERSION = 'harvesthub_seed_v4_four_records';

export async function initializeDatabase(forceReset = false): Promise<boolean> {
  try {
    const allTables = [
      db.fields,
      db.crops,
      db.cropRotations,
      db.operations,
      db.expenses,
      db.yields,
      db.equipment,
      db.maintenance
    ];

    let shouldReseed = forceReset;

    if (!shouldReseed) {
      const seededVersion = typeof window !== 'undefined' ? localStorage.getItem('harvesthub_seed_version') : null;
      if (seededVersion !== SEED_VERSION) {
        shouldReseed = true;
      } else {
        const fieldsCount = await db.fields.count();
        if (fieldsCount === 0) {
          shouldReseed = true;
        } else {
          // Detect outdated sample data with mismatched legacy fields or costs
          try {
            const legacyField = await db.fields.where('name').equals('Narmada Basin South').first();
            const malwaField = await db.fields.where('name').equals('Malwa Organic Patch').first();
            const legacyOp = await db.operations.filter((op) => op.costInr === 2800).first();
            if (legacyField || malwaField || legacyOp) {
              shouldReseed = true;
            }
          } catch (e) {
            console.warn('Legacy data check exception, triggering reseed:', e);
            shouldReseed = true;
          }
        }
      }
    }

    if (shouldReseed) {
      console.log('Seeding IndexedDB with 4 consistent Green Valley Farm test datasets...');
      await db.transaction('rw', allTables, async () => {
        await db.fields.clear();
        await db.crops.clear();
        await db.cropRotations.clear();
        await db.operations.clear();
        await db.expenses.clear();
        await db.yields.clear();
        await db.equipment.clear();
        await db.maintenance.clear();

        await db.crops.bulkAdd(SAMPLE_CROPS);
        await db.fields.bulkAdd(SAMPLE_FIELDS);
        await db.cropRotations.bulkAdd(SAMPLE_CROP_ROTATIONS);
        await db.operations.bulkAdd(SAMPLE_OPERATIONS);
        await db.expenses.bulkAdd(SAMPLE_EXPENSES);
        await db.yields.bulkAdd(SAMPLE_YIELDS);
        await db.equipment.bulkAdd(SAMPLE_EQUIPMENT);
        await db.maintenance.bulkAdd(SAMPLE_MAINTENANCE);
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('harvesthub_seed_version', SEED_VERSION);
      }
      console.log('IndexedDB 4 test seed datasets populated successfully.');
    } else {
      // Check if equipment needs seeding
      const equipCount = await db.equipment.count();
      if (equipCount === 0) {
        await db.transaction('rw', [db.equipment, db.maintenance], async () => {
          await db.equipment.bulkAdd(SAMPLE_EQUIPMENT);
          await db.maintenance.bulkAdd(SAMPLE_MAINTENANCE);
        });
        console.log('IndexedDB equipment tables seeded.');
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize IndexedDB database:', error);
    return false;
  }
}

export async function clearAllData(): Promise<void> {
  const allTables = [
    db.fields,
    db.crops,
    db.cropRotations,
    db.operations,
    db.expenses,
    db.yields,
    db.equipment,
    db.maintenance
  ];
  await db.transaction('rw', allTables, async () => {
    await db.fields.clear();
    await db.crops.clear();
    await db.cropRotations.clear();
    await db.operations.clear();
    await db.expenses.clear();
    await db.yields.clear();
    await db.equipment.clear();
    await db.maintenance.clear();
  });
}
