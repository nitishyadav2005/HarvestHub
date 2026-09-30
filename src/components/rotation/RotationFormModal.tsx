import React, { useState, useEffect } from 'react';
import type { Field, CropRotation } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface RotationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rotationData: Omit<CropRotation, 'id' | 'createdAt'>) => void;
  fields: Field[];
  initialData?: CropRotation | null;
  prefillRecommended?: { fieldName: string; currentCrop: string; recommendedCrop: string } | null;
}

export const RotationFormModal: React.FC<RotationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData,
  prefillRecommended
}) => {
  const [fieldId, setFieldId] = useState<number>(fields[0]?.id || 1);
  const [fieldName, setFieldName] = useState(fields[0]?.name || '');
  const [previousCrop, setPreviousCrop] = useState('');
  const [currentCrop, setCurrentCrop] = useState('');
  const [nextPlannedCrop, setNextPlannedCrop] = useState('');
  const [plannedPlantingDate, setPlannedPlantingDate] = useState('2027-02-15');
  const [rotationYear, setRotationYear] = useState('2026 - 2027');
  const [soilHealthImpact, setSoilHealthImpact] = useState<'Excellent' | 'Good' | 'Neutral' | 'Demanding'>('Good');
  const [nitrogenBalance, setNitrogenBalance] = useState<'Restoring (+N)' | 'Neutral' | 'Depleting (-N)'>('Restoring (+N)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setFieldId(initialData.fieldId);
      setFieldName(initialData.fieldName);
      setPreviousCrop(initialData.previousCrop);
      setCurrentCrop(initialData.currentCrop);
      setNextPlannedCrop(initialData.nextPlannedCrop);
      setPlannedPlantingDate(initialData.plannedPlantingDate);
      setRotationYear(initialData.rotationYear);
      setSoilHealthImpact(initialData.soilHealthImpact);
      setNitrogenBalance(initialData.nitrogenBalance);
      setNotes(initialData.notes || '');
    } else if (prefillRecommended) {
      const matchField = fields.find((f) => f.name === prefillRecommended.fieldName);
      if (matchField && matchField.id) {
        setFieldId(matchField.id);
        setFieldName(matchField.name);
      }
      setPreviousCrop('Wheat (HD 2967)');
      setCurrentCrop(prefillRecommended.currentCrop);
      setNextPlannedCrop(prefillRecommended.recommendedCrop);
      setPlannedPlantingDate('2027-03-01');
      setRotationYear('2026 - 2027');
      setSoilHealthImpact('Excellent');
      setNitrogenBalance('Restoring (+N)');
      setNotes('Adopted from Smart Crop Rotation Engine recommendations.');
    } else {
      if (fields.length > 0) {
        setFieldId(fields[0].id || 1);
        setFieldName(fields[0].name);
        setCurrentCrop(fields[0].currentCropName || 'Wheat (HD 2967)');
      }
      setPreviousCrop('Basmati Rice (Pusa 1121)');
      setNextPlannedCrop('Chickpea / Chana (JG 11)');
      setPlannedPlantingDate('2027-02-15');
      setRotationYear('2026 - 2027');
      setSoilHealthImpact('Good');
      setNitrogenBalance('Restoring (+N)');
      setNotes('');
    }
  }, [initialData, prefillRecommended, isOpen, fields]);

  const handleFieldChange = (selectedId: number) => {
    setFieldId(selectedId);
    const f = fields.find((item) => item.id === selectedId);
    if (f) {
      setFieldName(f.name);
      setCurrentCrop(f.currentCropName || 'Wheat');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextPlannedCrop.trim()) return;

    onSubmit({
      fieldId: Number(fieldId),
      fieldName,
      previousCrop,
      currentCrop,
      nextPlannedCrop,
      plannedPlantingDate,
      rotationYear,
      soilHealthImpact,
      nitrogenBalance,
      notes,
      status: 'Active'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Crop Rotation Plan' : 'Plan Next Crop Rotation'}
      subtitle="Define previous, current, and upcoming crop sequence for soil sustainability"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field Select */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Target Field Plot *
          </label>
          <select
            value={fieldId}
            onChange={(e) => handleFieldChange(Number(e.target.value))}
            className="w-full clay-inset-white px-3.5 py-2.5 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.soilType} - {f.sizeAcres} Acres)
              </option>
            ))}
          </select>
        </div>

        {/* Sequence Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Previous Crop *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Basmati Rice"
              value={previousCrop}
              onChange={(e) => setPreviousCrop(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Current Crop *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wheat (HD 2967)"
              value={currentCrop}
              onChange={(e) => setCurrentCrop(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-bold text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Next Planned Crop *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chickpea / Moong Dal"
              value={nextPlannedCrop}
              onChange={(e) => setNextPlannedCrop(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-bold text-[#2d6a4f] focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Dates & Soil Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Planned Planting Date *
            </label>
            <input
              type="date"
              required
              value={plannedPlantingDate}
              onChange={(e) => setPlannedPlantingDate(e.target.value)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Soil Sustainability Rating
            </label>
            <select
              value={soilHealthImpact}
              onChange={(e) => setSoilHealthImpact(e.target.value as any)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="Excellent">Excellent (+Humus)</option>
              <option value="Good">Good Sustainability</option>
              <option value="Neutral">Neutral Impact</option>
              <option value="Demanding">Heavy Feeder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Nitrogen Balance
            </label>
            <select
              value={nitrogenBalance}
              onChange={(e) => setNitrogenBalance(e.target.value as any)}
              className="w-full clay-inset-white px-3 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="Restoring (+N)">Restoring (+N Legume)</option>
              <option value="Neutral">Neutral Nitrogen</option>
              <option value="Depleting (-N)">Depleting (-N Cereal)</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Agronomic Rotation Rationale / Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Sowing legume pulse crop after cereal wheat to naturally restore soil Nitrogen reserves."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full clay-inset-white p-3 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-emerald-100">
          <button type="button" onClick={onClose} className="clay-btn-secondary text-xs py-2 px-4 cursor-pointer text-center">
            Cancel
          </button>
          <button type="submit" className="clay-btn-primary text-xs py-2 px-4 cursor-pointer justify-center">
            <Check className="w-4 h-4" /> Save Rotation Plan
          </button>
        </div>
      </form>
    </Modal>
  );
};
