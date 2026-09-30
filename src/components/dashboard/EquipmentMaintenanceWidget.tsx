import React from 'react';
import type { Equipment, MaintenanceRecord } from '../../types';
import { calculateMaintenanceStatus } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface EquipmentMaintenanceWidgetProps {
  equipments: Equipment[];
  maintenanceRecords: MaintenanceRecord[];
  onCompleteMaintenance: (id: number) => void;
  onNavigateToEquipment: () => void;
}

export const EquipmentMaintenanceWidget: React.FC<EquipmentMaintenanceWidgetProps> = ({
  maintenanceRecords,
  onCompleteMaintenance,
  onNavigateToEquipment
}) => {
  // Sort records: Overdue first, then Due Soon, then Upcoming, then Recently Completed
  const activeRecords = maintenanceRecords.filter(
    (m) => m.status !== 'Completed' && !m.completedDate
  );

  const completedRecords = maintenanceRecords
    .filter((m) => m.status === 'Completed' || Boolean(m.completedDate))
    .slice(0, 2);

  // Group or prioritize top pending tasks
  const prioritizedPending = [...activeRecords].sort((a, b) => {
    const statusScore = { Overdue: 0, 'Due Soon': 1, Upcoming: 2, Completed: 3 };
    const aScore = statusScore[a.status] ?? 2;
    const bScore = statusScore[b.status] ?? 2;
    if (aScore !== bScore) return aScore - bScore;
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  const displayList = [...prioritizedPending.slice(0, 3), ...completedRecords.slice(0, 1)];

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1b4332] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#2d6a4f]" /> Equipment Maintenance
          </h3>
          <p className="text-xs text-emerald-800/80">
            Machinery service schedules, due dates & completed logs
          </p>
        </div>
        <button
          onClick={onNavigateToEquipment}
          className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 transition-colors"
        >
          View Fleet <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 space-y-3">
        {displayList.length === 0 ? (
          <div className="text-center py-8 text-emerald-700 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-70" />
            All farm machinery is in prime working order!
          </div>
        ) : (
          displayList.map((rec) => {
            const isCompleted = rec.status === 'Completed' || Boolean(rec.completedDate);
            const status = isCompleted ? 'Completed' : calculateMaintenanceStatus(rec.scheduledDate, rec.status);

            const getBadge = () => {
              if (status === 'Overdue') {
                return (
                  <Badge variant="red" size="sm">
                    <AlertTriangle className="w-3 h-3 text-red-700 mr-0.5" /> Overdue
                  </Badge>
                );
              }
              if (status === 'Due Soon') {
                return (
                  <Badge variant="amber" size="sm">
                    <AlertCircle className="w-3 h-3 text-amber-800 mr-0.5" /> Due Soon
                  </Badge>
                );
              }
              if (status === 'Completed') {
                return (
                  <Badge variant="mint" size="sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700 mr-0.5" /> Completed
                  </Badge>
                );
              }
              return (
                <Badge variant="green" size="sm">
                  <Clock className="w-3 h-3 text-emerald-800 mr-0.5" /> Upcoming
                </Badge>
              );
            };

            return (
              <div
                key={rec.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-xs ${
                  status === 'Overdue'
                    ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                    : status === 'Due Soon'
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    : 'bg-[#f8faf8] border-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {getBadge()}
                    <span className="text-xs font-semibold text-emerald-900 truncate">
                      Equipment: <span className="font-bold text-[#1b4332]">{rec.equipmentName}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    Maintenance: {rec.maintenanceTask}
                  </h4>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-emerald-800">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {isCompleted
                        ? `Completed: ${rec.completedDate || rec.scheduledDate}`
                        : `Due: ${rec.scheduledDate}`}
                    </span>
                    {rec.costInr > 0 && (
                      <span className="font-semibold text-emerald-950">
                        ₹{rec.costInr.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {!isCompleted && rec.id && (
                  <button
                    onClick={() => onCompleteMaintenance(rec.id!)}
                    className="px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center gap-1 transition-all shrink-0 shadow-xs"
                    title="Mark as completed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" /> Done
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </ClayCard>
  );
};
