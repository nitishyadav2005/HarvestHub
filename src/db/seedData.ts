import type { 
  Field, 
  Crop, 
  CropRotation, 
  FieldOperation, 
  Expense, 
  YieldRecord,
  Equipment,
  MaintenanceRecord
} from '../types';

export const SAMPLE_CROPS: Omit<Crop, 'id'>[] = [
  {
    name: 'Wheat (HD 2967)',
    variety: 'HD 2967 High Yield',
    category: 'Cereals',
    season: 'Rabi',
    durationDays: 125,
    waterRequirement: 'Medium',
    idealSoil: 'Alluvial & Loamy Soil',
    expectedYieldPerAcreQuintal: 24,
    averageMarketPricePerQuintal: 2275,
    iconName: '🌾'
  },
  {
    name: 'Mustard (Pusa 30)',
    variety: 'Pusa Bold / Pusa 30',
    category: 'Oilseeds',
    season: 'Rabi',
    durationDays: 110,
    waterRequirement: 'Low',
    idealSoil: 'Loamy & Sandy Loam Soil',
    expectedYieldPerAcreQuintal: 10,
    averageMarketPricePerQuintal: 5650,
    iconName: '🌼'
  },
  {
    name: 'Bt Cotton (Bollgard II)',
    variety: 'BG-II Hybrid',
    category: 'Cash Crop',
    season: 'Kharif',
    durationDays: 160,
    waterRequirement: 'Medium',
    idealSoil: 'Black Clay & Deep Loam Soil',
    expectedYieldPerAcreQuintal: 14,
    averageMarketPricePerQuintal: 6800,
    iconName: '☁️'
  },
  {
    name: 'Chickpea / Pulses (JG 11)',
    variety: 'JG 11 Desi Chana',
    category: 'Pulses & Legumes',
    season: 'Rabi',
    durationDays: 105,
    waterRequirement: 'Low',
    idealSoil: 'Sandy Loam & Well-Drained Soil',
    expectedYieldPerAcreQuintal: 11,
    averageMarketPricePerQuintal: 5440,
    iconName: '🫘'
  }
];

export const SAMPLE_FIELDS: Omit<Field, 'id'>[] = [
  {
    name: 'Green Valley Plot A',
    code: 'GVP-A1',
    sizeAcres: 4.5,
    soilType: 'Alluvial Soil',
    irrigationType: 'Sprinkler System',
    location: 'Green Valley Farm, Karnal Agro Belt',
    currentCropId: 1,
    currentCropName: 'Wheat (HD 2967)',
    status: 'Active',
    notes: 'Laser-leveled prime fertile plot with high organic matter, prepared for Rabi wheat cultivation.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    name: 'Kishanpura North Field',
    code: 'KPN-01',
    sizeAcres: 5.0,
    soilType: 'Loamy Soil',
    irrigationType: 'Drip Irrigation',
    location: 'Green Valley Farm, North Sector',
    currentCropId: 2,
    currentCropName: 'Mustard (Pusa 30)',
    status: 'Active',
    notes: 'Automated drip fertigation line installed. Excellent tilth and drainage for oilseed crop.',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-09-22T10:00:00Z'
  },
  {
    name: 'Kishanpura South Field',
    code: 'KPS-02',
    sizeAcres: 6.0,
    soilType: 'Black Clay Soil',
    irrigationType: 'Canal / Flood',
    location: 'Green Valley Farm, South Sector',
    currentCropId: 3,
    currentCropName: 'Bt Cotton (Bollgard II)',
    status: 'Active',
    notes: 'Moisture-retentive deep black clay soil supporting high-density Kharif cotton bolls.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z'
  },
  {
    name: 'Green Valley Plot B',
    code: 'GVP-B2',
    sizeAcres: 3.5,
    soilType: 'Sandy Loam',
    irrigationType: 'Sprinkler System',
    location: 'Green Valley Farm, West Block',
    currentCropId: 4,
    currentCropName: 'Chickpea / Pulses (JG 11)',
    status: 'Active',
    notes: 'Natural biological nitrogen-fixing pulse plot restoring soil nitrogen balance.',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z'
  }
];

