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
import { DEFAULT_DEMO_USER } from '../services/authService';
import type { User } from '../types';

export const SEED_VERSION = 'harvesthub_seed_v5_auth_scoped';

export async function initializeDatabase(forceReset = false): Promise<boolean> {
  try {
    // 1. Ensure Default User (Rajesh Kumar - Green Valley Farm)
    let defaultUserId = 1;
    const userCount = await db.users.count();
    if (userCount === 0) {
      defaultUserId = (await db.users.add(DEFAULT_DEMO_USER as User)) as number;
    } else {
      const demoUser = await db.users.filter((u) => u.email === DEFAULT_DEMO_USER.email).first();
      if (demoUser && demoUser.id) {
        defaultUserId = demoUser.id;
      }
    }

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
        }
      }
    }

    if (shouldReseed) {
      console.log('Seeding IndexedDB with 4 consistent Green Valley Farm test datasets for default user...');
      await db.transaction('rw', allTables, async () => {
        await db.fields.clear();
        await db.crops.clear();
        await db.cropRotations.clear();
        await db.operations.clear();
        await db.expenses.clear();
        await db.yields.clear();
        await db.equipment.clear();
        await db.maintenance.clear();

        // Attach userId to default sample data
        const cropsWithUser = SAMPLE_CROPS.map((c) => ({ ...c, userId: defaultUserId }));
        const fieldsWithUser = SAMPLE_FIELDS.map((f) => ({ ...f, userId: defaultUserId }));
        const rotationsWithUser = SAMPLE_CROP_ROTATIONS.map((r) => ({ ...r, userId: defaultUserId }));
        const opsWithUser = SAMPLE_OPERATIONS.map((o) => ({ ...o, userId: defaultUserId }));
        const expWithUser = SAMPLE_EXPENSES.map((e) => ({ ...e, userId: defaultUserId }));
        const yieldsWithUser = SAMPLE_YIELDS.map((y) => ({ ...y, userId: defaultUserId }));
        const equipWithUser = SAMPLE_EQUIPMENT.map((eq) => ({ ...eq, userId: defaultUserId }));
        const maintWithUser = SAMPLE_MAINTENANCE.map((m) => ({ ...m, userId: defaultUserId }));

        await db.crops.bulkAdd(cropsWithUser);
        await db.fields.bulkAdd(fieldsWithUser);
        await db.cropRotations.bulkAdd(rotationsWithUser);
        await db.operations.bulkAdd(opsWithUser);
        await db.expenses.bulkAdd(expWithUser);
        await db.yields.bulkAdd(yieldsWithUser);
        await db.equipment.bulkAdd(equipWithUser);
        await db.maintenance.bulkAdd(maintWithUser);
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('harvesthub_seed_version', SEED_VERSION);
      }
      console.log('IndexedDB test seed datasets populated successfully.');
    } else {
      // Ensure any existing unassociated records get assigned to defaultUserId
      await ensureDataOwnership(defaultUserId);
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize IndexedDB database:', error);
    return false;
  }
}

/**
 * Ensures legacy records without a userId are attributed to user 1
 */
async function ensureDataOwnership(defaultUserId: number): Promise<void> {
  try {
    const unownedFields = await db.fields.filter((f) => !f.userId).toArray();
    if (unownedFields.length > 0) {
      for (const field of unownedFields) {
        if (field.id) await db.fields.update(field.id, { userId: defaultUserId });
      }
    }
    const unownedOps = await db.operations.filter((o) => !o.userId).toArray();
    if (unownedOps.length > 0) {
      for (const op of unownedOps) {
        if (op.id) await db.operations.update(op.id, { userId: defaultUserId });
      }
    }
  } catch (e) {
    console.warn('Ownership check error:', e);
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
