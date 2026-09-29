import React from 'react';
import type { CropRotation } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RotationCardProps {
  rotation: CropRotation;
  onEdit: (rotation: CropRotation) => void;
  onDelete: (id: number) => void;
}

export const RotationCard: React.FC<RotationCardProps> = ({
  rotation,
  onEdit,
  onDelete
}) => {
  const isPositiveN = rotation.nitrogenBalance.includes('+N');

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col justify-between">
      <div>
        {/* Field & Year Header */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-emerald-100">
          <div>
            <h3 className="text-base font-bold text-[#1b4332]">{rotation.fieldName}</h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-emerald-800">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {rotation.rotationYear}
              </span>
            </div>
          </div>
          <Badge variant={isPositiveN ? 'green' : 'amber'} size="sm">
            {rotation.soilHealthImpact} Impact
          </Badge>
        </div>

        {/* Rotation Sequence (Prev -> Curr -> Next) */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf8] border border-emerald-100 space-y-2.5 mb-4">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            Crop Sequence Pipeline
          </div>

          <div className="grid grid-cols-3 gap-2 items-center text-center">
            {/* Previous */}
            <div className="p-2 rounded-xl bg-white border border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Previous</span>
              <span className="text-xs font-semibold text-gray-800 line-clamp-2 mt-0.5">
                {rotation.previousCrop}
              </span>
            </div>

            {/* Current */}
            <div className="p-2 rounded-xl bg-[#d8f3dc] border border-[#74c69d]">
              <span className="text-[10px] font-bold text-[#1b4332] uppercase block">Current</span>
              <span className="text-xs font-bold text-[#1b4332] line-clamp-2 mt-0.5">
                {rotation.currentCrop}
              </span>
            </div>

            {/* Next Planned */}
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-[#2d6a4f] uppercase block">Next Planned</span>
              <span className="text-xs font-bold text-[#2d6a4f] line-clamp-2 mt-0.5">
                {rotation.nextPlannedCrop}
              </span>
            </div>
          </div>

          {/* Plant Date */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-100 text-emerald-900 font-medium">
            <span>Planned Planting:</span>
            <span className="font-bold text-[#2d6a4f]">{rotation.plannedPlantingDate}</span>
          </div>
        </div>

        {/* Soil Health Metric Pill */}
        <div className="p-3 rounded-xl bg-[#e8f5e9] border border-emerald-200 flex items-center justify-between text-xs mb-3">
          <span className="font-bold text-[#1b4332] flex items-center gap-1.5">
            {isPositiveN ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            )}
            Nitrogen Balance:
          </span>
          <span className={`font-bold ${isPositiveN ? 'text-emerald-800' : 'text-amber-900'}`}>
            {rotation.nitrogenBalance}
          </span>
        </div>

        {rotation.notes && (
          <p className="text-xs text-emerald-800/80 italic line-clamp-2 mb-3 bg-emerald-50/50 p-2 rounded-xl">
            "{rotation.notes}"
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
        <button
          onClick={() => onEdit(rotation)}
          className="text-xs font-bold text-[#2d6a4f] hover:underline"
        >
          Update Plan
        </button>
        {rotation.id && (
          <button
            onClick={() => onDelete(rotation.id!)}
            className="text-xs text-red-600 font-semibold hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </ClayCard>
  );
};