export const SAMPLE_CROP_ROTATIONS: Omit<CropRotation, 'id'>[] = [
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    previousCrop: 'Chickpea / Pulses (JG 11)',
    currentCrop: 'Wheat (HD 2967)',
    nextPlannedCrop: 'Mustard (Pusa 30)',
    plannedPlantingDate: '2027-04-10',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Excellent',
    nitrogenBalance: 'Restoring (+N)',
    notes: 'Previous pulses legume enriched soil with residual nitrogen for current wheat; following with deep-root mustard breaks soil compaction.',
    status: 'Active',
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    previousCrop: 'Wheat (HD 2967)',
    currentCrop: 'Mustard (Pusa 30)',
    nextPlannedCrop: 'Chickpea / Pulses (JG 11)',
    plannedPlantingDate: '2027-03-25',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Excellent',
    nitrogenBalance: 'Restoring (+N)',
    notes: 'Mustard deep taproot aerates subsoil hardpan; rotating into pulses will naturally fix biological nitrogen for the next cycle.',
    status: 'Active',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    previousCrop: 'Wheat (HD 2967)',
    currentCrop: 'Bt Cotton (Bollgard II)',
    nextPlannedCrop: 'Wheat (HD 2967)',
    plannedPlantingDate: '2026-11-20',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Good',
    nitrogenBalance: 'Neutral',
    notes: 'Cotton harvest concludes in late autumn, clearing the black soil field for timely winter wheat seeding.',
    status: 'Active',
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    previousCrop: 'Mustard (Pusa 30)',
    currentCrop: 'Chickpea / Pulses (JG 11)',
    nextPlannedCrop: 'Bt Cotton (Bollgard II)',
    plannedPlantingDate: '2027-05-15',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Excellent',
    nitrogenBalance: 'Restoring (+N)',
    notes: 'High root nodulation in chickpea restores nitrogen depletion, leaving optimum soil fertility for subsequent cotton.',
    status: 'Active',
    createdAt: '2026-04-01T10:00:00Z'
  }
];

