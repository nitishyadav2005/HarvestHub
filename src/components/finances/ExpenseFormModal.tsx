import React, { useState, useEffect } from 'react';
import type { Field, Expense, CanonicalExpenseCategory } from '../../types';
import { Modal } from '../common/Modal';
import { Check, AlertCircle } from 'lucide-react';
import { formatINR, cleanNumber, isValidNonNegative } from '../../utils/currency';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void;
  fields: Field[];
  initialData?: Expense | null;
}

// Canonical supported expense categories as required
const SUPPORTED_EXPENSE_CATEGORIES: CanonicalExpenseCategory[] = [
  'Seeds',
  'Fertilizer',
  'Pesticides',
  'Labour',
  'Irrigation',
  'Fuel',
  'Equipment',
  'Other'
];

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData
}) => {
  const [fieldId, setFieldId] = useState<number>(fields[0]?.id || 1);
  const [fieldName, setFieldName] = useState(fields[0]?.name || '');
  const [category, setCategory] = useState<CanonicalExpenseCategory>('Fertilizer');
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState<string>('3800');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Credit / Udhar'>('UPI');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Map legacy category to canonical
  const toCanonicalCategory = (cat: string): CanonicalExpenseCategory => {
    const l = (cat || '').toLowerCase();
    if (l.includes('seed')) return 'Seeds';
    if (l.includes('fertil')) return 'Fertilizer';
    if (l.includes('pesticide') || l.includes('chemical')) return 'Pesticides';
    if (l.includes('labor') || l.includes('labour') || l.includes('wage')) return 'Labour';
    if (l.includes('irrig') || l.includes('water') || l.includes('electric')) return 'Irrigation';
    if (l.includes('fuel') || l.includes('diesel')) return 'Fuel';
    if (l.includes('machin') || l.includes('equip') || l.includes('tractor')) return 'Equipment';
    return 'Other';
  };

  useEffect(() => {
    setErrorMessage(null);
    if (initialData) {
      setFieldId(initialData.fieldId);
      setFieldName(initialData.fieldName);
      setCategory(toCanonicalCategory(initialData.category));
      setDescription(initialData.description);
      const amt = initialData.amount ?? initialData.amountInr ?? 0;
      setAmountStr(amt.toString());
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod || 'UPI');
      setReceiptNumber(initialData.receiptNumber || '');
      setNotes(initialData.notes || '');
    } else {
      if (fields.length > 0) {
        setFieldId(fields[0].id || 1);
        setFieldName(fields[0].name);
      }
      setCategory('Fertilizer');
      setDescription('DAP Fertilizer (2 Bags) & Micronutrients');
      setAmountStr('3800');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setReceiptNumber(`REC-${Math.floor(1000 + Math.random() * 9000)}`);
      setNotes('');
    }
  }, [initialData, isOpen, fields]);

  const handleFieldChange = (selectedId: number) => {
    setFieldId(selectedId);
    const f = fields.find((item) => item.id === selectedId);
    if (f) setFieldName(f.name);
  };

  const parsedAmount = cleanNumber(parseFloat(amountStr));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!description.trim()) {
      setErrorMessage('Description is required.');
      return;
    }

    if (!isValidNonNegative(amountStr) || parseFloat(amountStr) < 0) {
      setErrorMessage('Amount must be a valid non-negative number (>= ₹0).');
      return;
    }

    const finalAmount = Number(parseFloat(amountStr).toFixed(2));

    const selectedField = fields.find((f) => f.id === Number(fieldId));

    onSubmit({
      fieldId: Number(fieldId),
      fieldName,
      cropId: selectedField?.currentCropId,
      cropName: selectedField?.currentCropName,
      category,
      description: description.trim(),
      amount: finalAmount,
      amountInr: finalAmount,
      date,
      paymentMethod,
      receiptNumber: receiptNumber.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense Entry' : 'Log Farm Expense'}
      subtitle="Track inputs, labor, seeds, machinery, and irrigation costs"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Field & Category */}
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
              Expense Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CanonicalExpenseCategory)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {SUPPORTED_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Expense Item Description *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Certified Seed 50kg & Seed treatment chemical"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Amount, Date & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-emerald-900">
                Amount (₹ INR) *
              </label>
              <span className="text-[11px] font-mono font-bold text-emerald-800">
                {formatINR(parsedAmount)}
              </span>
            </div>
            <input
              type="number"
              min="0"
              step="any"
              required
              placeholder="e.g. 5000"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="UPI">UPI / GooglePay</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Net Banking</option>
              <option value="Credit / Udhar">Trader Udhar / Credit</option>
            </select>
          </div>
        </div>

        {/* Receipt No */}
        <div>
          <label className="block text-xs font-bold text-emerald-900 mb-1">
            Receipt / Bill Reference No.
          </label>
          <input
            type="text"
            placeholder="REC-2026-0901"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            className="w-full clay-inset-white px-3.5 py-2 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-emerald-100">
          <button type="button" onClick={onClose} className="clay-btn-secondary text-xs py-2 px-4 cursor-pointer text-center">
            Cancel
          </button>
          <button type="submit" className="clay-btn-primary text-xs py-2 px-4 cursor-pointer justify-center">
            <Check className="w-4 h-4" /> Save Expense Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
