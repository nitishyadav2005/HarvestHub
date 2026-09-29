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
  | 'Harvesting' 
  | 'Post-Harvest Handling';

export type OperationStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

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

// Database Entities

export interface Field {
  id?: number;
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
  fieldId: number;
  fieldName: string;
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
