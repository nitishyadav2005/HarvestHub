import React, { useState } from 'react';
import type { Equipment, MaintenanceRecord } from '../../types';
import { calculateMaintenanceStatus } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { EquipmentCard } from './EquipmentCard';
import { EquipmentFormModal } from './EquipmentFormModal';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { MaintenanceFormModal } from './MaintenanceFormModal';
import { MaintenanceScheduleView } from './MaintenanceScheduleView';
import {
  Wrench,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  Layers,
  Calendar,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface EquipmentManagementProps {
  equipments: Equipment[];
  maintenanceRecords: MaintenanceRecord[];
  onAddEquipment: (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateEquipment: (id: number, updates: Partial<Equipment>) => void;
  onDeleteEquipment: (id: number) => void;
  onAddMaintenance: (data: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => void;
  onUpdateMaintenance: (id: number, updates: Partial<MaintenanceRecord>) => void;
  onDeleteMaintenance: (id: number) => void;
  onCompleteMaintenance: (id: number) => void;
}

export const EquipmentManagement: React.FC<EquipmentManagementProps> = ({
  equipments,
  maintenanceRecords,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onAddMaintenance,
  onUpdateMaintenance,
  onDeleteMaintenance,
  onCompleteMaintenance
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'schedule'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [isAddEquipOpen, setIsAddEquipOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState<Equipment | null>(null);
  const [viewingEquip, setViewingEquip] = useState<Equipment | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [preselectedEquipment, setPreselectedEquipment] = useState<Equipment | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRecord | null>(null);

  // Overview Calculations
  const totalEquipment = equipments.length;

  const dueSoonCount = equipments.filter((eq) => {
    const s = calculateMaintenanceStatus(eq.nextMaintenanceDate);
    return s === 'Due Soon';
  }).length;

  const overdueCount = equipments.filter((eq) => {
    const s = calculateMaintenanceStatus(eq.nextMaintenanceDate);
    return s === 'Overdue';
  }).length;

  // Recently maintained in the last 60 days or status completed
  const recentlyMaintainedCount = maintenanceRecords.filter(
    (m) => m.status === 'Completed' || Boolean(m.completedDate)
  ).length;

  // Filtered Equipment
  const filteredEquipments = equipments.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.notes && eq.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'All' || eq.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || eq.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Unique Types for Filter Dropdown
  const uniqueTypes = Array.from(new Set(equipments.map((e) => e.type)));

  // Handlers
  const handleOpenAddEquip = () => {
    setEditingEquip(null);
    setIsAddEquipOpen(true);
  };

  const handleOpenEditEquip = (eq: Equipment) => {
    setEditingEquip(eq);
    setIsAddEquipOpen(true);
  };

  const handleOpenViewEquip = (eq: Equipment) => {
    setViewingEquip(eq);
  };

  const handleOpenSchedule = (eq?: Equipment) => {
    setEditingMaintenance(null);
    setPreselectedEquipment(eq || null);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditMaintenance = (record: MaintenanceRecord) => {
    setEditingMaintenance(record);
    const matched = equipments.find((e) => e.id === record.equipmentId);
    setPreselectedEquipment(matched || null);
    setIsScheduleModalOpen(true);
  };

  const handleEquipSubmit = (eqData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEquip && editingEquip.id) {
      onUpdateEquipment(editingEquip.id, eqData);
    } else {
      onAddEquipment(eqData);
    }
  };

  const handleMaintenanceSubmit = (mData: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    if (editingMaintenance && editingMaintenance.id) {
      onUpdateMaintenance(editingMaintenance.id, mData);
    } else {
      onAddMaintenance(mData);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-[#1b4332] flex items-center gap-2 truncate">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-[#2d6a4f] shrink-0" /> Farm Machinery & Maintenance
          </h2>
          <p className="text-xs text-emerald-800/80 font-medium truncate">
            Equipment health monitoring, preventive maintenance scheduling, and service logs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
          <button onClick={() => handleOpenSchedule()} className="clay-btn-secondary text-xs py-2 px-3.5 cursor-pointer whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" /> Schedule Service
          </button>
          <button onClick={handleOpenAddEquip} className="clay-btn-primary text-xs py-2 px-3.5 cursor-pointer whitespace-nowrap">
            <Plus className="w-3.5 h-3.5" /> Add Equipment
          </button>
        </div>
      </div>

      {/* Equipment Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Equipment */}
        <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider truncate">
              Fleet Size
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-[#d8f3dc] text-[#1b4332] shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            {totalEquipment} <span className="text-xs sm:text-sm font-sans font-medium text-emerald-700">Units</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">
            Registered machines
          </p>
        </ClayCard>

        {/* Maintenance Due Soon */}
        <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider truncate">
              Due Soon
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-950 mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            {dueSoonCount} <span className="text-xs sm:text-sm font-sans font-medium text-amber-800">Machines</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-800 mt-1 font-medium truncate">
            Due in 7 days
          </p>
        </ClayCard>

        {/* Overdue Maintenance */}
        <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-red-800 uppercase tracking-wider truncate">
              Overdue
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-red-100 text-red-800 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-red-950 mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            {overdueCount} <span className="text-xs sm:text-sm font-sans font-medium text-red-800">Machines</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-red-700 mt-1 font-medium truncate">
            Requires inspection
          </p>
        </ClayCard>

        {/* Recently Maintained */}
        <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-[#1b4332] uppercase tracking-wider truncate">
              Serviced
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            {recentlyMaintainedCount} <span className="text-xs sm:text-sm font-sans font-medium text-emerald-700">Logs</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">
            Completed service logs
          </p>
        </ClayCard>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-3 flex-wrap min-w-0">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#2d6a4f] text-white shadow-md'
              : 'text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" /> Equipment Fleet ({equipments.length})
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-[#2d6a4f] text-white shadow-md'
              : 'text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" /> Schedule & Service Logs ({maintenanceRecords.length})
        </button>
      </div>

      {/* Tab 1: Equipment Fleet Grid */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Toolbar & Filters */}
          <div className="clay-card p-4 border border-emerald-100 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-700" />
              <input
                type="text"
                placeholder="Search machine name, model or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full clay-inset-white pl-10 pr-4 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#2d6a4f] shrink-0" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
              >
                <option value="All">All Equipment Types</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
              >
                <option value="All">All Operating Statuses</option>
                <option value="Operational">Operational</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="In Storage">In Storage</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredEquipments.length === 0 ? (
            <ClayCard variant="white" className="border border-emerald-100 p-8 text-center">
              <Wrench className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-[#1b4332]">No Equipment Found</h4>
              <p className="text-xs text-emerald-700/80 mt-1 mb-4">
                {searchQuery || typeFilter !== 'All' || statusFilter !== 'All'
                  ? 'No equipment matches the selected filters.'
                  : 'Start by cataloging your tractors, pumps, sprayers, and implements.'}
              </p>
              <button onClick={handleOpenAddEquip} className="clay-btn-primary text-xs py-2 px-4 mx-auto">
                <Plus className="w-4 h-4" /> Add Equipment
              </button>
            </ClayCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipments.map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  onView={handleOpenViewEquip}
                  onEdit={handleOpenEditEquip}
                  onDelete={onDeleteEquipment}
                  onScheduleMaintenance={(eq) => handleOpenSchedule(eq)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Maintenance Schedule & History */}
      {activeTab === 'schedule' && (
        <MaintenanceScheduleView
          maintenanceRecords={maintenanceRecords}
          onAddMaintenance={() => handleOpenSchedule()}
          onEditMaintenance={handleOpenEditMaintenance}
          onDeleteMaintenance={onDeleteMaintenance}
          onCompleteMaintenance={onCompleteMaintenance}
        />
      )}

      {/* Modals */}
      <EquipmentFormModal
        isOpen={isAddEquipOpen}
        onClose={() => setIsAddEquipOpen(false)}
        onSubmit={handleEquipSubmit}
        initialData={editingEquip}
      />

      <EquipmentDetailModal
        isOpen={Boolean(viewingEquip)}
        onClose={() => setViewingEquip(null)}
        equipment={viewingEquip}
        maintenanceHistory={
          viewingEquip
            ? maintenanceRecords.filter((m) => m.equipmentId === viewingEquip.id)
            : []
        }
        onOpenSchedule={(eq) => {
          setViewingEquip(null);
          handleOpenSchedule(eq);
        }}
        onCompleteMaintenance={onCompleteMaintenance}
      />

      <MaintenanceFormModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleMaintenanceSubmit}
        equipments={equipments}
        preselectedEquipment={preselectedEquipment}
        initialData={editingMaintenance}
      />
    </div>
  );
};
