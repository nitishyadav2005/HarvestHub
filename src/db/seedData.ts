import type { Field, Crop, CropRotation, FieldOperation, Expense, YieldRecord } from '../types';

export const SAMPLE_CROPS: Omit<Crop, 'id'>[] = [
  {
    name: 'Basmati Rice (Pusa 1121)',
    variety: 'Pusa 1121 Premium',
    category: 'Cereals',
    season: 'Kharif',
    durationDays: 135,
    waterRequirement: 'High',
    idealSoil: 'Alluvial & Clay Loam',
    expectedYieldPerAcreQuintal: 22,
    averageMarketPricePerQuintal: 4350,
    iconName: '🌾'
  },
  {
    name: 'Wheat (HD 2967)',
    variety: 'HD 2967 High Yield',
    category: 'Cereals',
    season: 'Rabi',
    durationDays: 125,
    waterRequirement: 'Medium',
    idealSoil: 'Loamy & Black Soil',
    expectedYieldPerAcreQuintal: 24,
    averageMarketPricePerQuintal: 2275,
    iconName: '🌾'
  },
  {
    name: 'Sugarcane (Co 0238)',
    variety: 'Co 0238 High Sugar Content',
    category: 'Cash Crop',
    season: 'Perennial',
    durationDays: 330,
    waterRequirement: 'High',
    idealSoil: 'Deep Black Clay & Alluvial',
    expectedYieldPerAcreQuintal: 380,
    averageMarketPricePerQuintal: 355,
    iconName: '🎋'
  },
  {
    name: 'Bt Cotton (Bollgard II)',
    variety: 'BG-II Hybrid',
    category: 'Cash Crop',
    season: 'Kharif',
    durationDays: 160,
    waterRequirement: 'Medium',
    idealSoil: 'Black Cotton Soil & Deep Loam',
    expectedYieldPerAcreQuintal: 14,
    averageMarketPricePerQuintal: 6800,
    iconName: '☁️'
  },
  {
    name: 'Mustard (Pusa 30)',
    variety: 'Pusa Bold / Pusa 30',
    category: 'Oilseeds',
    season: 'Rabi',
    durationDays: 110,
    waterRequirement: 'Low',
    idealSoil: 'Sandy Loam & Light Soil',
    expectedYieldPerAcreQuintal: 10,
    averageMarketPricePerQuintal: 5650,
    iconName: '🌼'
  },
  {
    name: 'Tomato (Arka Rakshak)',
    variety: 'Arka Rakshak Triple Resistant',
    category: 'Vegetables',
    season: 'Kharif',
    durationDays: 105,
    waterRequirement: 'Medium',
    idealSoil: 'Well Drained Red & Clay Loam',
    expectedYieldPerAcreQuintal: 180,
    averageMarketPricePerQuintal: 1800,
    iconName: '🍅'
  },
  {
    name: 'Chickpea / Chana (JG 11)',
    variety: 'JG 11 Desi Chana',
    category: 'Pulses & Legumes',
    season: 'Rabi',
    durationDays: 105,
    waterRequirement: 'Low',
    idealSoil: 'Black & Loamy Soil',
    expectedYieldPerAcreQuintal: 11,
    averageMarketPricePerQuintal: 5440,
    iconName: '🫘'
  },
  {
    name: 'Soybean (JS 335)',
    variety: 'JS 335 Yellow Soybean',
    category: 'Oilseeds',
    season: 'Kharif',
    durationDays: 95,
    waterRequirement: 'Medium',
    idealSoil: 'Medium to Heavy Black Soil',
    expectedYieldPerAcreQuintal: 12,
    averageMarketPricePerQuintal: 4600,
    iconName: '🌱'
  }
];

