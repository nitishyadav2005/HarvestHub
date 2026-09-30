import React from 'react';
import type { FieldOperation } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { Calendar, CheckCircle2, Edit, Trash2, Users, IndianRupee } from 'lucide-react';

interface OperationCardProps {
  operation: FieldOperation;
  onEdit: (op: FieldOperation) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

export const OperationCard: React.FC<OperationCardProps> = ({
  operation,
  onEdit,
  onDelete,
  onComplete
}) => {
  const isCompleted = operation.status === 'Completed';

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={
                  isCompleted
                    ? 'green'
                    : operation.status === 'In Progress'
                    ? 'blue'
                    : operation.status === 'Delayed'
                    ? 'red'
                    : 'amber'
                }
                size="sm"
              >
                {operation.operationType}
              </Badge>
              <span className="text-xs font-semibold text-emerald-900 truncate">
                {operation.fieldName} {operation.cropName ? `• ${operation.cropName}` : ''}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{operation.title}</h3>
          </div>

          <Badge
            variant={
              isCompleted
                ? 'green'
                : operation.status === 'In Progress'
                ? 'blue'
                : operation.status === 'Delayed'
                ? 'red'
                : 'amber'
            }
            size="sm"
          >
            {operation.status}
          </Badge>
        </div>

        {/* Operation Details */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 space-y-2 text-xs mb-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-emerald-100/60">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Field</span>
              <span className="font-bold text-[#1b4332] truncate block">{operation.fieldName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Crop</span>
              <span className="font-bold text-[#2d6a4f] truncate block">{operation.cropName || 'Fallow / Unassigned'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {isCompleted ? 'Completed Date:' : 'Scheduled Date:'}
            </span>
            <span className="font-bold text-emerald-950">
              {isCompleted ? (operation.completedDate || operation.operationDate) : operation.operationDate}
            </span>
          </div>

          {operation.costInr > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Operation Cost:
              </span>
              <span className="font-black text-[#1b4332]">
                ₹{operation.costInr.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {operation.laborCount && operation.laborCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Field Workers:
              </span>
              <span className="font-semibold text-emerald-900">{operation.laborCount} Persons</span>
            </div>
          )}

          {operation.materialDetails && (
            <div className="pt-2 border-t border-emerald-100 text-emerald-950">
              <span className="font-bold block text-emerald-900 text-[11px] mb-0.5">Inputs Used:</span>
              <p className="text-emerald-800 text-xs leading-relaxed">{operation.materialDetails}</p>
            </div>
          )}
        </div>

        {operation.notes && (
          <p className="text-xs text-emerald-800/80 italic line-clamp-2 mb-3 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
            <span className="font-bold not-italic text-emerald-900 text-[10px] block uppercase mb-0.5">Notes:</span>
            "{operation.notes}"
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
        {!isCompleted && operation.id ? (
          <button
            onClick={() => onComplete(operation.id!)}
            className="px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center gap-1 transition-all shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" /> Mark Completed
          </button>
        ) : (
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Logged on {operation.completedDate || operation.operationDate}
          </span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(operation)}
            className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Edit Operation"
          >
            <Edit className="w-4 h-4" />
          </button>
          {operation.id && (
            <button
              onClick={() => onDelete(operation.id!)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Operation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </ClayCard>
  );
};
