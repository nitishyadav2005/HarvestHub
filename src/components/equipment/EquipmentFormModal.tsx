import React, { useState, useEffect } from 'react';
import type { Equipment, EquipmentStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Equipment | null;
}

const COMMON_EQUIPMENT_TYPES = [
  'Tractor',
  'Water Pump',
  'Seed Drill',
  'Sprayer',
  'Rotavator',
  'Power Tiller',
  'Harvester / Combine',
  'Laser Land Leveler',
  'Cultivator / Plough',
  'Trailer / Trolley',
  'Drip Filtration Unit'
];

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Tractor');
  const [model, setModel] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<EquipmentStatus>('Operational');
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [maintenanceIntervalDays, setMaintenanceIntervalDays] = useState<number>(90);
  const [maintenanceCostInr, setMaintenanceCostInr] = useState<number>(2500);
  const [notes, setNotes] = useState('');

  // Sync state with initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || 'Tractor');
      setModel(initialData.model || '');
      setPurchaseDate(initialData.purchaseDate || new Date().toISOString().split('T')[0]);
      setStatus(initialData.status || 'Operational');
      setLastMaintenanceDate(initialData.lastMaintenanceDate || new Date().toISOString().split('T')[0]);
      setNextMaintenanceDate(initialData.nextMaintenanceDate || '');
      setMaintenanceIntervalDays(initialData.maintenanceIntervalDays || 90);
      setMaintenanceCostInr(initialData.maintenanceCostInr || 2500);
      setNotes(initialData.notes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      const defaultNext = new Date();
      defaultNext.setDate(defaultNext.getDate() + 90);
      const nextStr = defaultNext.toISOString().split('T')[0];

      setName('');
      setType('Tractor');
      setModel('');
      setPurchaseDate(today);
      setStatus('Operational');
      setLastMaintenanceDate(today);
      setNextMaintenanceDate(nextStr);
      setMaintenanceIntervalDays(90);
      setMaintenanceCostInr(2500);
      setNotes('');
    }
  }, [initialData, isOpen]);

  // Auto-calculate next maintenance date when last maintenance date or interval changes
  const handleRecalculateNextDate = (lastDate: string, interval: number) => {
    if (!lastDate) return;
    try {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + Number(interval));
      setNextMaintenanceDate(d.toISOString().split('T')[0]);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      type: type.trim(),
      model: model.trim() || 'Standard Model',
      purchaseDate,
      status,
      lastMaintenanceDate,
      nextMaintenanceDate: nextMaintenanceDate || lastMaintenanceDate,
      maintenanceIntervalDays: Number(maintenanceIntervalDays) || 90,
      maintenanceCostInr: Number(maintenanceCostInr) || 0,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Farm Equipment' : 'Add New Farm Equipment'}
      subtitle="Register machine specifications, maintenance schedules, and service intervals"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Equipment Name & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Equipment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mahindra 575 DI Tractor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Model / Specification
            </label>
            <input
              type="text"
              placeholder="e.g. 47 HP Power Steering"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Equipment Type & Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Equipment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {COMMON_EQUIPMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Current Operating Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="Operational">Operational (Field Ready)</option>
              <option value="Needs Attention">Needs Attention / Inspection</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="In Storage">In Storage (Off-season)</option>
            </select>
          </div>
        </div>

        {/* Purchase Date & Maintenance Interval */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Maintenance Interval (Days)
            </label>
            <input
              type="number"
              min="1"
              max="730"
              value={maintenanceIntervalDays}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaintenanceIntervalDays(val);
                handleRecalculateNextDate(lastMaintenanceDate, val);
              }}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Avg Service Cost (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={maintenanceCostInr}
              onChange={(e) => setMaintenanceCostInr(Number(e.target.value))}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Last Maintenance Date & Next Maintenance Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Last Serviced Date
            </label>
            <input
              type="date"
              value={lastMaintenanceDate}
              onChange={(e) => {
                setLastMaintenanceDate(e.target.value);
                handleRecalculateNextDate(e.target.value, maintenanceIntervalDays);
              }}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Next Scheduled Maintenance
            </label>
            <input
              type="date"
              required
              value={nextMaintenanceDate}
              onChange={(e) => setNextMaintenanceDate(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 mb-1">
            Equipment Notes & Guidelines
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Engine oil spec 15W-40, check tire pressure 14 psi rear / 22 psi front..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-emerald-100">
          <button
            type="button"
            onClick={onClose}
            className="clay-btn-secondary text-xs py-2 px-4 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="clay-btn-primary text-xs py-2 px-5 cursor-pointer justify-center"
          >
            <Check className="w-4 h-4" /> {initialData ? 'Update Machine' : 'Save Equipment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