export const SAMPLE_FIELDS: Omit<Field, 'id'>[] = [
  {
    name: 'Kishanpura North Field',
    code: 'KPN-01',
    sizeAcres: 5.5,
    soilType: 'Black Clay Soil',
    irrigationType: 'Drip Irrigation',
    location: 'Kishanpura Village, Block B, Punjab',
    currentCropId: 3,
    currentCropName: 'Sugarcane (Co 0238)',
    status: 'Active',
    notes: 'Equipped with sub-surface drip automation. High soil organic carbon.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    name: 'Green Valley Plot A',
    code: 'GVP-A2',
    sizeAcres: 3.2,
    soilType: 'Alluvial Soil',
    irrigationType: 'Sprinkler System',
    location: 'Karnal Agro Belt, Haryana',
    currentCropId: 2,
    currentCropName: 'Wheat (HD 2967)',
    status: 'Active',
    notes: 'Laser leveled in 2025. Excellent water drainage.',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-09-22T10:00:00Z'
  },
  {
    name: 'Narmada Basin South',
    code: 'NBS-03',
    sizeAcres: 4.0,
    soilType: 'Loamy Soil',
    irrigationType: 'Canal / Flood',
    location: 'Hoshangabad District, MP',
    currentCropId: 1,
    currentCropName: 'Basmati Rice (Pusa 1121)',
    status: 'Active',
    notes: 'Rich alluvial river silt deposit. Ideal for aromatic rice varieties.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z'
  },
  {
    name: 'Malwa Organic Patch',
    code: 'MOP-04',
    sizeAcres: 2.5,
    soilType: 'Red Soil',
    irrigationType: 'Drip Irrigation',
    location: 'Ujjain Highway Farm, MP',
    currentCropId: 4,
    currentCropName: 'Bt Cotton (Bollgard II)',
    status: 'Active',
    notes: 'Transitioned to IPM & organic soil conditioning.',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z'
  },
  {
    name: 'Punjab Agro Sector 4',
    code: 'PAS-05',
    sizeAcres: 6.0,
    soilType: 'Sandy Loam',
    irrigationType: 'Borewell Rain gun',
    location: 'Ludhiana Outer Ring, Punjab',
    currentCropId: 5,
    currentCropName: 'Mustard (Pusa 30)',
    status: 'Active',
    notes: 'High micro-nutrient availability (Zinc & Sulphur applied).',
    createdAt: '2026-04-05T10:00:00Z',
    updatedAt: '2026-09-26T10:00:00Z'
  },
  {
    name: 'Bhopal Vegetable Farm',
    code: 'BVF-06',
    sizeAcres: 1.8,
    soilType: 'Clay Loam',
    irrigationType: 'Drip Irrigation',
    location: 'Bhopal Peri-urban Zone, MP',
    currentCropId: 6,
    currentCropName: 'Tomato (Arka Rakshak)',
    status: 'Active',
    notes: 'Staking & mulching applied for high vegetable yield.',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z'
  }
];

export const SAMPLE_CROP_ROTATIONS: Omit<CropRotation, 'id'>[] = [
  {
    fieldId: 1,
    fieldName: 'Kishanpura North Field',
    previousCrop: 'Wheat (HD 2967)',
    currentCrop: 'Sugarcane (Co 0238)',
    nextPlannedCrop: 'Chickpea / Chana (JG 11)',
    plannedPlantingDate: '2027-02-15',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Good',
    nitrogenBalance: 'Restoring (+N)',
    notes: 'Planting legume chickpea after heavy sugarcane feed restores soil Nitrogen naturally.',
    status: 'Active',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    fieldId: 2,
    fieldName: 'Green Valley Plot A',
    previousCrop: 'Basmati Rice (Pusa 1121)',
    currentCrop: 'Wheat (HD 2967)',
    nextPlannedCrop: 'Moong Dal (Green Gram)',
    plannedPlantingDate: '2027-04-01',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Excellent',
    nitrogenBalance: 'Restoring (+N)',
    notes: 'Rice-Wheat rotation broken by short season summer Moong bean.',
    status: 'Active',
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    fieldId: 3,
    fieldName: 'Narmada Basin South',
    previousCrop: 'Soybean (JS 335)',
    currentCrop: 'Basmati Rice (Pusa 1121)',
    nextPlannedCrop: 'Mustard (Pusa 30)',
    plannedPlantingDate: '2026-11-15',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Good',
    nitrogenBalance: 'Neutral',
    notes: 'Deep rooting mustard after shallow root paddy improves soil structure.',
    status: 'Active',
    createdAt: '2026-03-10T10:00:00Z'
  },
  {
    fieldId: 4,
    fieldName: 'Malwa Organic Patch',
    previousCrop: 'Chickpea / Chana (JG 11)',
    currentCrop: 'Bt Cotton (Bollgard II)',
    nextPlannedCrop: 'Wheat (HD 2967)',
    plannedPlantingDate: '2026-11-30',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Good',
    nitrogenBalance: 'Neutral',
    notes: 'Benefited from post-chana residual nitrogen.',
    status: 'Active',
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    fieldId: 5,
    fieldName: 'Punjab Agro Sector 4',
    previousCrop: 'Fallow / Green Manure (Dhaincha)',
    currentCrop: 'Mustard (Pusa 30)',
    nextPlannedCrop: 'Basmati Rice (Pusa 1121)',
    plannedPlantingDate: '2027-06-20',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Excellent',
    nitrogenBalance: 'Restoring (+N)',
    notes: 'Dhaincha green manure plowing increased soil humus by 18%.',
    status: 'Active',
    createdAt: '2026-04-01T10:00:00Z'
  },
  {
    fieldId: 6,
    fieldName: 'Bhopal Vegetable Farm',
    previousCrop: 'Onion (Bhima Super)',
    currentCrop: 'Tomato (Arka Rakshak)',
    nextPlannedCrop: 'Cucumber / Okra',
    plannedPlantingDate: '2026-12-10',
    rotationYear: '2026 - 2027',
    soilHealthImpact: 'Good',
    nitrogenBalance: 'Neutral',
    notes: 'Preventing solanaceous crop continuous planting to prevent fungal wilt.',
    status: 'Active',
    createdAt: '2026-04-15T10:00:00Z'
  }
];

