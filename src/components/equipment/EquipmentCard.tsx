import React from 'react';
import type { Equipment } from '../../types';
import { calculateMaintenanceStatus } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Trash2,
  Eye,
  IndianRupee,
  RotateCw,
  Droplets,
  Sprout,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onView: (eq: Equipment) => void;
  onEdit: (eq: Equipment) => void;
  onDelete: (id: number) => void;
  onScheduleMaintenance: (eq: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onView,
  onEdit,
  onDelete,
  onScheduleMaintenance
}) => {
  const maintStatus = calculateMaintenanceStatus(equipment.nextMaintenanceDate);

  // Type Icon Resolver
  const getTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('tractor')) return <Wrench className="w-4 h-4 text-[#2d6a4f]" />;
    if (t.includes('pump') || t.includes('water')) return <Droplets className="w-4 h-4 text-blue-600" />;
    if (t.includes('seed') || t.includes('drill') || t.includes('seeder')) return <Sprout className="w-4 h-4 text-emerald-600" />;
    if (t.includes('rotavator') || t.includes('tiller')) return <RotateCw className="w-4 h-4 text-amber-700" />;
    return <Wrench className="w-4 h-4 text-[#2d6a4f]" />;
  };

  // Maintenance Status Badge Resolver
  const getMaintBadge = () => {
    switch (maintStatus) {
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
            <CheckCircle2 className="w-3 h-3 text-emerald-700 mr-0.5" /> Serviced
          </Badge>
        );
    }
  };

  // Equipment Current Status Badge
  const getEquipmentStatusBadge = () => {
    switch (equipment.status) {
      case 'Operational':
        return (
          <Badge variant="green" size="sm">
            <ShieldCheck className="w-3 h-3 text-emerald-700 mr-0.5" /> Operational
          </Badge>
        );
      case 'Needs Attention':
        return (
          <Badge variant="amber" size="sm">
            <AlertTriangle className="w-3 h-3 text-amber-800 mr-0.5" /> Needs Attention
          </Badge>
        );
      case 'Under Maintenance':
        return (
          <Badge variant="blue" size="sm">
            <Wrench className="w-3 h-3 text-blue-700 mr-0.5" /> In Service
          </Badge>
        );
      case 'In Storage':
        return (
          <Badge variant="gray" size="sm">
            In Storage
          </Badge>
        );
    }
  };

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col justify-between group">
      <div>
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#f2f6f3] border border-emerald-200/60 shadow-xs shrink-0 mt-0.5">
              {getTypeIcon(equipment.type)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {equipment.type}
                </span>
                <span className="text-emerald-300">•</span>
                <span className="text-xs text-emerald-700 font-medium">{equipment.model}</span>
              </div>
              <h3 className="text-base font-bold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors leading-snug">
                {equipment.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {getEquipmentStatusBadge()}
            {getMaintBadge()}
          </div>
        </div>

        {/* Maintenance Timelines & Specs */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 space-y-2 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Last Maintenance:
            </span>
            <span className="font-semibold text-emerald-950">
              {equipment.lastMaintenanceDate || 'None logged'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Next Maintenance:
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${
                maintStatus === 'Overdue'
                  ? 'text-red-700'
                  : maintStatus === 'Due Soon'
                  ? 'text-amber-800'
                  : 'text-emerald-950'
              }`}
            >
              {equipment.nextMaintenanceDate}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-emerald-50 text-[11px]">
            <span className="text-emerald-700">Interval: Every {equipment.maintenanceIntervalDays} days</span>
            {equipment.maintenanceCostInr > 0 && (
              <span className="font-bold text-[#1b4332] flex items-center">
                <IndianRupee className="w-3 h-3 text-emerald-600" />
                {equipment.maintenanceCostInr.toLocaleString('en-IN')} / service
              </span>
            )}
          </div>
        </div>

        {equipment.notes && (
          <p className="text-xs text-emerald-800/80 italic line-clamp-2 mb-3 bg-emerald-50/50 p-2 rounded-xl">
            "{equipment.notes}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(equipment)}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
            title="View full specs and history"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" /> View
          </button>

          <button
            onClick={() => onScheduleMaintenance(equipment)}
            className="px-2.5 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] border border-[#74c69d]/40 text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
            title="Schedule new maintenance"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2d6a4f]" /> Schedule
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(equipment)}
            className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Edit Equipment"
          >
            <Edit className="w-4 h-4" />
          </button>
          {equipment.id && (
            <button
              onClick={() => onDelete(equipment.id!)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Equipment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </ClayCard>
  );
};
