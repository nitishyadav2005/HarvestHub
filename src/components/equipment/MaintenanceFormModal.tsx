import React, { useState, useEffect } from 'react';
import type { Equipment, MaintenanceRecord, MaintenanceStatus } from '../../types';
import { calculateMaintenanceStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => void;
  equipments: Equipment[];
  preselectedEquipment?: Equipment | null;
  initialData?: MaintenanceRecord | null;
}

const COMMON_MAINTENANCE_TASKS = [
  'Engine Oil & Filter Service',
  'Oil Change & Bearing Lubrication',
  'Pressure Regulator & Nozzle Replacement',
  'Seed Meter Calibration & Greasing',
  'Multi-Speed Gearbox Oil Service',
  'Impeller Cleaning & Seal Replacement',
  'Hydraulic System Fluid & Filter Flush',
  'Battery Terminal Cleaning & Voltage Check',
  'Tire Pressure & Wheel Lug Nut Torque',
  'Tine / Blade Sharpening & Hardfacing',
  'General Thorough Inspection & Greasing'
];

export const MaintenanceFormModal: React.FC<MaintenanceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  equipments,
  preselectedEquipment,
  initialData
}) => {
  const [equipmentId, setEquipmentId] = useState<number>(() => {
    return initialData?.equipmentId || preselectedEquipment?.id || equipments[0]?.id || 1;
  });
  const [equipmentName, setEquipmentName] = useState<string>(() => {
    return initialData?.equipmentName || preselectedEquipment?.name || equipments[0]?.name || '';
  });
  const [maintenanceTask, setMaintenanceTask] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<MaintenanceStatus>('Upcoming');
  const [costInr, setCostInr] = useState<number>(2000);
  const [serviceProvider, setServiceProvider] = useState<string>('');
  const [completedDate, setCompletedDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setEquipmentId(initialData.equipmentId);
      setEquipmentName(initialData.equipmentName);
      setMaintenanceTask(initialData.maintenanceTask || '');
      setScheduledDate(initialData.scheduledDate || new Date().toISOString().split('T')[0]);
      setStatus(initialData.status || 'Upcoming');
      setCostInr(initialData.costInr || 0);
      setServiceProvider(initialData.serviceProvider || '');
      setCompletedDate(initialData.completedDate || '');
      setNotes(initialData.notes || '');
    } else if (preselectedEquipment) {
      setEquipmentId(preselectedEquipment.id || 1);
      setEquipmentName(preselectedEquipment.name);
      setMaintenanceTask('');
      setScheduledDate(preselectedEquipment.nextMaintenanceDate || new Date().toISOString().split('T')[0]);
      setStatus(calculateMaintenanceStatus(preselectedEquipment.nextMaintenanceDate));
      setCostInr(preselectedEquipment.maintenanceCostInr || 2000);
      setServiceProvider('');
      setCompletedDate('');
      setNotes('');
    } else if (equipments.length > 0) {
      const defaultEq = equipments[0];
      setEquipmentId(defaultEq.id || 1);
      setEquipmentName(defaultEq.name);
      setMaintenanceTask('');
      setScheduledDate(defaultEq.nextMaintenanceDate || new Date().toISOString().split('T')[0]);
      setStatus(calculateMaintenanceStatus(defaultEq.nextMaintenanceDate));
      setCostInr(defaultEq.maintenanceCostInr || 2000);
      setServiceProvider('');
      setCompletedDate('');
      setNotes('');
    }
  }, [initialData, preselectedEquipment, equipments, isOpen]);

  // When equipment selection changes
  const handleEquipmentChange = (selectedId: number) => {
    setEquipmentId(selectedId);
    const eq = equipments.find((e) => e.id === selectedId);
    if (eq) {
      setEquipmentName(eq.name);
      if (!initialData) {
        setCostInr(eq.maintenanceCostInr || 2000);
        if (eq.nextMaintenanceDate) {
          setScheduledDate(eq.nextMaintenanceDate);
          setStatus(calculateMaintenanceStatus(eq.nextMaintenanceDate));
        }
      }
    }
  };

  const handleDateChange = (dateVal: string) => {
    setScheduledDate(dateVal);
    if (status !== 'Completed') {
      setStatus(calculateMaintenanceStatus(dateVal));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceTask.trim()) return;

    onSubmit({
      equipmentId: Number(equipmentId),
      equipmentName: equipmentName || 'Farm Equipment',
      maintenanceTask: maintenanceTask.trim(),
      scheduledDate,
      status,
      costInr: Number(costInr) || 0,
      serviceProvider: serviceProvider.trim() || undefined,
      completedDate: status === 'Completed' ? (completedDate || scheduledDate) : undefined,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Maintenance Task' : 'Schedule Equipment Maintenance'}
      subtitle="Plan preventive services, oil changes, calibrations, and tune-ups"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Equipment */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 mb-1">
            Farm Equipment *
          </label>
          <select
            value={equipmentId}
            onChange={(e) => handleEquipmentChange(Number(e.target.value))}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name} ({eq.type} - {eq.model})
              </option>
            ))}
          </select>
        </div>

        {/* Task Title & Presets */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 mb-1">
            Maintenance Task *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Engine Oil & Filter Change"
            value={maintenanceTask}
            onChange={(e) => setMaintenanceTask(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl mb-1.5"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-emerald-700 font-bold">Quick presets:</span>
            {COMMON_MAINTENANCE_TASKS.slice(0, 4).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setMaintenanceTask(preset)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
              >
                {preset.split(' ')[0]} {preset.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Date & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Scheduled Date *
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Maintenance Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                const s = e.target.value as MaintenanceStatus;
                setStatus(s);
                if (s === 'Completed' && !completedDate) {
                  setCompletedDate(new Date().toISOString().split('T')[0]);
                }
              }}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="Upcoming">Upcoming (Scheduled)</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Overdue">Overdue</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Cost & Service Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Estimated / Actual Cost (₹)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={costInr}
              onChange={(e) => setCostInr(Number(e.target.value))}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Technician / Workshop
            </label>
            <input
              type="text"
              placeholder="e.g. Authorized Dealer / Farm Crew"
              value={serviceProvider}
              onChange={(e) => setServiceProvider(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Completed Date if completed */}
        {status === 'Completed' && (
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              Completion Date
            </label>
            <input
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 mb-1">
            Notes / Parts Replaced
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Cleaned air filter, added 7L oil, greased steering tie rods..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Action Buttons */}
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
            <Check className="w-4 h-4" /> {initialData ? 'Update Schedule' : 'Schedule Maintenance'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