export const SAMPLE_OPERATIONS: Omit<FieldOperation, 'id'>[] = [
  {
    fieldId: 1,
    fieldName: 'Kishanpura North Field',
    operationType: 'Fertilization',
    title: 'Neem-Coated Urea & Micronutrient Drenching',
    operationDate: '2026-09-15',
    status: 'Completed',
    costInr: 6800,
    materialDetails: 'Neem Coated Urea (100 kg), Zinc Sulphate (10 kg), Humic Acid (5 L)',
    laborCount: 3,
    notes: 'Applied through fertigation tank at morning drip pressure.',
    completedDate: '2026-09-15'
  },
  {
    fieldId: 2,
    fieldName: 'Green Valley Plot A',
    operationType: 'Sowing',
    title: 'Precision Seed Drill Sowing of Wheat',
    operationDate: '2026-09-18',
    status: 'Completed',
    costInr: 9500,
    materialDetails: 'Wheat HD 2967 Treated Seed (130 kg), DAP (150 kg)',
    laborCount: 2,
    notes: 'Sown at 5 cm depth with line spacing 20 cm.',
    completedDate: '2026-09-18'
  },
  {
    fieldId: 3,
    fieldName: 'Narmada Basin South',
    operationType: 'Pest Control',
    title: 'Bio-Pesticide Neem Spray for Stem Borer',
    operationDate: '2026-09-22',
    status: 'Completed',
    costInr: 3400,
    materialDetails: 'Azadirachtin 10,000 ppm Neem Oil (3 L), Sticker Agent (500 ml)',
    laborCount: 2,
    notes: 'Proactive spray during high humidity weather.',
    completedDate: '2026-09-22'
  },
  {
    fieldId: 4,
    fieldName: 'Malwa Organic Patch',
    operationType: 'Weeding',
    title: 'Inter-row Cultivation & Manual Weeding',
    operationDate: '2026-09-25',
    status: 'Completed',
    costInr: 4200,
    materialDetails: 'Tractor Power Tiller attachment + Hand Weeders',
    laborCount: 5,
    notes: 'Removed Parthenium & Amaranthus weeds between cotton rows.',
    completedDate: '2026-09-25'
  },
  {
    fieldId: 5,
    fieldName: 'Punjab Agro Sector 4',
    operationType: 'Irrigation',
    title: 'Scheduled Rain-gun Sprinkler Cycle',
    operationDate: '2026-09-29',
    status: 'Scheduled',
    costInr: 1800,
    materialDetails: '5 HP Electric Motor pumping, 4 hours duration',
    laborCount: 1,
    notes: 'Ensure moist soil during mustard germination stage.'
  },
  {
    fieldId: 6,
    fieldName: 'Bhopal Vegetable Farm',
    operationType: 'Harvesting',
    title: 'First Picking of Grade-A Red Tomatoes',
    operationDate: '2026-10-02',
    status: 'Scheduled',
    costInr: 5500,
    materialDetails: 'Plastic Crates (60 nos), Sorting tables',
    laborCount: 6,
    notes: 'Morning harvesting to retain fruit freshness for Mandi dispatch.'
  },
  {
    fieldId: 1,
    fieldName: 'Kishanpura North Field',
    operationType: 'Pest Control',
    title: 'Pheromone Trap Installation & Biological Control',
    operationDate: '2026-10-05',
    status: 'Scheduled',
    costInr: 2200,
    materialDetails: 'Lure Traps (12 units), Trichogramma cards (5 sets)',
    laborCount: 1,
    notes: 'Targeting sugarcane top borer moth prevention.'
  }
];

