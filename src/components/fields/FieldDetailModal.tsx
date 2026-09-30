import React from 'react';
import type { Field, FieldOperation, Expense, YieldRecord, CropRotation } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ClipboardList, RotateCw } from 'lucide-react';

interface FieldDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field | null;
  operations: FieldOperation[];
  expenses: Expense[];
  yields: YieldRecord[];
  rotations: CropRotation[];
}

export const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
  isOpen,
  onClose,
  field,
  operations,
  expenses,
  yields,
  rotations
}) => {
  if (!field) return null;

  const fieldOps = operations.filter((op) => op.fieldId === field.id);
  const fieldExpenses = expenses.filter((e) => e.fieldId === field.id);
  const fieldYields = yields.filter((y) => y.fieldId === field.id);
  const fieldRotations = rotations.filter((r) => r.fieldId === field.id);

  const totalExpense = fieldExpenses.reduce((sum, e) => sum + (e.amountInr || e.amount || 0), 0);
  const totalRevenue = fieldYields.reduce((sum, y) => sum + (y.totalRevenueInr || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Digital Farm Journal: ${field.name}`}
      subtitle={`Field Code: ${field.code} | Location: ${field.location}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Field Overview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
                Current Active Cultivation
              </div>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {field.currentCropName || 'Fallow Period'}
              </h3>
            </div>
            <Badge variant="mint" size="md">
              {field.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-3 border-t border-emerald-500/30">
            <div>
              <span className="text-emerald-200 block">Land Area</span>
              <span className="font-bold text-white text-sm">{field.sizeAcres} Acres</span>
            </div>
            <div>
              <span className="text-emerald-200 block">Soil Type</span>
              <span className="font-bold text-white text-sm">{field.soilType}</span>
            </div>
            <div>
              <span className="text-emerald-200 block">Irrigation</span>
              <span className="font-bold text-white text-sm">{field.irrigationType}</span>
            </div>
            <div>
              <span className="text-emerald-200 block">Registered Date</span>
              <span className="font-bold text-white text-sm">
                {field.createdAt ? field.createdAt.split('T')[0] : '2026-01-10'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Quick Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-0">
            <span className="text-[11px] font-bold text-amber-900 uppercase block truncate">Field Expenses</span>
            <div className="text-base md:text-lg font-black text-amber-950 mt-0.5 truncate font-mono tabular-nums">
              ₹{totalExpense.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-0">
            <span className="text-[11px] font-bold text-[#1b4332] uppercase block truncate">Harvest Revenue</span>
            <div className="text-base md:text-lg font-black text-[#1b4332] mt-0.5 truncate font-mono tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#d8f3dc] border border-[#74c69d] text-center min-w-0">
            <span className="text-[11px] font-bold text-[#1b4332] uppercase block truncate">Net Profit</span>
            <div className="text-base md:text-lg font-black text-[#1b4332] mt-0.5 truncate font-mono tabular-nums">
              ₹{netProfit.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Crop Rotation History */}
        {fieldRotations.length > 0 && (
          <div className="space-y-2 min-w-0">
            <h4 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-[#2d6a4f] shrink-0" /> Crop Rotation Lifecycle
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 space-y-2 text-xs min-w-0">
              {fieldRotations.map((r) => (
                <div key={r.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-emerald-100 pb-2 last:border-0 last:pb-0 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 font-semibold flex-wrap min-w-0">
                    <span className="text-emerald-700 truncate">{r.previousCrop}</span>
                    <span className="text-emerald-400 font-bold shrink-0">➔</span>
                    <span className="text-[#2d6a4f] font-bold truncate">{r.currentCrop}</span>
                    <span className="text-emerald-400 font-bold shrink-0">➔</span>
                    <span className="text-emerald-950 truncate">{r.nextPlannedCrop}</span>
                  </div>
                  <Badge variant="green" size="sm">
                    {r.soilHealthImpact} Soil Impact
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Field Operations Timeline */}
        <div className="space-y-2 min-w-0">
          <h4 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5 truncate">
            <ClipboardList className="w-4 h-4 text-[#2d6a4f] shrink-0" /> Operations Journal ({fieldOps.length})
          </h4>
          {fieldOps.length === 0 ? (
            <p className="text-xs text-emerald-700 italic">No operations recorded for this field yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {fieldOps.map((op) => (
                <div
                  key={op.id}
                  className="p-3 rounded-xl bg-white border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-emerald-950 truncate max-w-[200px]">{op.title}</span>
                      <Badge variant={op.status === 'Completed' ? 'green' : 'amber'} size="sm">
                        {op.status}
                      </Badge>
                    </div>
                    <p className="text-emerald-700 truncate">{op.materialDetails || op.notes || 'Routine operation'}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-bold text-emerald-900 font-mono tabular-nums">{op.operationDate}</div>
                    {op.costInr > 0 && <div className="text-emerald-800 font-medium font-mono tabular-nums">₹{op.costInr.toLocaleString('en-IN')}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field Soil & Infrastructure Notes */}
        {field.notes && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs min-w-0">
            <span className="font-bold text-[#1b4332] block mb-1">Field Journal Notes & Soil Conditioning</span>
            <p className="text-emerald-900 leading-relaxed break-words">{field.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
