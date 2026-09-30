import React, { useState } from 'react';
import type { MaintenanceRecord, MaintenanceStatus } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Trash2,
  Plus,
  IndianRupee,
  Wrench,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

interface MaintenanceScheduleViewProps {
  maintenanceRecords: MaintenanceRecord[];
  onAddMaintenance: () => void;
  onEditMaintenance: (record: MaintenanceRecord) => void;
  onDeleteMaintenance: (id: number) => void;
  onCompleteMaintenance: (id: number) => void;
}

export const MaintenanceScheduleView: React.FC<MaintenanceScheduleViewProps> = ({
  maintenanceRecords,
  onAddMaintenance,
  onEditMaintenance,
  onDeleteMaintenance,
  onCompleteMaintenance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredRecords = maintenanceRecords.filter((rec) => {
    const matchesSearch =
      rec.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.maintenanceTask.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.serviceProvider && rec.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Overdue':
        return (
          <Badge variant="red" size="sm">
            <AlertTriangle className="w-3 h-3 text-red-700 mr-0.5" /> Overdue
          </Badge>
        );
      case 'Due Soon':
        return (
          <Badge variant="amber" size="sm">
            <AlertCircle className="w-3 h-3 text-amber-800 mr-0.5" /> Due Soon
          </Badge>
        );
      case 'Upcoming':
        return (
          <Badge variant="green" size="sm">
            <Clock className="w-3 h-3 text-emerald-800 mr-0.5" /> Upcoming
          </Badge>
        );
      case 'Completed':
        return (
          <Badge variant="mint" size="sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-700 mr-0.5" /> Completed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Schedule Toolbar */}
      <div className="clay-card p-3.5 sm:p-4 border border-emerald-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-w-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-700" />
            <input
              type="text"
              placeholder="Search equipment, task or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full clay-inset-white pl-10 pr-4 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-[#2d6a4f] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              <option value="All">All Statuses</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Overdue">Overdue</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <button onClick={onAddMaintenance} className="clay-btn-primary text-xs py-2 px-4 shrink-0 cursor-pointer self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Schedule New Task
        </button>
      </div>

      {/* Timeline List */}
      {filteredRecords.length === 0 ? (
        <ClayCard variant="white" className="border border-emerald-100 p-8 text-center">
          <Wrench className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-[#1b4332]">No Maintenance Records Found</h4>
          <p className="text-xs text-emerald-700/80 mt-1 mb-4">
            {searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search or filter settings.'
              : 'Keep your machinery in prime condition by scheduling preventive maintenance.'}
          </p>
          <button onClick={onAddMaintenance} className="clay-btn-primary text-xs py-2 px-4 mx-auto">
            <Plus className="w-4 h-4" /> Schedule First Task
          </button>
        </ClayCard>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const isCompleted = record.status === 'Completed' || Boolean(record.completedDate);
            return (
              <ClayCard
                key={record.id}
                variant="white"
                className={`border transition-all ${
                  record.status === 'Overdue'
                    ? 'border-red-200 bg-red-50/20'
                    : record.status === 'Due Soon'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-emerald-100'
                } p-4`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getStatusBadge(record.status)}
                      <span className="text-xs font-bold text-[#1b4332] truncate max-w-[240px]">
                        {record.equipmentName}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug break-words">
                      {record.maintenanceTask}
                    </h4>

                    <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-emerald-800 flex-wrap">
                      <span className="flex items-center gap-1 font-medium font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {isCompleted
                          ? `Completed: ${record.completedDate || record.scheduledDate}`
                          : `Scheduled: ${record.scheduledDate}`}
                      </span>

                      {record.costInr > 0 && (
                        <span className="font-bold text-emerald-950 flex items-center font-mono tabular-nums">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {record.costInr.toLocaleString('en-IN')}
                        </span>
                      )}

                      {record.serviceProvider && (
                        <span className="text-emerald-700 font-medium truncate max-w-[200px]">
                          Workshop: {record.serviceProvider}
                        </span>
                      )}
                    </div>

                    {record.notes && (
                      <p className="text-xs text-emerald-800/80 italic mt-2 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100/60 break-words">
                        "{record.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isCompleted && record.id && (
                      <button
                        onClick={() => onCompleteMaintenance(record.id!)}
                        className="px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center gap-1 transition-all shadow-xs"
                        title="Mark maintenance as done"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" /> Mark Done
                      </button>
                    )}

                    <button
                      onClick={() => onEditMaintenance(record)}
                      className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Edit Schedule"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {record.id && (
                      <button
                        onClick={() => onDeleteMaintenance(record.id!)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </ClayCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
