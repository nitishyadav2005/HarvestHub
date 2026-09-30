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
import { AuthScreen } from './components/auth/AuthScreen';

// Services & Types
import { initializeDatabase } from './db/databaseService';
import { authService } from './services/authService';
import { fieldService } from './services/fieldService';
import { cropService } from './services/cropService';
import { rotationService } from './services/rotationService';
import { operationService } from './services/operationService';
import { financialService } from './services/financialService';
import { equipmentService } from './services/equipmentService';

import type {
  User,
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
import { Sprout } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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

  // Refresh all state from IndexedDB for the active user
  const refreshAllData = useCallback(async (targetUserId?: number) => {
    try {
      const activeId = targetUserId ?? currentUser?.id ?? authService.getCurrentUserId() ?? undefined;
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
        fieldService.getAllFields(activeId),
        cropService.getAllCrops(activeId),
        rotationService.getAllRotations(activeId),
        operationService.getAllOperations(activeId),
        financialService.getAllExpenses(activeId),
        financialService.getAllYields(activeId),
        equipmentService.getAllEquipment(activeId),
        equipmentService.getAllMaintenance(activeId),
        financialService.getFinancialSummary(activeId)
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
  }, [currentUser?.id]);

  // Startup initialization: init DB, then restore existing session if present
  useEffect(() => {
    async function init() {
      try {
        const success = await initializeDatabase(false);
        setDbReady(success);
        if (success) {
          const storedUser = await authService.getCurrentUser();
          if (storedUser) {
            setCurrentUser(storedUser);
            await refreshAllData(storedUser.id);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    }
    init();
  }, [refreshAllData]);

  // Authentication Handlers
  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    await refreshAllData(user.id);
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Logout from HarvestHub?',
      message: `Are you sure you want to log out of ${currentUser?.farmName || 'your farm'}? Your farm records and settings remain safely stored in IndexedDB.`,
      confirmText: 'Logout',
      variant: 'primary',
      onConfirm: async () => {
        await authService.logout();
        setCurrentUser(null);
        setActiveTab('dashboard');
      }
    });
  };

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
        await refreshAllData(currentUser?.id);
      }
    });
  };

  // Field CRUD Handlers
  const handleAddField = async (fieldData: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>) => {
    await fieldService.addField({
      ...fieldData,
      userId: currentUser?.id
    });
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
      message: 'Are you sure you want to remove this field? This action cannot be undone and will delete associated plot records.',
      confirmText: 'Delete Field',
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

  // Crop Rotation Handlers
  const handleAddRotation = async (rotationData: Omit<CropRotation, 'id' | 'createdAt'>) => {
    await rotationService.addRotation({
      ...rotationData,
      userId: currentUser?.id
    });
    await refreshAllData();
  };

  const handleUpdateRotation = async (id: number, updates: Partial<CropRotation>) => {
    await rotationService.updateRotation(id, updates);
    await refreshAllData();
  };

  const handleDeleteRotation = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Rotation Plan?',
      message: 'Are you sure you want to delete this crop rotation plan?',
      confirmText: 'Delete Plan',
      variant: 'danger',
      onConfirm: async () => {
        await rotationService.deleteRotation(id);
        await refreshAllData();
      }
    });
  };

  // Field Operations Handlers
  const handleAddOperation = async (opData: Omit<FieldOperation, 'id'>) => {
    await operationService.addOperation({
      ...opData,
      userId: currentUser?.id
    });
    await refreshAllData();
  };

  const handleUpdateOperation = async (id: number, updates: Partial<FieldOperation>) => {
    await operationService.updateOperation(id, updates);
    await refreshAllData();
  };

  const handleDeleteOperation = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Operation Log?',
      message: 'Are you sure you want to delete this operation record?',
      confirmText: 'Delete Record',
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

  // Financial Handlers (Expenses & Yields)
  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    await financialService.addExpense({
      ...expenseData,
      userId: currentUser?.id
    });
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
      message: 'Are you sure you want to delete this expense record?',
      confirmText: 'Delete Expense',
      variant: 'danger',
      onConfirm: async () => {
        await financialService.deleteExpense(id);
        await refreshAllData();
      }
    });
  };

  const handleAddYield = async (yieldData: Omit<YieldRecord, 'id'>) => {
    await financialService.addYield({
      ...yieldData,
      userId: currentUser?.id
    });
    await refreshAllData();
  };

  const handleUpdateYield = async (id: number, updates: Partial<YieldRecord>) => {
    await financialService.updateYield(id, updates);
    await refreshAllData();
  };

  const handleDeleteYield = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Harvest Yield Record?',
      message: 'Are you sure you want to delete this yield record?',
      confirmText: 'Delete Yield',
      variant: 'danger',
      onConfirm: async () => {
        await financialService.deleteYield(id);
        await refreshAllData();
      }
    });
  };

  // Equipment & Maintenance Handlers
  const handleAddEquipment = async (eqData: Omit<Equipment, 'id'>) => {
    await equipmentService.addEquipment({
      ...eqData,
      userId: currentUser?.id
    });
    await refreshAllData();
  };

  const handleUpdateEquipment = async (id: number, updates: Partial<Equipment>) => {
    await equipmentService.updateEquipment(id, updates);
    await refreshAllData();
  };

  const handleDeleteEquipment = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Equipment Record?',
      message: 'Are you sure you want to delete this machinery and its maintenance history?',
      confirmText: 'Delete Equipment',
      variant: 'danger',
      onConfirm: async () => {
        await equipmentService.deleteEquipment(id);
        await refreshAllData();
      }
    });
  };

  const handleAddMaintenance = async (mData: Omit<MaintenanceRecord, 'id'>) => {
    await equipmentService.addMaintenance({
      ...mData,
      userId: currentUser?.id
    });
    await refreshAllData();
  };

  const handleUpdateMaintenance = async (id: number, updates: Partial<MaintenanceRecord>) => {
    await equipmentService.updateMaintenance(id, updates);
    await refreshAllData();
  };

  const handleDeleteMaintenance = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Maintenance Record?',
      message: 'Are you sure you want to delete this maintenance record?',
      confirmText: 'Delete Record',
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

  // 1. Initial Auth Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#f2f6f3] flex flex-col items-center justify-center p-4">
        <div className="clay-card p-8 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] text-white flex items-center justify-center shadow-lg border-2 border-emerald-400/40 animate-pulse">
            <Sprout className="w-9 h-9 text-[#d8f3dc]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1b4332]">HarvestHub</h2>
            <p className="text-xs font-semibold text-emerald-800 italic mt-0.5">
              Farm Management & Crop Planning
            </p>
          </div>
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-[#2d6a4f] rounded-full animate-spin mt-2" />
          <p className="text-xs text-emerald-700 font-medium">
            Loading secure IndexedDB storage...
          </p>
        </div>
      </div>
    );
  }

  // 2. Authentication Screen Guard: Unauthenticated users MUST NOT access dashboard or modules
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Protected HarvestHub Application: User is logged in
  return (
    <div className="min-h-screen flex flex-col bg-[#f2f6f3] text-[#1c2e24]">
      {/* Top Navigation Header with Profile & Logout */}
      <Header
        activeTab={activeTab}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
        onResetSeedData={handleResetSeedData}
        dbReady={dbReady}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        currentUser={currentUser}
        onLogout={handleLogout}
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
          currentUser={currentUser}
          onLogout={handleLogout}
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
        onRefreshData={() => refreshAllData(currentUser?.id)}
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
