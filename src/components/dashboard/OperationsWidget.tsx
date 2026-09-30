import React from 'react';
import type { FieldOperation } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface OperationsWidgetProps {
  operations: FieldOperation[];
  onCompleteOp: (id: number) => void;
  onNavigateToOperations: () => void;
}

export const OperationsWidget: React.FC<OperationsWidgetProps> = ({
  operations,
  onCompleteOp,
  onNavigateToOperations
}) => {
  const upcomingOps = operations
    .filter(op => op.status !== 'Completed')
    .slice(0, 4);

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-[#1b4332] flex items-center gap-2 truncate">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#2d6a4f] shrink-0" /> Upcoming Operations
          </h3>
          <p className="text-xs text-emerald-800/80 truncate">Scheduled field activities requiring action</p>
        </div>
        <button
          onClick={onNavigateToOperations}
          className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 transition-colors shrink-0 cursor-pointer ml-2"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        {upcomingOps.length === 0 ? (
          <div className="text-center py-8 text-emerald-700 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-70" />
            No pending operations! All field activities up to date.
          </div>
        ) : (
          upcomingOps.map((op) => (
            <div
              key={op.id}
              className="p-3 sm:p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-xs min-w-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <Badge
                    variant={
                      op.status === 'Completed'
                        ? 'green'
                        : op.status === 'In Progress'
                        ? 'blue'
                        : op.status === 'Delayed'
                        ? 'red'
                        : 'green'
                    }
                    size="sm"
                  >
                    {op.operationType}
                  </Badge>
                  {op.status === 'Delayed' && (
                    <Badge variant="red" size="sm">
                      Delayed
                    </Badge>
                  )}
                  {op.status === 'In Progress' && (
                    <Badge variant="blue" size="sm">
                      In Progress
                    </Badge>
                  )}
                  <span className="text-xs font-semibold text-emerald-900 truncate max-w-[200px]">
                    {op.fieldName} {op.cropName ? `• ${op.cropName}` : ''}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{op.title}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-emerald-800 flex-wrap">
                  <span className="flex items-center gap-1 font-medium font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {op.operationDate}
                  </span>
                  {op.costInr > 0 && (
                    <span className="font-semibold text-emerald-950 font-mono tabular-nums">
                      ₹{op.costInr.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {op.id && (
                <button
                  onClick={() => onCompleteOp(op.id!)}
                  className="px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center justify-center gap-1 transition-all shrink-0 shadow-xs cursor-pointer self-end sm:self-center"
                  title="Mark as completed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" /> Done
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </ClayCard>
  );
};
