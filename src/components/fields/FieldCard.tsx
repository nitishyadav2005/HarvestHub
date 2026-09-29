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
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {field.code}
            </span>
            <h3
              onClick={() => onSelect(field)}
              className="text-lg font-bold text-[#1b4332] mt-1 hover:text-[#2d6a4f] cursor-pointer transition-colors"
            >
              {field.name}
            </h3>
            <p className="text-xs text-emerald-700/80 font-medium truncate max-w-[200px]">
              {field.location}
            </p>
          </div>

          <Badge variant={field.status === 'Active' ? 'green' : field.status === 'Preparing' ? 'amber' : 'gray'}>
            {field.status}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 space-y-2 text-xs mb-4">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <LandPlot className="w-3.5 h-3.5 text-[#2d6a4f]" /> Field Area:
            </span>
            <span className="font-bold text-emerald-950">{field.sizeAcres} Acres</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-emerald-700 font-medium">Soil Type:</span>
            <span className="font-semibold text-emerald-900">{field.soilType}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <Droplets className="w-3.5 h-3.5 text-cyan-600" /> Irrigation:
            </span>
            <span className="font-semibold text-emerald-900">{field.irrigationType}</span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Current Crop:
            </span>
            <span className="font-bold text-[#1b4332] bg-[#d8f3dc] px-2 py-0.5 rounded-md text-xs">
              {field.currentCropName || 'Fallow'}
            </span>
          </div>
        </div>

        {field.notes && (
          <p className="text-xs text-emerald-800/80 italic line-clamp-2 mb-4 bg-emerald-50/50 p-2 rounded-xl">
            "{field.notes}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onAssignCrop(field)}
          className="px-3 py-1.5 rounded-xl bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] text-xs font-bold border border-[#74c69d]/40 flex items-center gap-1 transition-all shadow-xs"
        >
          <Sprout className="w-3.5 h-3.5 text-[#2d6a4f]" /> Change Crop
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelect(field)}
            className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
            title="View Details & Journal History"
          >
            <ArrowRight className="w-4 h-4 text-[#2d6a4f]" />
          </button>
          <button
            onClick={() => onEdit(field)}
            className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Edit Field Specs"
          >
            <Edit className="w-4 h-4" />
          </button>
          {field.id && (
            <button
              onClick={() => onDelete(field.id!)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
