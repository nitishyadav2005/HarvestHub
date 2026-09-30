import { db } from '../db';
import type { Equipment, MaintenanceRecord, MaintenanceStatus } from '../types';
import { calculateMaintenanceStatus } from '../types';
import { authService } from './authService';

export interface IEquipmentService {
  getAllEquipment(userId?: number): Promise<Equipment[]>;
  getEquipmentById(id: number): Promise<Equipment | undefined>;
  addEquipment(equipment: Omit<Equipment, 'id'>): Promise<number>;
  updateEquipment(id: number, equipment: Partial<Equipment>): Promise<void>;
  deleteEquipment(id: number): Promise<void>;

  getAllMaintenance(userId?: number): Promise<MaintenanceRecord[]>;
  getMaintenanceByEquipmentId(equipmentId: number): Promise<MaintenanceRecord[]>;
  addMaintenance(maintenance: Omit<MaintenanceRecord, 'id'>): Promise<number>;
  updateMaintenance(id: number, maintenance: Partial<MaintenanceRecord>): Promise<void>;
  deleteMaintenance(id: number): Promise<void>;
  completeMaintenance(id: number, completedDate?: string): Promise<void>;
}

export class IndexedDBEquipmentService implements IEquipmentService {
  async getAllEquipment(userId?: number): Promise<Equipment[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    if (targetUserId) {
      return await db.equipment
        .filter((eq) => eq.userId === targetUserId || (!eq.userId && targetUserId === 1))
        .toArray();
    }
    return await db.equipment.toArray();
  }

  async getEquipmentById(id: number): Promise<Equipment | undefined> {
    return await db.equipment.get(id);
  }

  async addEquipment(equipment: Omit<Equipment, 'id'>): Promise<number> {
    const now = new Date().toISOString();
    const userId = equipment.userId ?? authService.getCurrentUserId() ?? 1;
    return await db.equipment.add({
      ...equipment,
      userId,
      createdAt: now,
      updatedAt: now
    } as Equipment);
  }

  async updateEquipment(id: number, equipment: Partial<Equipment>): Promise<void> {
    const now = new Date().toISOString();
    await db.equipment.update(id, {
      ...equipment,
      updatedAt: now
    });
  }

  async deleteEquipment(id: number): Promise<void> {
    await db.transaction('rw', [db.equipment, db.maintenance], async () => {
      await db.equipment.delete(id);
      // Also delete all maintenance associated with this equipment
      await db.maintenance.where('equipmentId').equals(id).delete();
    });
  }

  async getAllMaintenance(userId?: number): Promise<MaintenanceRecord[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    let records = await db.maintenance.toArray();
    if (targetUserId) {
      records = records.filter(
        (m) => m.userId === targetUserId || (!m.userId && targetUserId === 1)
      );
    }
    // Sort so upcoming & overdue come first, then latest dates
    return records.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  async getMaintenanceByEquipmentId(equipmentId: number): Promise<MaintenanceRecord[]> {
    const records = await db.maintenance.where('equipmentId').equals(equipmentId).toArray();
    return records.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }

  async addMaintenance(maintenance: Omit<MaintenanceRecord, 'id'>): Promise<number> {
    const now = new Date().toISOString();
    const userId = maintenance.userId ?? authService.getCurrentUserId() ?? 1;
    const status = maintenance.status || calculateMaintenanceStatus(maintenance.scheduledDate);
    const id = await db.maintenance.add({
      ...maintenance,
      userId,
      status,
      createdAt: now
    } as MaintenanceRecord);

    // Update equipment's nextMaintenanceDate if this scheduled date is sooner
    const eq = await db.equipment.get(maintenance.equipmentId);
    if (eq && status !== 'Completed') {
      const scheduledTime = new Date(maintenance.scheduledDate).getTime();
      const currentNextTime = eq.nextMaintenanceDate ? new Date(eq.nextMaintenanceDate).getTime() : Infinity;
      if (scheduledTime < currentNextTime) {
        await db.equipment.update(maintenance.equipmentId, {
          nextMaintenanceDate: maintenance.scheduledDate
        });
      }
    }

    return id;
  }

  async updateMaintenance(id: number, updates: Partial<MaintenanceRecord>): Promise<void> {
    const existing = await db.maintenance.get(id);
    if (!existing) return;

    const newStatus: MaintenanceStatus = updates.status || 
      (updates.completedDate ? 'Completed' : (updates.scheduledDate ? calculateMaintenanceStatus(updates.scheduledDate, existing.status) : existing.status));

    await db.maintenance.update(id, {
      ...updates,
      status: newStatus
    });
  }

  async deleteMaintenance(id: number): Promise<void> {
    await db.maintenance.delete(id);
  }

  async completeMaintenance(id: number, completedDate?: string): Promise<void> {
    const todayStr = completedDate || new Date().toISOString().split('T')[0];
    const record = await db.maintenance.get(id);
    if (!record) return;

    await db.maintenance.update(id, {
      status: 'Completed',
      completedDate: todayStr
    });

    // Update the equipment's last maintenance date and calculate next maintenance date
    const equipment = await db.equipment.get(record.equipmentId);
    if (equipment) {
      const intervalDays = equipment.maintenanceIntervalDays || 90;
      const compDateObj = new Date(todayStr);
      compDateObj.setDate(compDateObj.getDate() + intervalDays);
      const nextDateStr = compDateObj.toISOString().split('T')[0];

      await db.equipment.update(equipment.id!, {
        lastMaintenanceDate: todayStr,
        nextMaintenanceDate: nextDateStr,
        status: 'Operational'
      });
    }
  }
}

export const equipmentService: IEquipmentService = new IndexedDBEquipmentService();
