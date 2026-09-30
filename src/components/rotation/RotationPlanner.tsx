import React, { useState } from 'react';
import type { CropRotation, Field } from '../../types';
import { RotationCard } from './RotationCard';
import { SoilHealthAdvisor } from './SoilHealthAdvisor';
import { RotationFormModal } from './RotationFormModal';
import { RotateCw, Plus, Sprout, Search } from 'lucide-react';

interface RotationPlannerProps {
  rotations: CropRotation[];
  fields: Field[];
  onAddRotation: (rotation: Omit<CropRotation, 'id' | 'createdAt'>) => void;
  onUpdateRotation: (id: number, rotation: Partial<CropRotation>) => void;
  onDeleteRotation: (id: number) => void;
}

export const RotationPlanner: React.FC<RotationPlannerProps> = ({
  rotations,
  fields,
  onAddRotation,
  onUpdateRotation,
  onDeleteRotation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRotation, setEditingRotation] = useState<CropRotation | null>(null);
  const [prefillRecommendation, setPrefillRecommendation] = useState<{
    fieldName: string;
    currentCrop: string;
    recommendedCrop: string;
  } | null>(null);

  const filteredRotations = rotations.filter((r) => {
    return (
      r.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.currentCrop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nextPlannedCrop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.previousCrop.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenAdd = () => {
    setEditingRotation(null);
    setPrefillRecommendation(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rotation: CropRotation) => {
    setEditingRotation(rotation);
    setPrefillRecommendation(null);
    setIsModalOpen(true);
  };

  const handleAdoptRecommendation = (fieldName: string, currentCrop: string, recommendedCrop: string) => {
    setEditingRotation(null);
    setPrefillRecommendation({ fieldName, currentCrop, recommendedCrop });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (rotationData: Omit<CropRotation, 'id' | 'createdAt'>) => {
    if (editingRotation && editingRotation.id) {
      onUpdateRotation(editingRotation.id, rotationData);
    } else {
      onAddRotation(rotationData);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-[#1b4332] flex items-center gap-2 truncate">
            <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-[#2d6a4f] shrink-0" /> Crop Rotation Planner
          </h2>
          <p className="text-xs text-emerald-800/80 font-medium truncate">
            Maintain crop succession history (Previous ➔ Current ➔ Next Planned) & optimize soil fertility
          </p>
        </div>

        <button onClick={handleOpenAdd} className="clay-btn-primary text-xs sm:text-sm py-2 px-3.5 shrink-0 cursor-pointer self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Plan Next Rotation
        </button>
      </div>

      {/* Smart Soil Health Advisor Recommendation Engine */}
      <SoilHealthAdvisor
        fields={fields}
        onSelectRecommendedCrop={handleAdoptRecommendation}
      />

      {/* Search & Header */}
      <div className="clay-card p-3.5 sm:p-4 border border-emerald-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-[#1b4332] flex items-center gap-2 truncate">
          <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-[#2d6a4f] shrink-0" /> Rotation History & Pipeline ({filteredRotations.length})
        </h3>

        <div className="relative w-full md:w-72 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-700" />
          <input
            type="text"
            placeholder="Search by crop or plot name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full clay-inset-white pl-10 pr-4 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      {/* Rotation Grid */}
      {filteredRotations.length === 0 ? (
        <div className="clay-card p-12 text-center text-emerald-800">
          <RotateCw className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold">No crop rotation plans found</h3>
          <p className="text-xs text-emerald-700 mt-1">Plan a new crop rotation using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRotations.map((rotation) => (
            <RotationCard
              key={rotation.id}
              rotation={rotation}
              onEdit={handleOpenEdit}
              onDelete={onDeleteRotation}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <RotationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        fields={fields}
        initialData={editingRotation}
        prefillRecommended={prefillRecommendation}
      />
    </div>
  );
};
