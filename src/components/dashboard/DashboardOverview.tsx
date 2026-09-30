import type { 
  Field, 
  FieldOperation, 
  FarmFinancialSummary,
  Equipment,
  MaintenanceRecord
} from '../../types';
import { WeatherJournalCard } from './WeatherJournalCard';
import { OperationsWidget } from './OperationsWidget';
import { FinancialSummaryWidget } from './FinancialSummaryWidget';
import { EquipmentMaintenanceWidget } from './EquipmentMaintenanceWidget';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { Sprout, LandPlot, AlertCircle, TrendingUp, TrendingDown, Plus, Scale, IndianRupee, Wallet, Calendar, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface DashboardOverviewProps {
  fields: Field[];
  operations: FieldOperation[];
  financialSummary: FarmFinancialSummary;
  equipments: Equipment[];
  maintenanceRecords: MaintenanceRecord[];
  onNavigate: (tab: string) => void;
  onCompleteOperation: (id: number) => void;
  onCompleteMaintenance: (id: number) => void;
  onSelectField: (field: Field) => void;
  onOpenAddField: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  fields,
  operations,
  financialSummary,
  equipments,
  maintenanceRecords,
  onNavigate,
  onCompleteOperation,
  onCompleteMaintenance,
  onSelectField,
  onOpenAddField
}) => {
  const totalAcreage = fields.reduce((acc, f) => acc + (f.sizeAcres || 0), 0);
  const activeFields = fields.filter((f) => f.status === 'Active');
  const activeCropsCount = new Set(fields.map((f) => f.currentCropName).filter(Boolean)).size;
  const pendingOpsCount = operations.filter((op) => op.status !== 'Completed').length;
  const isProfit = (financialSummary.netProfitInr ?? 0) >= 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* 4 Dashboard Financial Cards (Requirement 7) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-[#2d6a4f]" /> Live Farm Financials (IndexedDB)
          </span>
          <button
            onClick={() => onNavigate('finances')}
            className="text-[11px] font-semibold text-[#2d6a4f] hover:underline cursor-pointer"
          >
            View Cost & Yield →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Expenses = SUM(expenses.amount) */}
          <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider truncate">
                Total Expenses
              </span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black text-amber-950 mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
              {formatINR(financialSummary.totalExpensesInr)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-800 mt-1 font-medium truncate">
              SUM(expenses.amount)
            </p>
          </ClayCard>

          {/* Card 2: Total Revenue = SUM(yields.quantity × yields.sellingPrice) */}
          <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-[#1b4332] uppercase tracking-wider truncate">
                Total Revenue
              </span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#d8f3dc] text-[#1b4332] shrink-0">
                <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black text-[#1b4332] mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
              {formatINR(financialSummary.totalRevenueInr)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">
              SUM(yields.quantity × price)
            </p>
          </ClayCard>

          {/* Card 3: Net Profit = Total Revenue - Total Expenses */}
          <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-[#1b4332] uppercase tracking-wider truncate">
                Net Profit
              </span>
              <div className={`p-1.5 sm:p-2 rounded-xl ${isProfit ? 'bg-[#d8f3dc] text-[#1b4332]' : 'bg-red-100 text-red-700'} shrink-0`}>
                {isProfit ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl font-black mt-1.5 sm:mt-2 truncate font-mono tabular-nums ${isProfit ? 'text-[#1b4332]' : 'text-red-700'}`}>
              {formatINR(financialSummary.netProfitInr)}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">
              Revenue - Expenses (ROI {financialSummary.roiPercentage}%)
            </p>
          </ClayCard>

          {/* Card 4: Total Yield = SUM(yields.quantity) */}
          <ClayCard variant="white" className="border border-emerald-100 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-900 uppercase tracking-wider truncate">
                Total Yield
              </span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-base sm:text-lg md:text-xl font-black text-[#1b4332] mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
              {financialSummary.totalYieldFormatted || '0 kg'}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">
              SUM(yields.quantity)
            </p>
          </ClayCard>
        </div>
      </div>

      {/* Farm Operational Metrics Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Total Land */}
        <div className="clay-card p-3 rounded-2xl border border-emerald-100/90 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider block truncate">
              Registered Land
            </span>
            <div className="text-base sm:text-lg font-black text-[#1b4332] font-mono tabular-nums mt-0.5 truncate">
              {totalAcreage.toFixed(1)} <span className="text-xs font-normal text-emerald-700">Acres</span>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-[#e8f5e9] text-[#1b4332] shrink-0 hidden sm:block">
            <LandPlot className="w-4 h-4" />
          </div>
        </div>

        {/* Active Crops */}
        <div className="clay-card p-3 rounded-2xl border border-emerald-100/90 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider block truncate">
              Active Crops ({activeFields.length} Plots)
            </span>
            <div className="text-base sm:text-lg font-black text-[#1b4332] font-mono tabular-nums mt-0.5 truncate">
              {activeCropsCount} <span className="text-xs font-normal text-emerald-700">Varieties</span>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-[#e8f5e9] text-[#1b4332] shrink-0 hidden sm:block">
            <Sprout className="w-4 h-4" />
          </div>
        </div>

        {/* Pending Operations */}
        <div className="clay-card p-3 rounded-2xl border border-emerald-100/90 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider block truncate">
              Pending Tasks
            </span>
            <div className="text-base sm:text-lg font-black text-amber-950 font-mono tabular-nums mt-0.5 truncate">
              {pendingOpsCount} <span className="text-xs font-normal text-amber-800">Tasks</span>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-amber-100 text-amber-900 shrink-0 hidden sm:block">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Digital Farm Journal & Weather */}
      <WeatherJournalCard />

      {/* Field Cards Preview - Digital Farm Journal Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#1b4332] truncate">Green Valley Farm — Active Plots</h2>
            <p className="text-xs text-emerald-800/80 truncate">Real-time status of crops, soil profiles and cultivation schedules</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAddField}
              className="clay-btn-primary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Add Field
            </button>
            <button
              onClick={() => onNavigate('fields')}
              className="clay-btn-secondary text-xs py-1.5 px-3"
            >
              Manage Fields
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.slice(0, 6).map((field) => (
            <ClayCard
              key={field.id}
              variant="white"
              interactive
              onClick={() => onSelectField(field)}
              className="border border-emerald-100 relative group flex flex-col justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {field.code}
                    </span>
                    <h3 className="text-base font-bold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors truncate">
                      {field.name}
                    </h3>
                  </div>
                  <Badge variant={field.status === 'Active' ? 'green' : 'amber'} size="sm">
                    {field.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-emerald-950 my-3">
                  <div className="flex justify-between items-center border-b border-emerald-50/60 pb-1">
                    <span className="text-emerald-700 font-medium shrink-0">Area:</span>
                    <span className="font-bold text-emerald-900 font-mono tabular-nums">{field.sizeAcres} Acres</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-emerald-50/60 pb-1">
                    <span className="text-emerald-700 font-medium shrink-0">Soil Type:</span>
                    <span className="font-medium text-emerald-900 truncate max-w-[150px] text-right">{field.soilType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-700 font-medium shrink-0">Current Crop:</span>
                    <span className="font-bold text-[#2d6a4f] truncate max-w-[150px] text-right">
                      {field.currentCropName || 'Fallow / Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 flex items-center gap-1 font-medium truncate max-w-[180px]">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {field.irrigationType}
                </span>
                <span className="text-[#2d6a4f] font-bold group-hover:underline flex items-center gap-0.5 shrink-0">
                  Details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </ClayCard>
          ))}
        </div>
      </div>

      {/* Split Widgets: Operations & Equipment Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OperationsWidget
          operations={operations}
          onCompleteOp={onCompleteOperation}
          onNavigateToOperations={() => onNavigate('operations')}
        />
        <EquipmentMaintenanceWidget
          equipments={equipments}
          maintenanceRecords={maintenanceRecords}
          onCompleteMaintenance={onCompleteMaintenance}
          onNavigateToEquipment={() => onNavigate('equipment')}
        />
      </div>

      {/* Farm Financial Performance Overview */}
      <FinancialSummaryWidget
        summary={financialSummary}
        onNavigateToFinances={() => onNavigate('finances')}
      />
    </div>
  );
};
