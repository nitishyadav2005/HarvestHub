// Core domain models for HarvestHub - Farm Management & Crop Planning

export type SoilType = 
  | 'Black Clay Soil' 
  | 'Alluvial Soil' 
  | 'Loamy Soil' 
  | 'Red Soil' 
  | 'Sandy Loam' 
  | 'Clay Loam';

export type IrrigationType = 
  | 'Drip Irrigation' 
  | 'Sprinkler System' 
  | 'Canal / Flood' 
  | 'Borewell Rain gun' 
  | 'Rainfed';

export type CropCategory = 
  | 'Cereals' 
  | 'Pulses & Legumes' 
  | 'Cash Crop' 
  | 'Oilseeds' 
  | 'Vegetables' 
  | 'Fodder';

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';

export type OperationType = 
  | 'Sowing' 
  | 'Tillage' 
  | 'Irrigation' 
  | 'Fertilization' 
  | 'Pest Control' 
  | 'Weeding' 
  | 'Weed Control' 
  | 'Harvesting' 
  | 'Post-Harvest Handling';

export type OperationStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled';

export type ExpenseCategory = 
  | 'Seeds' 
  | 'Fertilizers' 
  | 'Pesticides & Chemicals' 
  | 'Labor & Wages' 
  | 'Machinery & Fuel' 
  | 'Irrigation & Electricity' 
  | 'Transportation & Mandi Fee' 
  | 'Miscellaneous';

export type YieldQualityGrade = 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Fair)';

// User & Authentication Entities
export interface User {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  farmName: string;
  createdAt: string;
}

// Database Entities

export interface Field {
  id?: number;
  userId?: number;
  name: string;
  code: string;
  sizeAcres: number;
  soilType: SoilType;
  irrigationType: IrrigationType;
  location: string;
  currentCropId?: number;
  currentCropName?: string;
  status: 'Active' | 'Fallow' | 'Preparing';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id?: number;
  userId?: number;
  name: string;
  variety: string;
  category: CropCategory;
  season: CropSeason;
  durationDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  idealSoil: string;
  expectedYieldPerAcreQuintal: number;
  averageMarketPricePerQuintal: number;
  iconName?: string;
}

export interface FieldCropAssignment {
  id?: number;
  userId?: number;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  targetYieldQuintals: number;
  status: 'Planted' | 'Vegetative' | 'Flowering' | 'Harvest Ready' | 'Harvested';
  notes?: string;
}

export interface CropRotation {
  id?: number;
  userId?: number;
  fieldId: number;
  fieldName: string;
  previousCrop: string;
  currentCrop: string;
  nextPlannedCrop: string;
  plannedPlantingDate: string;
  rotationYear: string;
  soilHealthImpact: 'Excellent' | 'Good' | 'Neutral' | 'Demanding';
  nitrogenBalance: 'Restoring (+N)' | 'Neutral' | 'Depleting (-N)';
  notes?: string;
  status: 'Planned' | 'Active' | 'Completed';
  createdAt: string;
}

export interface FieldOperation {
  id?: number;
  userId?: number;
  fieldId: number;
  fieldName: string;
  cropName?: string;
  operationType: OperationType;
  title: string;
  operationDate: string;
  status: OperationStatus;
  costInr: number;
  materialDetails?: string; // e.g. "Urea 50kg, DAP 25kg"
  laborCount?: number;
  notes?: string;
  completedDate?: string;
}

export interface Expense {
  id?: number;
  userId?: number;
  fieldId: number;
  fieldName: string;
  category: ExpenseCategory;
  description: string;
  amountInr: number;
  date: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit / Udhar';
  receiptNumber?: string;
  notes?: string;
}

export interface YieldRecord {
  id?: number;
  userId?: number;
  fieldId: number;
  fieldName: string;
  cropName: string;
  harvestDate: string;
  quantityQuintals: number;
  pricePerQuintalInr: number;
  totalRevenueInr: number;
  buyerName?: string; // e.g. APMC Khanna Mandi, Local Trader
  qualityGrade: YieldQualityGrade;
  storageLocation?: string;
  notes?: string;
}

// Weather & Daily Farm Journal Info
export interface FarmWeather {
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  rainfallChancePercent: number;
  windSpeedKmh: number;
  location: string;
  advisoryTip: string;
}

// Financial Analytics Summary Interface
export interface FarmFinancialSummary {
  totalExpensesInr: number;
  totalRevenueInr: number;
  netProfitInr: number;
  roiPercentage: number;
  expensesByCategory: { category: string; amount: number }[];
  cropWiseProfitability: {
    cropName: string;
    totalCost: number;
    totalRevenue: number;
    profit: number;
    yieldQuintals: number;
  }[];
}

// Equipment & Maintenance Module
export type EquipmentStatus = 
  | 'Operational' 
  | 'Under Maintenance' 
  | 'Needs Attention' 
  | 'In Storage';

export type MaintenanceStatus = 
  | 'Upcoming' 
  | 'Due Soon' 
  | 'Overdue' 
  | 'Completed';

export interface Equipment {
  id?: number;
  userId?: number;
  name: string; // e.g. Mahindra Tractor
  type: string; // e.g. Tractor, Water Pump, Seed Drill, Sprayer
  model: string;
  purchaseDate: string;
  status: EquipmentStatus;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceIntervalDays: number;
  maintenanceCostInr: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceRecord {
  id?: number;
  userId?: number;
  equipmentId: number;
  equipmentName: string;
  maintenanceTask: string;
  scheduledDate: string;
  completedDate?: string;
  status: MaintenanceStatus;
  costInr: number;
  serviceProvider?: string;
  notes?: string;
  createdAt?: string;
}

export function calculateMaintenanceStatus(
  scheduledDate: string,
  currentStatus?: MaintenanceStatus,
  completedDate?: string
): MaintenanceStatus {
  if (currentStatus === 'Completed' || completedDate) {
    return 'Completed';
  }
  
  if (!scheduledDate) return 'Upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(scheduledDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays <= 7) {
    return 'Due Soon';
  } else {
    return 'Upcoming';
  }
}

