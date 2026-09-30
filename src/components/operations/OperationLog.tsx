import React, { useState } from 'react';
import type { FieldOperation, Field } from '../../types';
import { OperationCard } from './OperationCard';
import { OperationFormModal } from './OperationFormModal';
import { ClipboardList, Plus, Search, Filter } from 'lucide-react';

interface OperationLogProps {
  operations: FieldOperation[];
  fields: Field[];
  onAddOperation: (op: Omit<FieldOperation, 'id'>) => void;
  onUpdateOperation: (id: number, op: Partial<FieldOperation>) => void;
  onDeleteOperation: (id: number) => void;
  onCompleteOperation: (id: number) => void;
}

export const OperationLog: React.FC<OperationLogProps> = ({
  operations,
  fields,
  onAddOperation,
  onUpdateOperation,
  onDeleteOperation,
  onCompleteOperation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<FieldOperation | null>(null);

  const filteredOps = operations.filter((op) => {
    const matchesSearch =
      op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.materialDetails && op.materialDetails.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesField = fieldFilter === 'All' || op.fieldName === fieldFilter;
    const matchesStatus = statusFilter === 'All' || op.status === statusFilter;
    const matchesType = typeFilter === 'All' || op.operationType === typeFilter;

    return matchesSearch && matchesField && matchesStatus && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingOp(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (op: FieldOperation) => {
    setEditingOp(op);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (opData: Omit<FieldOperation, 'id'>) => {
    if (editingOp && editingOp.id) {
      onUpdateOperation(editingOp.id, opData);
    } else {
      onAddOperation(opData);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1b4332] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#2d6a4f]" /> Field Operations Journal
          </h2>
          <p className="text-xs text-emerald-800/80 font-medium">
            Schedule and track sowing, irrigation, fertigation, spraying, and harvesting activities
          </p>
        </div>

        <button onClick={handleOpenAdd} className="clay-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Log New Operation
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="clay-card p-4 border border-emerald-100 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-700" />
          <input
            type="text"
            placeholder="Search activity or materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full clay-inset-white pl-10 pr-4 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Field Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#2d6a4f] shrink-0" />
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            <option value="All">All Fields</option>
            {fields.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            <option value="All">All Operation Types</option>
            <option value="Sowing">Sowing</option>
            <option value="Tillage">Tillage</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Fertilization">Fertilization</option>
            <option value="Pest Control">Pest Control</option>
            <option value="Weeding">Weeding</option>
            <option value="Harvesting">Harvesting</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full clay-inset-white px-3 py-2 text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredOps.length === 0 ? (
        <div className="clay-card p-12 text-center text-emerald-800">
          <ClipboardList className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold">No operations found</h3>
          <p className="text-xs text-emerald-700 mt-1">Log a new operation or adjust your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOps.map((op) => (
            <OperationCard
              key={op.id}
              operation={op}
              onEdit={handleOpenEdit}
              onDelete={onDeleteOperation}
              onComplete={onCompleteOperation}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <OperationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        fields={fields}
        initialData={editingOp}
      />
    </div>
  );
};
