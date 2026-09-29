import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Modules
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { FieldManagement } from './components/fields/FieldManagement';
import { RotationPlanner } from './components/rotation/RotationPlanner';
import { OperationLog } from './components/operations/OperationLog';
import { CostAndYield } from './components/finances/CostAndYield';
import { SystemInfoModal } from './components/settings/SystemInfoModal';
import { FieldDetailModal } from './components/fields/FieldDetailModal';
import { FieldFormModal } from './components/fields/FieldFormModal';

// Services & Types
import { initializeDatabase } from './db/databaseService';
import { fieldService } from './services/fieldService';
import { cropService } from './services/cropService';
import { rotationService } from './services/rotationService';
import { operationService } from './services/operationService';
import { financialService } from './services/financialService';

import type {
  Field,
  Crop,
  CropRotation,
  FieldOperation,
  Expense,
  YieldRecord,
  FarmFinancialSummary
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbReady, setDbReady] = useState(false);

  // Entities state
  const [fields, setFields] = useState<Field[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [rotations, setRotations] = useState<CropRotation[]>([]);
  const [operations, setOperations] = useState<FieldOperation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [yields, setYields] = useState<YieldRecord[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FarmFinancialSummary>({
    totalExpensesInr: 0,
    totalRevenueInr: 0,
    netProfitInr: 0,
    roiPercentage: 0,
    expensesByCategory: [],
    cropWiseProfitability: []
  });

  // System & Detail Modal state
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [selectedFieldForDetail, setSelectedFieldForDetail] = useState<Field | null>(null);
  const [isFieldDetailOpen, setIsFieldDetailOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);

  // Refresh all state from IndexedDB
  const refreshAllData = useCallback(async () => {
    try {
      const [
        fList,
        cList,
        rList,
        oList,
        eList,
        yList,
        fSummary
      ] = await Promise.all([
        fieldService.getAllFields(),
        cropService.getAllCrops(),
        rotationService.getAllRotations(),
        operationService.getAllOperations(),
        financialService.getAllExpenses(),
        financialService.getAllYields(),
        financialService.getFinancialSummary()
      ]);

      setFields(fList);
      setCrops(cList);
      setRotations(rList);
      setOperations(oList);
      setExpenses(eList);
      setYields(yList);
      setFinancialSummary(fSummary);
    } catch (err) {
      console.error('Failed to refresh data from IndexedDB:', err);
    }
  }, []);

  // Startup initialization
  useEffect(() => {
    async function init() {
      const success = await initializeDatabase(false);
      setDbReady(success);
      if (success) {
        await refreshAllData();
      }
    }
    init();
  }, [refreshAllData]);

  // Reset seed data handler
  const handleResetSeedData = async () => {
    if (window.confirm('Reset database with fresh realistic Indian farming sample data?')) {
      await initializeDatabase(true);
      await refreshAllData();
    }
  };

  // Field CRUD Handlers
  const handleAddField = async (fieldData: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>) => {
    await fieldService.addField(fieldData);
    await refreshAllData();
  };

  const handleUpdateField = async (id: number, updates: Partial<Field>) => {
    await fieldService.updateField(id, updates);
    await refreshAllData();
  };

  const handleDeleteField = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this field plot?')) {
      await fieldService.deleteField(id);
      await refreshAllData();
    }
  };

  const handleAssignCrop = async (fieldId: number, cropId: number, cropName: string) => {
    await fieldService.assignCrop(fieldId, cropId, cropName);
    await refreshAllData();
  };

  // Rotation CRUD Handlers
  const handleAddRotation = async (rotationData: Omit<CropRotation, 'id' | 'createdAt'>) => {
    await rotationService.addRotation(rotationData);
    await refreshAllData();
  };

  const handleUpdateRotation = async (id: number, updates: Partial<CropRotation>) => {
    await rotationService.updateRotation(id, updates);
    await refreshAllData();
  };

  const handleDeleteRotation = async (id: number) => {
    if (window.confirm('Delete this crop rotation plan?')) {
      await rotationService.deleteRotation(id);
      await refreshAllData();
    }
  };

  // Operation CRUD Handlers
  const handleAddOperation = async (opData: Omit<FieldOperation, 'id'>) => {
    await operationService.addOperation(opData);
    await refreshAllData();
  };

  const handleUpdateOperation = async (id: number, updates: Partial<FieldOperation>) => {
    await operationService.updateOperation(id, updates);
    await refreshAllData();
  };

  const handleDeleteOperation = async (id: number) => {
    if (window.confirm('Delete this operation log?')) {
      await operationService.deleteOperation(id);
      await refreshAllData();
    }
  };

  const handleCompleteOperation = async (id: number) => {
    await operationService.completeOperation(id);
    await refreshAllData();
  };

  // Financial CRUD Handlers
  const handleAddExpense = async (expData: Omit<Expense, 'id'>) => {
    await financialService.addExpense(expData);
    await refreshAllData();
  };

  const handleUpdateExpense = async (id: number, updates: Partial<Expense>) => {
    await financialService.updateExpense(id, updates);
    await refreshAllData();
  };

  const handleDeleteExpense = async (id: number) => {
    if (window.confirm('Delete expense entry?')) {
      await financialService.deleteExpense(id);
      await refreshAllData();
    }
  };

  const handleAddYield = async (yldData: Omit<YieldRecord, 'id'>) => {
    await financialService.addYield(yldData);
    await refreshAllData();
  };

  const handleUpdateYield = async (id: number, updates: Partial<YieldRecord>) => {
    await financialService.updateYield(id, updates);
    await refreshAllData();
  };

  const handleDeleteYield = async (id: number) => {
    if (window.confirm('Delete harvest yield record?')) {
      await financialService.deleteYield(id);
      await refreshAllData();
    }
  };

  const handleOpenFieldDetail = (field: Field) => {
    setSelectedFieldForDetail(field);
    setIsFieldDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f6f3] text-[#1c2e24]">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
        onResetSeedData={handleResetSeedData}
        dbReady={dbReady}
      />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-4 p-4 md:p-6 lg:p-8">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
        />

        {/* Dynamic Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              fields={fields}
              operations={operations}
              financialSummary={financialSummary}
              onNavigate={(tab) => setActiveTab(tab)}
              onCompleteOperation={handleCompleteOperation}
              onSelectField={handleOpenFieldDetail}
              onOpenAddField={() => setIsAddFieldModalOpen(true)}
            />
          )}

          {activeTab === 'fields' && (
            <FieldManagement
              fields={fields}
              crops={crops}
              operations={operations}
              expenses={expenses}
              yields={yields}
              rotations={rotations}
              onAddField={handleAddField}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
              onAssignCrop={handleAssignCrop}
            />
          )}

          {activeTab === 'rotation' && (
            <RotationPlanner
              rotations={rotations}
              fields={fields}
              onAddRotation={handleAddRotation}
              onUpdateRotation={handleUpdateRotation}
              onDeleteRotation={handleDeleteRotation}
            />
          )}

          {activeTab === 'operations' && (
            <OperationLog
              operations={operations}
              fields={fields}
              onAddOperation={handleAddOperation}
              onUpdateOperation={handleUpdateOperation}
              onDeleteOperation={handleDeleteOperation}
              onCompleteOperation={handleCompleteOperation}
            />
          )}

          {activeTab === 'finances' && (
            <CostAndYield
              expenses={expenses}
              yields={yields}
              fields={fields}
              financialSummary={financialSummary}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onAddYield={handleAddYield}
              onUpdateYield={handleUpdateYield}
              onDeleteYield={handleDeleteYield}
            />
          )}
        </main>
      </div>

      {/* Mobile Responsive Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Architecture & System Info Modal */}
      <SystemInfoModal
        isOpen={isSystemInfoOpen}
        onClose={() => setIsSystemInfoOpen(false)}
        onRefreshData={refreshAllData}
      />

      {/* Field Detail Journal Modal */}
      <FieldDetailModal
        isOpen={isFieldDetailOpen}
        onClose={() => setIsFieldDetailOpen(false)}
        field={selectedFieldForDetail}
        operations={operations}
        expenses={expenses}
        yields={yields}
        rotations={rotations}
      />

      {/* Quick Add Field Modal from Dashboard */}
      <FieldFormModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onSubmit={handleAddField}
      />
    </div>
  );
}

export default App;
