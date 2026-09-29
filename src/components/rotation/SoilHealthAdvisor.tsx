import React, { useState } from 'react';
import type { Field } from '../../types';
import { rotationService } from '../../services/rotationService';
import { ClayCard } from '../common/ClayCard';
import { Lightbulb, CheckCircle2, Sprout, ArrowRight, ShieldCheck } from 'lucide-react';

interface SoilHealthAdvisorProps {
  fields: Field[];
  onSelectRecommendedCrop: (fieldName: string, currentCrop: string, recommendedCrop: string) => void;
}

export const SoilHealthAdvisor: React.FC<SoilHealthAdvisorProps> = ({
  fields,
  onSelectRecommendedCrop
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState<number>(fields[0]?.id || 1);

  const selectedField = fields.find((f) => f.id === Number(selectedFieldId)) || fields[0];

  const recommendations = selectedField
    ? rotationService.getRotationRecommendations(
        selectedField.currentCropName || 'Wheat',
        selectedField.soilType
      )
    : [];

  return (
    <ClayCard variant="mint" className="border border-emerald-300/80 p-5 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-400/30">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4332] uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-600" /> Smart Soil & Crop Rotation Engine
          </div>
          <h3 className="text-lg font-black text-[#1b4332] mt-0.5">
            Agronomic Rotation Recommendations
          </h3>
        </div>

        {/* Field Selector */}
        {fields.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-900 shrink-0">Field:</span>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(Number(e.target.value))}
              className="clay-inset-white px-3 py-1.5 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.currentCropName || 'Fallow'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedField && (
        <div className="text-xs text-[#1b4332] flex items-center justify-between bg-white/60 p-2.5 rounded-xl border border-emerald-200">
          <span>Active Crop: <strong className="text-[#2d6a4f]">{selectedField.currentCropName || 'Fallow'}</strong></span>
          <span>Soil Type: <strong className="text-[#1b4332]">{selectedField.soilType}</strong></span>
          <span>Irrigation: <strong className="text-[#1b4332]">{selectedField.irrigationType}</strong></span>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-md">
                    {rec.category}
                  </span>
                  <h4 className="text-base font-bold text-[#1b4332] mt-1 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-[#2d6a4f]" /> {rec.recommendedCropName}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-800 bg-[#d8f3dc] px-2.5 py-1 rounded-full border border-[#74c69d]">
                    {rec.soilCompatibilityScore}% Match
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-950 font-medium mb-3 leading-relaxed">
                {rec.reasoning}
              </p>

              <div className="space-y-1 mb-3">
                {rec.expectedBenefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1b4332] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> {rec.nitrogenImpact}
              </span>
              {selectedField && (
                <button
                  onClick={() =>
                    onSelectRecommendedCrop(
                      selectedField.name,
                      selectedField.currentCropName || 'Fallow',
                      rec.recommendedCropName
                    )
                  }
                  className="px-3 py-1 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  Adopt Plan <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ClayCard>
  );
};
