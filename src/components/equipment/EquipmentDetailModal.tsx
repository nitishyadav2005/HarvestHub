import React from 'react';
import type { Equipment, MaintenanceRecord } from '../../types';
import { calculateMaintenanceStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ShieldCheck,
  IndianRupee,
  AlertCircle
} from 'lucide-react';

interface EquipmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  maintenanceHistory: MaintenanceRecord[];
  onOpenSchedule: (eq: Equipment) => void;
  onCompleteMaintenance: (id: number) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  isOpen,
  onClose,
  equipment,
  maintenanceHistory,
  onOpenSchedule,
  onCompleteMaintenance
}) => {
  if (!equipment) return null;

  const maintStatus = calculateMaintenanceStatus(equipment.nextMaintenanceDate);

  const pendingRecords = maintenanceHistory.filter(
    (m) => m.status !== 'Completed' && !m.completedDate
  );
  const completedRecords = maintenanceHistory.filter(
    (m) => m.status === 'Completed' || m.completedDate
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={equipment.name}
      subtitle={`${equipment.type} • ${equipment.model}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Status Alert Banner */}
        {maintStatus === 'Overdue' && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-900">Maintenance Overdue</h4>
                <p className="text-[11px] text-red-700">
                  Scheduled service was due on {equipment.nextMaintenanceDate}. Service required to prevent downtime.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenSchedule(equipment)}
              className="clay-btn-primary text-xs py-1.5 px-3 shrink-0"
            >
              Service Now
            </button>
          </div>
        )}

        {maintStatus === 'Due Soon' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Maintenance Due Soon</h4>
                <p className="text-[11px] text-amber-800">
                  Scheduled service due on {equipment.nextMaintenanceDate}. Prepare parts and lubricant.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenSchedule(equipment)}
              className="clay-btn-primary text-xs py-1.5 px-3 shrink-0"
            >
              Schedule
            </button>
          </div>
        )}

        {/* Machine Specifications Grid */}
        <div className="clay-card p-4 border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8faf8]">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Machine Status
            </span>
            <span className="text-xs font-bold text-[#1b4332] mt-0.5 inline-block">
              {equipment.status}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Purchase Date
            </span>
            <span className="text-xs font-bold text-emerald-950 mt-0.5 inline-block">
              {equipment.purchaseDate || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Service Interval
            </span>
            <span className="text-xs font-bold text-emerald-950 mt-0.5 inline-block">
              {equipment.maintenanceIntervalDays} Days
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Avg Cost
            </span>
            <span className="text-xs font-bold text-[#1b4332] mt-0.5 inline-block">
              ₹{equipment.maintenanceCostInr.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {equipment.notes && (
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900">
            <span className="font-bold block text-emerald-950 mb-0.5">Operator Guidelines & Notes:</span>
            <p className="leading-relaxed">{equipment.notes}</p>
          </div>
        )}

        {/* Maintenance History & Tasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#2d6a4f]" /> Maintenance Tasks & History
              </h3>
              <p className="text-[11px] text-emerald-800">Complete service track record for this machine</p>
            </div>

            <button
              onClick={() => onOpenSchedule(equipment)}
              className="clay-btn-primary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule Maintenance
            </button>
          </div>

          {/* Pending Tasks */}
          {pendingRecords.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending & Scheduled Tasks ({pendingRecords.length})
              </span>
              <div className="space-y-2">
                {pendingRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={rec.status === 'Overdue' ? 'red' : rec.status === 'Due Soon' ? 'amber' : 'green'}
                          size="sm"
                        >
                          {rec.status}
                        </Badge>
                        <span className="text-xs font-bold text-emerald-950">{rec.maintenanceTask}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-emerald-800 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" /> Scheduled: {rec.scheduledDate}
                        </span>
                        {rec.costInr > 0 && (
                          <span className="font-semibold text-emerald-950 flex items-center">
                            <IndianRupee className="w-3 h-3 text-emerald-600" />
                            {rec.costInr.toLocaleString('en-IN')}
                          </span>
                        )}
                        {rec.serviceProvider && <span>Provider: {rec.serviceProvider}</span>}
                      </div>
                    </div>

                    {rec.id && (
                      <button
                        onClick={() => onCompleteMaintenance(rec.id!)}
                        className="px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center gap-1 transition-all shrink-0 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" /> Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed History */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Service History Log ({completedRecords.length})
            </span>

            {completedRecords.length === 0 ? (
              <div className="text-center py-6 text-xs text-emerald-700 bg-[#f8faf8] rounded-2xl border border-emerald-100">
                No past maintenance logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {completedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-2xl bg-[#f8faf8] border border-emerald-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="mint" size="sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Completed
                        </Badge>
                        <span className="font-bold text-emerald-950">{rec.maintenanceTask}</span>
                      </div>
                      <div className="text-emerald-800 text-[11px] flex items-center gap-3">
                        <span>Completed on: {rec.completedDate || rec.scheduledDate}</span>
                        {rec.costInr > 0 && <span>Cost: ₹{rec.costInr.toLocaleString('en-IN')}</span>}
                        {rec.serviceProvider && <span>By: {rec.serviceProvider}</span>}
                      </div>
                      {rec.notes && <p className="text-emerald-700 italic mt-1 text-[11px]">"{rec.notes}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="pt-3 border-t border-emerald-100 flex justify-end">
          <button onClick={onClose} className="clay-btn-secondary text-xs py-2 px-5">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
