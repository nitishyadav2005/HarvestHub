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
import { EquipmentManagement } from './components/equipment/EquipmentManagement';
import { SystemInfoModal } from './components/settings/SystemInfoModal';
import { FieldDetailModal } from './components/fields/FieldDetailModal';
import { FieldFormModal } from './components/fields/FieldFormModal';
import { ConfirmModal } from './components/common/ConfirmModal';

// Services & Types
import { initializeDatabase } from './db/databaseService';
import { fieldService } from './services/fieldService';
import { cropService } from './services/cropService';
import { rotationService } from './services/rotationService';
import { operationService } from './services/operationService';
import { financialService } from './services/financialService';
import { equipmentService } from './services/equipmentService';

import type {
  Field,
  Crop,
  CropRotation,
  FieldOperation,
  Expense,
  YieldRecord,
  FarmFinancialSummary,
  Equipment,
  MaintenanceRecord
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
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Safe UI Confirmation Dialog (no window.confirm in iframe)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

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
        eqList,
        mList,
        fSummary
      ] = await Promise.all([
        fieldService.getAllFields(),
        cropService.getAllCrops(),
        rotationService.getAllRotations(),
        operationService.getAllOperations(),
        financialService.getAllExpenses(),
        financialService.getAllYields(),
        equipmentService.getAllEquipment(),
        equipmentService.getAllMaintenance(),
        financialService.getFinancialSummary()
      ]);

      setFields(fList);
      setCrops(cList);
      setRotations(rList);
      setOperations(oList);
      setExpenses(eList);
      setYields(yList);
      setEquipments(eqList);
      setMaintenanceRecords(mList);
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

  // Reset / Seed 4 test datasets handler
  const handleResetSeedData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Load 4 Seed Datasets for Testing?',
      message: 'This will populate 4 consistent test datasets across all modules: 4 farm field plots, 4 crop varieties, 4 crop rotation plans, 4 pieces of farm equipment, 4 maintenance schedule logs, 4 harvest yield sales, and synchronized operations.',
      confirmText: 'Seed 4 Datasets',
      variant: 'primary',
      onConfirm: async () => {
        await initializeDatabase(true);
        await refreshAllData();
      }
    });
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

  const handleDeleteField = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Field Plot?',
      message: 'Are you sure you want to delete this field plot? All associated crop rotations and operation journals will remain in history.',
      confirmText: 'Delete Plot',
      variant: 'danger',
      onConfirm: async () => {
        await fieldService.deleteField(id);
        await refreshAllData();
      }
    });
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

  const handleDeleteRotation = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Crop Rotation?',
      message: 'Are you sure you want to remove this crop rotation sequence from the farm plan?',
      confirmText: 'Delete Plan',
      variant: 'danger',
      onConfirm: async () => {
        await rotationService.deleteRotation(id);
        await refreshAllData();
      }
    });
  };

  // Operation CRUD Handlers
  const handleAddOperation = async (opData: Omit<FieldOperation, 'id'>) => {
    await operationService.addOperation(opData);
    // If the operation has a cost > 0, also track corresponding expense for data consistency
    if (opData.costInr > 0) {
      const categoryMap: Record<string, Expense['category']> = {
        Fertilization: 'Fertilizers',
        Sowing: 'Seeds',
        'Pest Control': 'Pesticides & Chemicals',
        Weeding: 'Labor & Wages',
        Harvesting: 'Labor & Wages',
        Irrigation: 'Irrigation & Electricity',
        Tillage: 'Machinery & Fuel',
        'Post-Harvest Handling': 'Machinery & Fuel'
      };
      await financialService.addExpense({
        fieldId: opData.fieldId,
        fieldName: opData.fieldName,
        category: categoryMap[opData.operationType] || 'Miscellaneous',
        description: `${opData.operationType}: ${opData.title}`,
        amountInr: opData.costInr,
        date: opData.operationDate,
        paymentMethod: 'UPI',
        notes: opData.materialDetails ? `Material: ${opData.materialDetails}` : opData.notes
      });
    }
    await refreshAllData();
  };

  const handleUpdateOperation = async (id: number, updates: Partial<FieldOperation>) => {
    await operationService.updateOperation(id, updates);
    await refreshAllData();
  };

  const handleDeleteOperation = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Field Operation?',
      message: 'Are you sure you want to remove this field activity log from the farm journal?',
      confirmText: 'Delete Log',
      variant: 'danger',
      onConfirm: async () => {
        await operationService.deleteOperation(id);
        await refreshAllData();
      }
    });
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

  const handleDeleteExpense = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Expense Record?',
      message: 'Are you sure you want to delete this cultivation expense ledger entry?',
      confirmText: 'Delete Entry',
      variant: 'danger',
      onConfirm: async () => {
        await financialService.deleteExpense(id);
        await refreshAllData();
      }
    });
  };

  const handleAddYield = async (yldData: Omit<YieldRecord, 'id'>) => {
    await financialService.addYield(yldData);
    await refreshAllData();
  };

  const handleUpdateYield = async (id: number, updates: Partial<YieldRecord>) => {
    await financialService.updateYield(id, updates);
    await refreshAllData();
  };

  const handleDeleteYield = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Harvest Yield?',
      message: 'Are you sure you want to delete this harvest production and revenue sales record?',
      confirmText: 'Delete Record',
      variant: 'danger',
      onConfirm: async () => {
        await financialService.deleteYield(id);
        await refreshAllData();
      }
    });
  };

  // Equipment CRUD Handlers
  const handleAddEquipment = async (eqData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    await equipmentService.addEquipment(eqData);
    await refreshAllData();
  };

  const handleUpdateEquipment = async (id: number, updates: Partial<Equipment>) => {
    await equipmentService.updateEquipment(id, updates);
    await refreshAllData();
  };

  const handleDeleteEquipment = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Equipment?',
      message: 'Are you sure you want to delete this equipment from your machinery fleet? All associated maintenance history will also be removed.',
      confirmText: 'Delete Equipment',
      variant: 'danger',
      onConfirm: async () => {
        await equipmentService.deleteEquipment(id);
        await refreshAllData();
      }
    });
  };

  // Maintenance CRUD Handlers
  const handleAddMaintenance = async (mData: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    await equipmentService.addMaintenance(mData);
    await refreshAllData();
  };

  const handleUpdateMaintenance = async (id: number, updates: Partial<MaintenanceRecord>) => {
    await equipmentService.updateMaintenance(id, updates);
    await refreshAllData();
  };

  const handleDeleteMaintenance = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Maintenance Log?',
      message: 'Are you sure you want to delete this equipment maintenance schedule/record?',
      confirmText: 'Delete Log',
      variant: 'danger',
      onConfirm: async () => {
        await equipmentService.deleteMaintenance(id);
        await refreshAllData();
      }
    });
  };

  const handleCompleteMaintenance = async (id: number) => {
    await equipmentService.completeMaintenance(id);
    await refreshAllData();
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
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0">
        {/* Desktop & Mobile Drawer Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content View */}
        <main className="flex-1 min-w-0 w-full overflow-hidden">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              fields={fields}
              operations={operations}
              financialSummary={financialSummary}
              equipments={equipments}
              maintenanceRecords={maintenanceRecords}
              onNavigate={(tab) => setActiveTab(tab)}
              onCompleteOperation={handleCompleteOperation}
              onCompleteMaintenance={handleCompleteMaintenance}
              onSelectField={handleOpenFieldDetail}
              onOpenAddField={() => setIsAddFieldModalOpen(true)}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentManagement
              equipments={equipments}
              maintenanceRecords={maintenanceRecords}
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              onDeleteEquipment={handleDeleteEquipment}
              onAddMaintenance={handleAddMaintenance}
              onUpdateMaintenance={handleUpdateMaintenance}
              onDeleteMaintenance={handleDeleteMaintenance}
              onCompleteMaintenance={handleCompleteMaintenance}
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
        onResetSeedData={handleResetSeedData}
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

      {/* Safe UI Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
      />
    </div>
  );
}

export default App;