export const SAMPLE_EXPENSES: Omit<Expense, 'id'>[] = [
  {
    fieldId: 1,
    fieldName: 'Kishanpura North Field',
    category: 'Fertilizers',
    description: 'Neem-Coated Urea (4 Bags) & Micro Nutrients',
    amountInr: 6800,
    date: '2026-09-15',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0915',
    notes: 'Purchased from IFFCO Kisan Seva Kendra.'
  },
  {
    fieldId: 2,
    fieldName: 'Green Valley Plot A',
    category: 'Seeds',
    description: 'Certified Wheat HD 2967 Seeds (130 kg)',
    amountInr: 5200,
    date: '2026-09-17',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-2026-0917',
    notes: 'State Seed Corporation Certified Seed.'
  },
  {
    fieldId: 2,
    fieldName: 'Green Valley Plot A',
    category: 'Machinery & Fuel',
    description: 'Tractor Seed-Drill Rental & Diesel Charges',
    amountInr: 4300,
    date: '2026-09-18',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0918'
  },
  {
    fieldId: 3,
    fieldName: 'Narmada Basin South',
    category: 'Pesticides & Chemicals',
    description: 'Organic Neem Oil Bio-Pesticide & Spreader',
    amountInr: 3400,
    date: '2026-09-22',
    paymentMethod: 'UPI',
    receiptNumber: 'REC-2026-0922'
  },
  {
    fieldId: 4,
    fieldName: 'Malwa Organic Patch',
    category: 'Labor & Wages',
    description: 'Manual Weeding & Soil Earthing Up Labor (5 Workers)',
    amountInr: 4200,
    date: '2026-09-25',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-2026-0925'
  },
  {
    fieldId: 5,
    fieldName: 'Punjab Agro Sector 4',
    category: 'Irrigation & Electricity',
    description: 'Borewell Power Bill & Pipe Maintenance',
    amountInr: 3100,
    date: '2026-09-10',
    paymentMethod: 'Bank Transfer'
  },
  {
    fieldId: 6,
    fieldName: 'Bhopal Vegetable Farm',
    category: 'Miscellaneous',
    description: 'Tomato Staking Bamboo Poles & Twine Strings',
    amountInr: 6400,
    date: '2026-08-28',
    paymentMethod: 'Cash'
  }
];

export const SAMPLE_YIELDS: Omit<YieldRecord, 'id'>[] = [
  {
    fieldId: 2,
    fieldName: 'Green Valley Plot A',
    cropName: 'Basmati Rice (Pusa 1121)',
    harvestDate: '2026-08-20',
    quantityQuintals: 72,
    pricePerQuintalInr: 4400,
    totalRevenueInr: 316800,
    buyerName: 'Khanna APMC Grain Mandi',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Central Warehouse Bay 4',
    notes: 'Moisture content 12.5%. Premium price achieved due to long grain length.'
  },
  {
    fieldId: 3,
    fieldName: 'Narmada Basin South',
    cropName: 'Wheat (HD 2967)',
    harvestDate: '2026-04-12',
    quantityQuintals: 96,
    pricePerQuintalInr: 2275,
    totalRevenueInr: 218400,
    buyerName: 'FCI Procurement Center Hoshangabad',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Direct APMC Mandi Sale',
    notes: 'Sold at Government MSP rates.'
  },
  {
    fieldId: 4,
    fieldName: 'Malwa Organic Patch',
    cropName: 'Chickpea / Chana (JG 11)',
    harvestDate: '2026-03-28',
    quantityQuintals: 28,
    pricePerQuintalInr: 5500,
    totalRevenueInr: 154000,
    buyerName: 'Indore Krishi Upaj Mandi Trader',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Farm Store Shed'
  },
  {
    fieldId: 1,
    fieldName: 'Kishanpura North Field',
    cropName: 'Wheat (HD 2967)',
    harvestDate: '2026-04-18',
    quantityQuintals: 132,
    pricePerQuintalInr: 2275,
    totalRevenueInr: 300300,
    buyerName: 'Ludhiana Grain Hub',
    qualityGrade: 'Grade A (Premium)',
    storageLocation: 'Ludhiana Silo 2'
  }
];