export const SAMPLE_OPERATIONS: Omit<FieldOperation, 'id'>[] = [
  // Green Valley Plot A — Wheat
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    cropName: 'Wheat (HD 2967)',
    operationType: 'Sowing',
    title: 'Zero-Till Sowing of Wheat (HD 2967)',
    operationDate: '2026-09-15',
    status: 'Completed',
    costInr: 5200,
    materialDetails: 'Certified Wheat HD 2967 Seed (135 kg), DAP Basal Dressing (125 kg)',
    laborCount: 2,
    notes: 'Sown using Shaktiman Zero-Till Seed Drill at 5 cm depth with line spacing 20 cm.',
    completedDate: '2026-09-15'
  },
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    cropName: 'Wheat (HD 2967)',
    operationType: 'Irrigation',
    title: 'First Crown Root Initiation (CRI) Irrigation',
    operationDate: '2026-10-05',
    status: 'Scheduled',
    costInr: 1800,
    materialDetails: 'Sprinkler System running 4.5 hours across Plot A',
    laborCount: 1,
    notes: 'Critical 21-day CRI stage irrigation to establish strong root crowns and tiller buds.'
  },
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    cropName: 'Wheat (HD 2967)',
    operationType: 'Fertilization',
    title: 'First Top Dressing with Neem-Coated Urea',
    operationDate: '2026-10-18',
    status: 'Scheduled',
    costInr: 3400,
    materialDetails: 'Neem-Coated Urea (90 kg), Zinc Sulphate 21% (10 kg)',
    laborCount: 2,
    notes: 'Broadcast after CRI irrigation when soil reaches workable moisture level.'
  },

  // Kishanpura North Field — Mustard
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    cropName: 'Mustard (Pusa 30)',
    operationType: 'Sowing',
    title: 'Precision Sowing of Mustard (Pusa 30)',
    operationDate: '2026-09-10',
    status: 'Completed',
    costInr: 4100,
    materialDetails: 'Treated Pusa 30 Seed (7.5 kg), Single Super Phosphate (150 kg)',
    laborCount: 3,
    notes: 'Sown on raised beds with 45 cm spacing; excellent soil seedbed tilth.',
    completedDate: '2026-09-10'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    cropName: 'Mustard (Pusa 30)',
    operationType: 'Irrigation',
    title: 'Pre-Flowering Drip Fertigation Cycle',
    operationDate: '2026-09-27',
    status: 'Completed',
    costInr: 1600,
    materialDetails: 'Automated Drip Fertigation Line running at 1.5 bar',
    laborCount: 1,
    notes: 'Uniform root-zone moisture maintained across all 5 acres.',
    completedDate: '2026-09-27'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    cropName: 'Mustard (Pusa 30)',
    operationType: 'Fertilization',
    title: 'Agricultural Sulphur & Urea Nutrition Boost',
    operationDate: '2026-09-29',
    status: 'In Progress',
    costInr: 3400,
    materialDetails: 'Agricultural Sulphur 90% WDG (15 kg), Urea (50 kg)',
    laborCount: 2,
    notes: 'Applying elemental sulphur to boost oilseed glucosinolate balance and pod filling.'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    cropName: 'Mustard (Pusa 30)',
    operationType: 'Pest Control',
    title: 'Preventive Neem Bio-Spray for Aphids & Sawfly',
    operationDate: '2026-10-12',
    status: 'Scheduled',
    costInr: 2200,
    materialDetails: 'Azadirachtin 10,000 ppm Neem Formulation (2.5 L), Spreader (250 ml)',
    laborCount: 2,
    notes: 'Morning spray using ASPEE tractor sprayer before ambient temperatures rise.'
  },

  // Kishanpura South Field — Cotton
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    cropName: 'Bt Cotton (Bollgard II)',
    operationType: 'Irrigation',
    title: 'Canal Flood Irrigation & Deep Soil Moisture Soak',
    operationDate: '2026-09-12',
    status: 'Completed',
    costInr: 2400,
    materialDetails: 'Canal water rotational turn, 6 acre-inches volume',
    laborCount: 2,
    notes: 'Deep black clay soil fully saturated during critical boll enlargement stage.',
    completedDate: '2026-09-12'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    cropName: 'Bt Cotton (Bollgard II)',
    operationType: 'Weeding',
    title: 'Inter-Row Cultivation & Manual Weed Clearing',
    operationDate: '2026-09-24',
    status: 'Completed',
    costInr: 4800,
    materialDetails: 'Tractor Cultivator + manual hand khurpi tools',
    laborCount: 6,
    notes: 'Cleared Parthenium & broadleaf weeds between rows and earthed up plant stems.',
    completedDate: '2026-09-24'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    cropName: 'Bt Cotton (Bollgard II)',
    operationType: 'Pest Control',
    title: 'Pheromone Trap Setup for Pink Bollworm Monitoring',
    operationDate: '2026-09-28',
    status: 'Delayed',
    costInr: 1900,
    materialDetails: 'Pectino-lure sticky delta traps (15 units)',
    laborCount: 1,
    notes: 'Traps shipment arrived today; installation rescheduled for early morning.'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    cropName: 'Bt Cotton (Bollgard II)',
    operationType: 'Harvesting',
    title: 'First Picking of Fully Matured White Cotton Bolls',
    operationDate: '2026-10-25',
    status: 'Scheduled',
    costInr: 8500,
    materialDetails: 'Clean cotton picking sacks, dry storage tarpaulins',
    laborCount: 10,
    notes: 'Manual selective picking of stain-free, dry open cotton bolls.'
  },

  // Green Valley Plot B — Pulses
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    cropName: 'Chickpea / Pulses (JG 11)',
    operationType: 'Sowing',
    title: 'Bio-Inoculated Sowing of Chickpea (JG 11)',
    operationDate: '2026-09-14',
    status: 'Completed',
    costInr: 3900,
    materialDetails: 'Rhizobium & PSB Bio-inoculated Chana Seed (80 kg), SSP (100 kg)',
    laborCount: 2,
    notes: 'Bio-fertilizer coating guarantees active root nodulation for nitrogen fixation.',
    completedDate: '2026-09-14'
  },
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    cropName: 'Chickpea / Pulses (JG 11)',
    operationType: 'Weed Control',
    title: 'Pre-Emergence Weed Management Spray',
    operationDate: '2026-09-18',
    status: 'Completed',
    costInr: 2100,
    materialDetails: 'Pendimethalin 30% EC (1.5 L) dissolved in 200 L water',
    laborCount: 1,
    notes: 'Uniform chemical barrier sprayed 48 hours after pulse sowing.',
    completedDate: '2026-09-18'
  },
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    cropName: 'Chickpea / Pulses (JG 11)',
    operationType: 'Fertilization',
    title: 'Foliar Nutrient Booster Spray at Pre-Podding',
    operationDate: '2026-10-08',
    status: 'Scheduled',
    costInr: 1500,
    materialDetails: 'Spray Grade Urea 2% solution (10 kg in 500 L water)',
    laborCount: 1,
    notes: 'Foliar spray to stimulate branching, flower retention, and uniform pod setting.'
  }
];

