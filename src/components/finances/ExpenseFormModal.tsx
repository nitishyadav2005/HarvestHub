import React, { useState, useEffect } from 'react';
import type { Field, Expense, ExpenseCategory } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void;
  fields: Field[];
  initialData?: Expense | null;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Seeds',
  'Fertilizers',
  'Pesticides & Chemicals',
  'Labor & Wages',
  'Machinery & Fuel',
  'Irrigation & Electricity',
  'Transportation & Mandi Fee',
  'Miscellaneous'
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
  const [category, setCategory] = useState<ExpenseCategory>('Fertilizers');
  const [description, setDescription] = useState('');
  const [amountInr, setAmountInr] = useState<number>(4500);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Credit / Udhar'>('UPI');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setFieldId(initialData.fieldId);
      setFieldName(initialData.fieldName);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setAmountInr(initialData.amountInr ?? initialData.amount ?? 0);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
      setReceiptNumber(initialData.receiptNumber || '');
      setNotes(initialData.notes || '');
    } else {
      if (fields.length > 0) {
        setFieldId(fields[0].id || 1);
        setFieldName(fields[0].name);
      }
      setCategory('Fertilizers');
      setDescription('DAP Fertilizers (2 Bags) & Micronutrients');
      setAmountInr(3800);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      fieldId: Number(fieldId),
      fieldName,
      category,
      description,
      amountInr: Number(amountInr),
      amount: Number(amountInr),
      date,
      paymentMethod,
      receiptNumber,
      notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense Entry' : 'Log Farm Expense'}
      subtitle="Track inputs, labor, seeds, machinery, and power costs"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
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
            onChange={(e) => setDescription(e.target.value)}
            className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Amount, Date & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-900 mb-1">
              Amount (₹ INR) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={amountInr}
              onChange={(e) => setAmountInr(parseFloat(e.target.value) || 0)}
              className="w-full clay-inset-white px-3.5 py-2 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
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
