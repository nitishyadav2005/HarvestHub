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
import { Sprout, LandPlot, AlertCircle, ArrowUpRight, Plus, Calendar } from 'lucide-react';

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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Land */}
        <ClayCard variant="white" className="border border-emerald-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Total Land Area
            </span>
            <div className="p-2 rounded-xl bg-[#d8f3dc] text-[#1b4332]">
              <LandPlot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b4332] mt-2">
            {totalAcreage.toFixed(1)} <span className="text-sm font-medium text-emerald-700">Acres</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">
            Across {fields.length} registered plots
          </p>
        </ClayCard>

        {/* Active Crops */}
        <ClayCard variant="white" className="border border-emerald-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Active Crops
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b4332] mt-2">
            {activeCropsCount} <span className="text-sm font-medium text-emerald-700">Varieties</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">
            {activeFields.length} active cultivated fields
          </p>
        </ClayCard>

        {/* Pending Operations */}
        <ClayCard variant="white" className="border border-emerald-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Pending Tasks
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">
            {pendingOpsCount} <span className="text-sm font-medium text-amber-800">Activities</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-medium">
            Next 7 days schedule
          </p>
        </ClayCard>

        {/* Season Net Profit */}
        <ClayCard variant="white" className="border border-emerald-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Farm Profit
            </span>
            <div className="p-2 rounded-xl bg-[#d8f3dc] text-[#1b4332]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b4332] mt-2">
            ₹{(financialSummary.netProfitInr / 1000).toFixed(1)}k
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">
            ROI: +{financialSummary.roiPercentage}%
          </p>
        </ClayCard>
      </div>

      {/* Digital Farm Journal & Weather */}
      <WeatherJournalCard />

      {/* Field Cards Preview - Digital Farm Journal Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1b4332]">Green Valley Farm — Active Plots</h2>
            <p className="text-xs text-emerald-800/80">Real-time status of crops, soil profiles and cultivation schedules</p>
          </div>
          <div className="flex items-center gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.slice(0, 6).map((field) => (
            <ClayCard
              key={field.id}
              variant="white"
              interactive
              onClick={() => onSelectField(field)}
              className="border border-emerald-100 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {field.code}
                    </span>
                    <h3 className="text-base font-bold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors">
                      {field.name}
                    </h3>
                  </div>
                  <Badge variant={field.status === 'Active' ? 'green' : 'amber'} size="sm">
                    {field.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-emerald-950 my-3">
                  <div className="flex justify-between border-b border-emerald-50/60 pb-1">
                    <span className="text-emerald-700 font-medium">Area:</span>
                    <span className="font-bold text-emerald-900">{field.sizeAcres} Acres</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-50/60 pb-1">
                    <span className="text-emerald-700 font-medium">Soil Type:</span>
                    <span className="font-medium text-emerald-900">{field.soilType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700 font-medium">Current Crop:</span>
                    <span className="font-bold text-[#2d6a4f]">
                      {field.currentCropName || 'Fallow / Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {field.irrigationType}
                </span>
                <span className="text-[#2d6a4f] font-bold group-hover:underline flex items-center gap-0.5">
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