export const SAMPLE_EXPENSES: Omit<Expense, 'id'>[] = [
  // Green Valley Plot A Expenses
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    category: 'Seeds',
    description: 'Certified Wheat HD 2967 Seeds (135 kg)',
    amountInr: 5200,
    date: '2026-09-15',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0915',
    notes: 'Purchased from National Seeds Corporation Karnal depot.'
  },
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    category: 'Fertilizers',
    description: 'DAP Basal Nutrition Fertilizers (125 kg)',
    amountInr: 3400,
    date: '2026-09-15',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-2026-0916',
    notes: 'IFFCO Kisan Seva Kendra.'
  },

  // Kishanpura North Field Expenses
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    category: 'Seeds',
    description: 'Pusa 30 Mustard Certified Seed & Bio-Fungicide',
    amountInr: 2100,
    date: '2026-09-10',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0910',
    notes: 'Treated seed for prevention of seedling collar rot.'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    category: 'Fertilizers',
    description: 'Single Super Phosphate (SSP) & Agricultural Sulphur',
    amountInr: 3400,
    date: '2026-09-10',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'REC-2026-0911',
    notes: 'Basal fertilizer delivery from Krishi Upaj Mandi.'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    category: 'Irrigation & Electricity',
    description: 'Drip Irrigation Power Bill & Filter Cleaning',
    amountInr: 1600,
    date: '2026-09-27',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-2026-0927',
    notes: 'Maintenance of screen filter & pressure gauge.'
  },

  // Kishanpura South Field Expenses
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    category: 'Irrigation & Electricity',
    description: 'Canal Flood Irrigation Water Cess & Silt Gate Clearance',
    amountInr: 2400,
    date: '2026-09-12',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'REC-2026-0912',
    notes: 'Irrigation department canal turn payment.'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    category: 'Labor & Wages',
    description: 'Manual Weed Eradication & Stem Earthing Up (6 Workers)',
    amountInr: 4800,
    date: '2026-09-24',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-2026-0924',
    notes: 'Daily wage payout to field labor crew.'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    category: 'Pesticides & Chemicals',
    description: 'Pink Bollworm Pheromone Traps & Sticky Plates',
    amountInr: 1900,
    date: '2026-09-28',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0928',
    notes: 'IPM bio-monitoring supplies.'
  },

  // Green Valley Plot B Expenses
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    category: 'Seeds',
    description: 'JG 11 Desi Chickpea Seed & Rhizobium Bio-Culture',
    amountInr: 3900,
    date: '2026-09-14',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0914',
    notes: 'Certified seed with nitrogen inoculant packet.'
  },
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    category: 'Pesticides & Chemicals',
    description: 'Pendimethalin Pre-Emergence Herbicide Solution',
    amountInr: 2100,
    date: '2026-09-18',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-2026-0918',
    notes: 'Broad-spectrum weed suppressor.'
  }
];

export const SAMPLE_YIELDS: Omit<YieldRecord, 'id'>[] = [
  {
    fieldId: 1,
    fieldName: 'Green Valley Plot A',
    cropName: 'Chickpea / Pulses (JG 11)',
    harvestDate: '2026-04-10',
    quantityQuintals: 48,
    pricePerQuintalInr: 5440,
    totalRevenueInr: 261120,
    buyerName: 'Karnal Grain Mandi Trader',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Central Green Valley Silo 1',
    notes: 'High protein content desi chana harvest; preceded current wheat crop in rotation.'
  },
  {
    fieldId: 2,
    fieldName: 'Kishanpura North Field',
    cropName: 'Wheat (HD 2967)',
    harvestDate: '2026-04-18',
    quantityQuintals: 118,
    pricePerQuintalInr: 2275,
    totalRevenueInr: 268450,
    buyerName: 'FCI Procurement Center Punjab',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Direct APMC Mandi Sale',
    notes: 'Sold at Government MSP rates. Excellent test weight; preceded current mustard crop.'
  },
  {
    fieldId: 3,
    fieldName: 'Kishanpura South Field',
    cropName: 'Wheat (HD 2967)',
    harvestDate: '2026-04-22',
    quantityQuintals: 135,
    pricePerQuintalInr: 2275,
    totalRevenueInr: 307125,
    buyerName: 'APMC Khanna Grain Hub',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Khanna Mandi Warehouse Bay 2',
    notes: 'High grain luster and minimal moisture; preceded current cotton crop.'
  },
  {
    fieldId: 4,
    fieldName: 'Green Valley Plot B',
    cropName: 'Mustard (Pusa 30)',
    harvestDate: '2026-03-25',
    quantityQuintals: 34,
    pricePerQuintalInr: 5650,
    totalRevenueInr: 192100,
    buyerName: 'Karnal Oil Mills Syndicate',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Farm Store Shed B',
    notes: '41.5% oil content recorded at test laboratory; preceded current chickpea pulse crop.'
  }
];

