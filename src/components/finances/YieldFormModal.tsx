import React, { useState, useEffect } from 'react';
import type { Field, YieldRecord, YieldQualityGrade } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface YieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (yieldData: Omit<YieldRecord, 'id'>) => void;
  fields: Field[];
  initialData?: YieldRecord | null;
}

const QUALITY_GRADES: YieldQualityGrade[] = [
  'Grade A (Premium)',
  'Grade B (Standard)',
  'Grade C (Fair)'
];

export const YieldFormModal: React.FC<YieldFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData
}) => {
  const [fieldId, setFieldId] = useState<number>(fields[0]?.id || 1);
  const [fieldName, setFieldName] = useState(fields[0]?.name || '');
  const [cropName, setCropName] = useState(fields[0]?.currentCropName || 'Wheat (HD 2967)');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantityQuintals, setQuantityQuintals] = useState<number>(85);
  const [pricePerQuintalInr, setPricePerQuintalInr] = useState<number>(2275);
  const [buyerName, setBuyerName] = useState('Khanna APMC Mandi');
  const [qualityGrade, setQualityGrade] = useState<YieldQualityGrade>('Grade A (Premium)');
  const [storageLocation, setStorageLocation] = useState('Warehouse Bay 2');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setFieldId(initialData.fieldId);
      setFieldName(initialData.fieldName);
      setCropName(initialData.cropName);
      setHarvestDate(initialData.harvestDate);
      setQuantityQuintals(initialData.quantityQuintals);
      setPricePerQuintalInr(initialData.pricePerQuintalInr);
      setBuyerName(initialData.buyerName || '');
      setQualityGrade(initialData.qualityGrade);
      setStorageLocation(initialData.storageLocation || '');
      setNotes(initialData.notes || '');
    } else {
      if (fields.length > 0) {
        setFieldId(fields[0].id || 1);
        setFieldName(fields[0].name);
        setCropName(fields[0].currentCropName || 'Wheat (HD 2967)');
      }
      setHarvestDate(new Date().toISOString().split('T')[0]);
      setQuantityQuintals(85);
      setPricePerQuintalInr(2275);
      setBuyerName('APMC Mandi Procurement Center');
      setQualityGrade('Grade A (Premium)');
      setStorageLocation('Direct Mandi Sale');
      setNotes('');
    }
  }, [initialData, isOpen, fields]);

  const handleFieldChange = (selectedId: number) => {
    setFieldId(selectedId);
    const f = fields.find((item) => item.id === selectedId);
    if (f) {
      setFieldName(f.name);
      if (f.currentCropName) setCropName(f.currentCropName);
    }
  };

  const totalRevenue = (quantityQuintals || 0) * (pricePerQuintalInr || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    onSubmit({
      fieldId: Number(fieldId),
      fieldName,
      cropName,
      harvestDate,
      quantityQuintals: Number(quantityQuintals),
      pricePerQuintalInr: Number(pricePerQuintalInr),
      totalRevenueInr: totalRevenue,
      buyerName,
      qualityGrade,
      storageLocation,
      notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Harvest Yield Record' : 'Log Harvest & Mandi Yield'}
      subtitle="Record harvest output, Mandi sale price, and gross crop revenue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field & Crop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Field Plot *
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
              Harvested Crop Variety *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Basmati Rice (Pusa 1121)"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Harvest Date & Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Harvest Date *
            </label>
            <input
              type="date"
              required
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Quality Grade
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as YieldQualityGrade)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {QUALITY_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity & Price per Quintal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Quantity Harvested *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(parseFloat(e.target.value) || 0)}
                className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
              />
              <span className="absolute right-3 top-2 text-xs text-emerald-700 font-bold">
                Quintals
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Sale Price / Quintal (₹) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={pricePerQuintalInr}
              onChange={(e) => setPricePerQuintalInr(parseFloat(e.target.value) || 0)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Calculated Total Revenue
            </label>
            <div className="clay-card-mint px-3.5 py-2 rounded-xl text-center">
              <span className="text-sm font-black text-[#1b4332]">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Buyer & Storage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Buyer / Mandi Trader Name
            </label>
            <input
              type="text"
              placeholder="e.g. Khanna APMC Mandi / Local Trader"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Storage Location
            </label>
            <input
              type="text"
              placeholder="e.g. Silo 3 / Farm Store Shed"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Harvest Moisture & Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Grain moisture at harvest was 13%. Achieved premium rate at Mandi."
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
            <Check className="w-4 h-4" /> Save Harvest Yield Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
