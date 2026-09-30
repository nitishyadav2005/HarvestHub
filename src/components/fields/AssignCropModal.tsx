import React, { useState } from 'react';
import type { Field, Crop } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface AssignCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field | null;
  crops: Crop[];
  onAssign: (fieldId: number, cropId: number, cropName: string) => void;
}

export const AssignCropModal: React.FC<AssignCropModalProps> = ({
  isOpen,
  onClose,
  field,
  crops,
  onAssign
}) => {
  const [selectedCropId, setSelectedCropId] = useState<number>(crops[0]?.id || 1);
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!field) return null;

  const selectedCrop = crops.find((c) => c.id === Number(selectedCropId)) || crops[0];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!field.id || !selectedCrop) return;
    onAssign(field.id, selectedCrop.id!, selectedCrop.name);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Active Crop to ${field.name}`}
      subtitle={`Field Area: ${field.sizeAcres} Acres | Soil: ${field.soilType}`}
    >
      <form onSubmit={handleAssign} className="space-y-4">
        {/* Select Crop */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Select Crop Variety from Catalog *
          </label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(Number(e.target.value))}
            className="w-full clay-inset-white px-3.5 py-2.5 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.iconName || '🌱'} {c.name} ({c.season} - {c.durationDays} Days)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Crop Card Summary */}
        {selectedCrop && (
          <div className="p-3.5 rounded-2xl bg-[#d8f3dc]/70 border border-[#74c69d]/40 space-y-1.5 text-xs text-[#1b4332] min-w-0">
            <div className="font-bold text-sm flex items-center justify-between gap-2 flex-wrap min-w-0">
              <span className="truncate">{selectedCrop.name}</span>
              <span className="bg-white/70 px-2 py-0.5 rounded-md text-[11px] shrink-0 font-medium">
                {selectedCrop.category}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-900 mt-2 min-w-0">
              <div className="truncate">Ideal Soil: <span className="font-semibold">{selectedCrop.idealSoil}</span></div>
              <div className="truncate">Growing Period: <span className="font-semibold">{selectedCrop.durationDays} Days</span></div>
              <div className="truncate">Water Requirement: <span className="font-semibold">{selectedCrop.waterRequirement}</span></div>
              <div className="truncate">Target Yield: <span className="font-semibold">{selectedCrop.expectedYieldPerAcreQuintal} Qtl/Acre</span></div>
            </div>
          </div>
        )}

        {/* Planting Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Planting / Sowing Date *
            </label>
            <input
              type="date"
              required
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Estimated Target Harvest Yield
            </label>
            <div className="relative">
              <input
                type="number"
                readOnly
                value={selectedCrop ? (selectedCrop.expectedYieldPerAcreQuintal * field.sizeAcres).toFixed(0) : 0}
                className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 bg-emerald-50/50 rounded-xl"
              />
              <span className="absolute right-3 top-2 text-xs text-emerald-700 font-bold">
                Quintals Total
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Sowing Notes / Seed Batch Info
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Certified Seed Lot #908, Seed treated with Trichoderma before sowing."
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
            <Check className="w-4 h-4" /> Confirm Sowing & Assign
          </button>
        </div>
      </form>
    </Modal>
  );
};