export const SAMPLE_EQUIPMENT: Omit<Equipment, 'id'>[] = [
  {
    name: 'Mahindra Tractor',
    type: 'Tractor',
    model: '575 DI XP Plus (47 HP)',
    purchaseDate: '2023-03-15',
    status: 'Operational',
    lastMaintenanceDate: '2026-07-15',
    nextMaintenanceDate: '2026-10-15',
    maintenanceIntervalDays: 90,
    maintenanceCostInr: 4500,
    notes: 'Primary heavy tractor on Green Valley Farm for tillage, sowing, and trolley transport.'
  },
  {
    name: 'Water Pump',
    type: 'Water Pump',
    model: 'Kirloskar 7.5 HP Submersible',
    purchaseDate: '2022-06-10',
    status: 'Operational',
    lastMaintenanceDate: '2026-07-02',
    nextMaintenanceDate: '2026-10-02',
    maintenanceIntervalDays: 90,
    maintenanceCostInr: 1800,
    notes: 'Primary borewell pump supplying automated drip and sprinkler systems.'
  },
  {
    name: 'Seed Drill',
    type: 'Seed Drill',
    model: 'Shaktiman Zero-Till Seeder (9-Row)',
    purchaseDate: '2023-10-05',
    status: 'Operational',
    lastMaintenanceDate: '2026-08-20',
    nextMaintenanceDate: '2026-11-20',
    maintenanceIntervalDays: 90,
    maintenanceCostInr: 2200,
    notes: 'Precision zero-till drill used for direct wheat and pulse sowing.'
  },
  {
    name: 'Sprayer',
    type: 'Sprayer',
    model: 'ASPEE HTP Tractor Sprayer (500 L)',
    purchaseDate: '2024-01-12',
    status: 'Needs Attention',
    lastMaintenanceDate: '2026-05-15',
    nextMaintenanceDate: '2026-08-15',
    maintenanceIntervalDays: 90,
    maintenanceCostInr: 1200,
    notes: 'High-pressure brass nozzles need calibration before scheduled mustard spraying.'
  }
];

export const SAMPLE_MAINTENANCE: Omit<MaintenanceRecord, 'id'>[] = [
  {
    equipmentId: 1,
    equipmentName: 'Mahindra Tractor',
    maintenanceTask: 'Engine Service & Oil Filter Replacement',
    scheduledDate: '2026-10-15',
    status: 'Upcoming',
    costInr: 4500,
    serviceProvider: 'Mahindra Authorized Farm Service Workshop',
    notes: 'Replace 15W-40 engine lube oil, primary diesel filter cartridge, and clean cyclonic air pre-cleaner.'
  },
  {
    equipmentId: 2,
    equipmentName: 'Water Pump',
    maintenanceTask: 'Oil Change & Bearing Lubrication',
    scheduledDate: '2026-10-02',
    status: 'Due Soon',
    costInr: 1800,
    serviceProvider: 'Kirloskar Authorized Agri Technician',
    notes: 'Test motor winding insulation resistance (megger test), check pump thrust collar, grease bearings.'
  },
  {
    equipmentId: 4,
    equipmentName: 'Sprayer',
    maintenanceTask: 'Pressure Regulator & Nozzle Replacement',
    scheduledDate: '2026-08-15',
    status: 'Overdue',
    costInr: 1200,
    serviceProvider: 'Local Agri Equipment Workshop',
    notes: 'Replace 4 worn brass hollow cone spray tips and check relief valve bypass return line.'
  },
  {
    equipmentId: 3,
    equipmentName: 'Seed Drill',
    maintenanceTask: 'Seed Meter Roller Calibration & Chain Greasing',
    scheduledDate: '2026-09-20',
    completedDate: '2026-09-20',
    status: 'Completed',
    costInr: 1600,
    serviceProvider: 'Green Valley Farm Crew',
    notes: 'Calibrated seed meter grams/meter rate and inspected coulter disc opener bearings.'
  },
  {
    equipmentId: 1,
    equipmentName: 'Mahindra Tractor',
    maintenanceTask: '250hr Gearbox & Hydraulic Service',
    scheduledDate: '2026-07-15',
    completedDate: '2026-07-15',
    status: 'Completed',
    costInr: 4200,
    serviceProvider: 'Mahindra Authorized Farm Service Workshop',
    notes: 'Cleaned suction filter strainer, hydraulic fluid top-up, and fan belt deflection adjusted.'
  },
  {
    equipmentId: 2,
    equipmentName: 'Water Pump',
    maintenanceTask: 'Impeller Cleaning & Mechanical Seal Check',
    scheduledDate: '2026-04-05',
    completedDate: '2026-04-05',
    status: 'Completed',
    costInr: 2100,
    serviceProvider: 'Central Pump Repairs',
    notes: 'Sand deposits flushed from diffuser bowls, renewed rubber water deflector.'
  }
];
