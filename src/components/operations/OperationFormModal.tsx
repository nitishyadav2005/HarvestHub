import React, { useState, useEffect } from 'react';
import type { Field, FieldOperation, OperationType, OperationStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface OperationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (operationData: Omit<FieldOperation, 'id'>) => void;
  fields: Field[];
  initialData?: FieldOperation | null;
}

const OPERATION_TYPES: OperationType[] = [
  'Sowing',
  'Tillage',
  'Irrigation',
  'Fertilization',
  'Pest Control',
  'Weeding',
  'Harvesting',
  'Post-Harvest Handling'
];

export const OperationFormModal: React.FC<OperationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData
}) => {
  const [fieldId, setFieldId] = useState<number>(fields[0]?.id || 1);
  const [fieldName, setFieldName] = useState(fields[0]?.name || '');
  const [operationType, setOperationType] = useState<OperationType>('Fertilization');
  const [title, setTitle] = useState('');
  const [operationDate, setOperationDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<OperationStatus>('Scheduled');
  const [costInr, setCostInr] = useState<number>(2500);
  const [materialDetails, setMaterialDetails] = useState('');
  const [laborCount, setLaborCount] = useState<number>(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setFieldId(initialData.fieldId);
      setFieldName(initialData.fieldName);
      setOperationType(initialData.operationType);
      setTitle(initialData.title);
      setOperationDate(initialData.operationDate);
      setStatus(initialData.status);
      setCostInr(initialData.costInr);
      setMaterialDetails(initialData.materialDetails || '');
      setLaborCount(initialData.laborCount || 2);
      setNotes(initialData.notes || '');
    } else {
      if (fields.length > 0) {
        setFieldId(fields[0].id || 1);
        setFieldName(fields[0].name);
      }
      setOperationType('Fertilization');
      setTitle('Neem Coated Urea & Micro-Nutrients Application');
      setOperationDate(new Date().toISOString().split('T')[0]);
      setStatus('Scheduled');
      setCostInr(2500);
      setMaterialDetails('Urea (50 kg), Zinc Sulphate (5 kg)');
      setLaborCount(2);
      setNotes('');
    }
  }, [initialData, isOpen, fields]);

  const handleFieldChange = (selectedId: number) => {
    setFieldId(selectedId);
    const f = fields.find((item) => item.id === selectedId);
    if (f) {
      setFieldName(f.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      fieldId: Number(fieldId),
      fieldName,
      operationType,
      title,
      operationDate,
      status,
      costInr: Number(costInr),
      materialDetails,
      laborCount: Number(laborCount),
      notes,
      completedDate: status === 'Completed' ? operationDate : undefined
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Field Operation' : 'Log New Field Operation'}
      subtitle="Record sowing, fertilization, pest control, or harvest activities"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Select Field Plot *
            </label>
            <select
              value={fieldId}
              onChange={(e) => handleFieldChange(Number(e.target.value))}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.currentCropName || 'Fallow'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Operation Category *
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as OperationType)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {OPERATION_TYPES.map((ot) => (
                <option key={ot} value={ot}>
                  {ot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Operation Title */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Activity Title / Description *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Drip Fertigation & Neem Spraying"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Date, Status & Cost */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Activity Date *
            </label>
            <input
              type="date"
              required
              value={operationDate}
              onChange={(e) => setOperationDate(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OperationStatus)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Estimated / Actual Cost (₹)
            </label>
            <input
              type="number"
              min="0"
              value={costInr}
              onChange={(e) => setCostInr(parseFloat(e.target.value) || 0)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Inputs & Labor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Material Inputs / Machinery Used
            </label>
            <input
              type="text"
              placeholder="e.g. DAP 100kg, Neem oil 2L, Power Sprayer"
              value={materialDetails}
              onChange={(e) => setMaterialDetails(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Workers Deployed
            </label>
            <input
              type="number"
              min="0"
              value={laborCount}
              onChange={(e) => setLaborCount(parseInt(e.target.value) || 0)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Operation Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Conducted during morning light wind conditions."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full clay-inset-white p-3 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-100">
          <button type="button" onClick={onClose} className="clay-btn-secondary text-xs">
            Cancel
          </button>
          <button type="submit" className="clay-btn-primary text-xs">
            <Check className="w-4 h-4" /> Save Operation
          </button>
        </div>
      </form>
    </Modal>
  );
};
