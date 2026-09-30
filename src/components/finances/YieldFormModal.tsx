import React, { useState, useEffect } from 'react';
import type { Field, YieldRecord, YieldQualityGrade } from '../../types';
import { Modal } from '../common/Modal';
import { Check, AlertCircle } from 'lucide-react';
import { formatINR, cleanNumber, isValidNonNegative } from '../../utils/currency';

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

const YIELD_UNITS = [
  { value: 'quintal', label: 'Quintal (100 kg)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'tonne', label: 'Metric Tonne (1,000 kg)' }
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
  const [quantityStr, setQuantityStr] = useState<string>('85');
  const [unit, setUnit] = useState<string>('quintal');
  const [sellingPriceStr, setSellingPriceStr] = useState<string>('2275');
  const [buyerName, setBuyerName] = useState('Khanna APMC Mandi');
  const [qualityGrade, setQualityGrade] = useState<YieldQualityGrade>('Grade A (Premium)');
  const [storageLocation, setStorageLocation] = useState('Warehouse Bay 2');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    if (initialData) {
      setFieldId(initialData.fieldId);
      setFieldName(initialData.fieldName);
      setCropName(initialData.cropName);
      setHarvestDate(initialData.harvestDate);
      const qty = initialData.quantity ?? initialData.quantityQuintals ?? 0;
      setQuantityStr(qty.toString());
      setUnit(initialData.unit || 'quintal');
      const price = initialData.sellingPrice ?? initialData.pricePerQuintalInr ?? 0;
      setSellingPriceStr(price.toString());
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
      setQuantityStr('85');
      setUnit('quintal');
      setSellingPriceStr('2275');
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

  const parsedQty = cleanNumber(parseFloat(quantityStr));
  const parsedPrice = cleanNumber(parseFloat(sellingPriceStr));
  // Requirement 2: Revenue = Quantity * Selling Price
  const calculatedRevenue = Number((parsedQty * parsedPrice).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!cropName.trim()) {
      setErrorMessage('Harvested Crop Variety is required.');
      return;
    }

    if (!isValidNonNegative(quantityStr) || parseFloat(quantityStr) < 0) {
      setErrorMessage('Harvested quantity must be a non-negative number (>= 0).');
      return;
    }

    if (!isValidNonNegative(sellingPriceStr) || parseFloat(sellingPriceStr) < 0) {
      setErrorMessage('Selling price must be a non-negative number (>= 0).');
      return;
    }

    const finalQty = Number(parseFloat(quantityStr).toFixed(2));
    const finalPrice = Number(parseFloat(sellingPriceStr).toFixed(2));
    const finalRev = Number((finalQty * finalPrice).toFixed(2));

    const selectedField = fields.find((f) => f.id === Number(fieldId));

    onSubmit({
      fieldId: Number(fieldId),
      fieldName,
      cropId: selectedField?.currentCropId,
      cropName: cropName.trim(),
      harvestDate,
      quantity: finalQty,
      quantityQuintals: unit === 'quintal' ? finalQty : (unit === 'kg' ? finalQty / 100 : finalQty * 10),
      unit,
      sellingPrice: finalPrice,
      pricePerQuintalInr: unit === 'quintal' ? finalPrice : (unit === 'kg' ? finalPrice * 100 : finalPrice / 10),
      totalRevenueInr: finalRev,
      buyerName: buyerName.trim(),
      qualityGrade,
      storageLocation: storageLocation.trim(),
      notes: notes.trim()
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
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

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
              onChange={(e) => {
                setCropName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
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

        {/* Quantity, Unit & Selling Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Quantity Harvested *
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="e.g. 2000"
                value={quantityStr}
                onChange={(e) => {
                  setQuantityStr(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl font-mono"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="clay-inset-white px-2 py-2 text-xs font-bold text-emerald-950 rounded-xl"
              >
                {YIELD_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Selling Price (₹ per {unit}) *
            </label>
            <input
              type="number"
              min="0"
              step="any"
              required
              placeholder="e.g. 40"
              value={sellingPriceStr}
              onChange={(e) => {
                setSellingPriceStr(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Calculated Revenue (₹)
            </label>
            <div className="clay-card-mint px-3.5 py-2 rounded-xl text-center flex flex-col justify-center">
              <span className="text-sm font-black text-[#1b4332] font-mono tabular-nums">
                {formatINR(calculatedRevenue)}
              </span>
              <span className="text-[10px] text-emerald-700">
                {parsedQty} {unit} × ₹{parsedPrice}/{unit}
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
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-emerald-100">
          <button type="button" onClick={onClose} className="clay-btn-secondary text-xs py-2 px-4 cursor-pointer text-center">
            Cancel
          </button>
          <button type="submit" className="clay-btn-primary text-xs py-2 px-4 cursor-pointer justify-center">
            <Check className="w-4 h-4" /> Save Harvest Yield Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
