import React, { useState, useEffect } from 'react';
import type { Field, SoilType, IrrigationType } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fieldData: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Field | null;
}

const SOIL_TYPES: SoilType[] = [
  'Black Clay Soil',
  'Alluvial Soil',
  'Loamy Soil',
  'Red Soil',
  'Sandy Loam',
  'Clay Loam'
];

const IRRIGATION_TYPES: IrrigationType[] = [
  'Drip Irrigation',
  'Sprinkler System',
  'Canal / Flood',
  'Borewell Rain gun',
  'Rainfed'
];

export const FieldFormModal: React.FC<FieldFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sizeAcres, setSizeAcres] = useState<number>(3.5);
  const [soilType, setSoilType] = useState<SoilType>('Black Clay Soil');
  const [irrigationType, setIrrigationType] = useState<IrrigationType>('Drip Irrigation');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'Active' | 'Fallow' | 'Preparing'>('Active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setSizeAcres(initialData.sizeAcres || 3.5);
      setSoilType(initialData.soilType || 'Black Clay Soil');
      setIrrigationType(initialData.irrigationType || 'Drip Irrigation');
      setLocation(initialData.location || '');
      setStatus(initialData.status || 'Active');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setCode(`FLD-${Math.floor(100 + Math.random() * 900)}`);
      setSizeAcres(3.5);
      setSoilType('Black Clay Soil');
      setIrrigationType('Drip Irrigation');
      setLocation('');
      setStatus('Active');
      setNotes('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      code: code || `FLD-${Math.floor(100 + Math.random() * 900)}`,
      sizeAcres: Number(sizeAcres),
      soilType,
      irrigationType,
      location,
      status,
      notes,
      currentCropId: initialData?.currentCropId,
      currentCropName: initialData?.currentCropName
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Field Specifications' : 'Add New Farm Plot'}
      subtitle="Register land size, soil composition, and irrigation infrastructure"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Field Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kisanpura North Plot A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Field Code
            </label>
            <input
              type="text"
              required
              placeholder="KPN-01"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Size, Soil & Irrigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Area Size (Acres) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={sizeAcres}
                onChange={(e) => setSizeAcres(parseFloat(e.target.value) || 0)}
                className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
              />
              <span className="absolute right-3 top-2 text-xs text-emerald-700 font-bold">
                Acres
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Soil Profile *
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as SoilType)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {SOIL_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Irrigation Type *
            </label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value as IrrigationType)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {IRRIGATION_TYPES.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Location / Village Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Karnal Agro Belt, Sector 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Plot Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="Active">Active Cultivation</option>
              <option value="Preparing">Preparing Field</option>
              <option value="Fallow">Fallow / Rest Period</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Soil Conditioning & Field Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Sub-surface drip pipe installed. Applied organic vermicompost in 2026."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full clay-inset-white p-3 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-100">
          <button
            type="button"
            onClick={onClose}
            className="clay-btn-secondary text-xs"
          >
            Cancel
          </button>
          <button type="submit" className="clay-btn-primary text-xs">
            <Check className="w-4 h-4" /> {initialData ? 'Update Field' : 'Save New Field'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
