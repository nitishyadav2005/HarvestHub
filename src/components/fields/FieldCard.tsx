import React from 'react';
import type { Field } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { LandPlot, Droplets, Sprout, Edit, Trash2, ArrowRight } from 'lucide-react';

interface FieldCardProps {
  field: Field;
  onEdit: (field: Field) => void;
  onDelete: (id: number) => void;
  onAssignCrop: (field: Field) => void;
  onSelect: (field: Field) => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({
  field,
  onEdit,
  onDelete,
  onAssignCrop,
  onSelect
}) => {
  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col justify-between group min-w-0">
      <div className="min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block truncate max-w-[120px]">
              {field.code}
            </span>
            <h3
              onClick={() => onSelect(field)}
              className="text-base sm:text-lg font-bold text-[#1b4332] mt-1 hover:text-[#2d6a4f] cursor-pointer transition-colors truncate"
            >
              {field.name}
            </h3>
            <p className="text-xs text-emerald-700/80 font-medium truncate max-w-full">
              {field.location || 'Plot Coordinates Registered'}
            </p>
          </div>

          <Badge variant={field.status === 'Active' ? 'green' : field.status === 'Preparing' ? 'amber' : 'gray'}>
            {field.status}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 space-y-2 text-xs mb-3 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-emerald-700 flex items-center gap-1 font-medium shrink-0">
              <LandPlot className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" /> Field Area:
            </span>
            <span className="font-bold text-emerald-950 font-mono tabular-nums truncate text-right">{field.sizeAcres} Acres</span>
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-emerald-700 font-medium shrink-0">Soil Type:</span>
            <span className="font-semibold text-emerald-900 truncate max-w-[160px] text-right" title={field.soilType}>{field.soilType}</span>
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-emerald-700 flex items-center gap-1 font-medium shrink-0">
              <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> Irrigation:
            </span>
            <span className="font-semibold text-emerald-900 truncate max-w-[160px] text-right" title={field.irrigationType}>{field.irrigationType}</span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between gap-2 min-w-0">
            <span className="text-emerald-800 font-bold flex items-center gap-1 shrink-0">
              <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Current Crop:
            </span>
            <span className="font-bold text-[#1b4332] bg-[#d8f3dc] px-2 py-0.5 rounded-md text-xs truncate max-w-[150px] text-right" title={field.currentCropName || 'Fallow'}>
              {field.currentCropName || 'Fallow'}
            </span>
          </div>
        </div>

        {field.notes && (
          <p className="text-xs text-emerald-800/80 italic line-clamp-2 mb-3 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/60 break-words">
            "{field.notes}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2 min-w-0">
        <button
          onClick={() => onAssignCrop(field)}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center gap-1 transition-all shadow-xs cursor-pointer whitespace-nowrap min-w-0 shrink"
        >
          <Sprout className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" /> <span className="truncate">Change Crop</span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onSelect(field)}
            className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            title="View Details & Journal History"
          >
            <ArrowRight className="w-4 h-4 text-[#2d6a4f]" />
          </button>
          <button
            onClick={() => onEdit(field)}
            className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            title="Edit Field Specs"
          >
            <Edit className="w-4 h-4" />
          </button>
          {field.id && (
            <button
              onClick={() => onDelete(field.id!)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Field"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </ClayCard>
  );
};
