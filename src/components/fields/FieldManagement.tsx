import React, { useState } from 'react';
import type { Field, Crop, FieldOperation, Expense, YieldRecord, CropRotation } from '../../types';
import { FieldCard } from './FieldCard';
import { FieldFormModal } from './FieldFormModal';
import { AssignCropModal } from './AssignCropModal';
import { FieldDetailModal } from './FieldDetailModal';
import { Plus, Search, Filter, LandPlot, Sprout } from 'lucide-react';

interface FieldManagementProps {
  fields: Field[];
  crops: Crop[];
  operations: FieldOperation[];
  expenses: Expense[];
  yields: YieldRecord[];
  rotations: CropRotation[];
  onAddField: (field: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateField: (id: number, field: Partial<Field>) => void;
  onDeleteField: (id: number) => void;
  onAssignCrop: (fieldId: number, cropId: number, cropName: string) => void;
}

export const FieldManagement: React.FC<FieldManagementProps> = ({
  fields,
  crops,
  operations,
  expenses,
  yields,
  rotations,
  onAddField,
  onUpdateField,
  onDeleteField,
  onAssignCrop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoilFilter, setSelectedSoilFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningField, setAssigningField] = useState<Field | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailField, setSelectedDetailField] = useState<Field | null>(null);

  // Filtered fields
  const filteredFields = fields.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.currentCropName && f.currentCropName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSoil = selectedSoilFilter === 'All' || f.soilType === selectedSoilFilter;
    const matchesStatus = selectedStatusFilter === 'All' || f.status === selectedStatusFilter;

    return matchesSearch && matchesSoil && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingField(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (field: Field) => {
    setEditingField(field);
    setIsFormModalOpen(true);
  };

  const handleOpenAssign = (field: Field) => {
    setAssigningField(field);
    setIsAssignModalOpen(true);
  };

  const handleOpenDetail = (field: Field) => {
    setSelectedDetailField(field);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = (fieldData: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingField && editingField.id) {
      onUpdateField(editingField.id, fieldData);
    } else {
      onAddField(fieldData);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1b4332] flex items-center gap-2">
            <LandPlot className="w-6 h-6 text-[#2d6a4f]" /> Field & Crop Management
          </h2>
          <p className="text-xs text-emerald-800/80 font-medium">
            Register land plots, soil classifications, and assign active crop cycles
          </p>
        </div>

        <button onClick={handleOpenAdd} className="clay-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add New Farm Plot
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="clay-card p-4 border border-emerald-100 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-700" />
          <input
            type="text"
            placeholder="Search fields by name, code, or active crop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full clay-inset-white pl-10 pr-4 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Soil Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#2d6a4f] shrink-0" />
          <select
            value={selectedSoilFilter}
            onChange={(e) => setSelectedSoilFilter(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            <option value="All">All Soil Types</option>
            <option value="Black Clay Soil">Black Clay Soil</option>
            <option value="Alluvial Soil">Alluvial Soil</option>
            <option value="Loamy Soil">Loamy Soil</option>
            <option value="Red Soil">Red Soil</option>
            <option value="Sandy Loam">Sandy Loam</option>
            <option value="Clay Loam">Clay Loam</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Preparing">Preparing</option>
            <option value="Fallow">Fallow</option>
          </select>
        </div>
      </div>

      {/* Field Grid */}
      {filteredFields.length === 0 ? (
        <div className="clay-card p-12 text-center text-emerald-800">
          <Sprout className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold">No fields matching filters</h3>
          <p className="text-xs text-emerald-700 mt-1">Try clearing search query or add a new field.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              onEdit={handleOpenEdit}
              onDelete={onDeleteField}
              onAssignCrop={handleOpenAssign}
              onSelect={handleOpenDetail}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <FieldFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingField}
      />

      <AssignCropModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        field={assigningField}
        crops={crops}
        onAssign={onAssignCrop}
      />

      <FieldDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        field={selectedDetailField}
        operations={operations}
        expenses={expenses}
        yields={yields}
        rotations={rotations}
      />
    </div>
  );
};
