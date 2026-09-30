import { db } from '../db';
import type { CropRotation, SoilType } from '../types';
import { authService } from './authService';

export interface RotationRecommendation {
  recommendedCropName: string;
  category: string;
  reasoning: string;
  expectedBenefits: string[];
  nitrogenImpact: 'Restoring (+N)' | 'Neutral' | 'Depleting (-N)';
  soilCompatibilityScore: number; // 0-100
}

export interface IRotationService {
  getAllRotations(userId?: number): Promise<CropRotation[]>;
  getRotationsByField(fieldId: number): Promise<CropRotation[]>;
  addRotation(rotation: Omit<CropRotation, 'id' | 'createdAt'>): Promise<number>;
  updateRotation(id: number, rotation: Partial<CropRotation>): Promise<void>;
  deleteRotation(id: number): Promise<void>;
  getRotationRecommendations(currentCropName: string, soilType: SoilType): RotationRecommendation[];
}

export class IndexedDBRotationService implements IRotationService {
  async getAllRotations(userId?: number): Promise<CropRotation[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    if (targetUserId) {
      return await db.cropRotations
        .filter((r) => r.userId === targetUserId || (!r.userId && targetUserId === 1))
        .toArray();
    }
    return await db.cropRotations.toArray();
  }

  async getRotationsByField(fieldId: number): Promise<CropRotation[]> {
    return await db.cropRotations.where('fieldId').equals(fieldId).toArray();
  }

  async addRotation(rotation: Omit<CropRotation, 'id' | 'createdAt'>): Promise<number> {
    const userId = rotation.userId ?? authService.getCurrentUserId() ?? 1;
    const newRotation: Omit<CropRotation, 'id'> = {
      ...rotation,
      userId,
      createdAt: new Date().toISOString()
    };
    return await db.cropRotations.add(newRotation as CropRotation);
  }

  async updateRotation(id: number, rotation: Partial<CropRotation>): Promise<void> {
    await db.cropRotations.update(id, rotation);
  }

  async deleteRotation(id: number): Promise<void> {
    await db.cropRotations.delete(id);
  }

  getRotationRecommendations(currentCropName: string, soilType: SoilType): RotationRecommendation[] {
    const cropLower = currentCropName.toLowerCase();
    const recommendations: RotationRecommendation[] = [];

    // Rule 1: If previous crop was a Cereal (Rice, Wheat, Sugarcane) -> Recommend Pulses / Legumes
    if (cropLower.includes('rice') || cropLower.includes('wheat') || cropLower.includes('sugarcane')) {
      recommendations.push({
        recommendedCropName: 'Chickpea / Chana (JG 11)',
        category: 'Pulses & Legumes',
        reasoning: 'Fixes atmospheric Nitrogen into soil via Rhizobium nodules after heavy cereal extraction.',
        expectedBenefits: [
          'Adds up to 35-45 kg N/ha of natural Nitrogen',
          'Breaks cereal root pest cycle',
          'Conserves groundwater with low irrigation needs'
        ],
        nitrogenImpact: 'Restoring (+N)',
        soilCompatibilityScore: soilType.includes('Black') || soilType.includes('Loam') ? 95 : 85
      });
      recommendations.push({
        recommendedCropName: 'Moong Dal (Green Gram)',
        category: 'Pulses & Legumes',
        reasoning: 'Ideal 60-70 day short duration summer pulse. Restores soil structure.',
        expectedBenefits: [
          'High market demand and quick turnover',
          'Excellent green manure biomass residue',
          'Improves soil micro-flora'
        ],
        nitrogenImpact: 'Restoring (+N)',
        soilCompatibilityScore: 90
      });
    }

    // Rule 2: If previous crop was Cotton or Soybean -> Recommend Mustard or Wheat
    if (cropLower.includes('cotton') || cropLower.includes('soybean')) {
      recommendations.push({
        recommendedCropName: 'Mustard (Pusa 30)',
        category: 'Oilseeds',
        reasoning: 'Deep taproot system breaks hardpan and absorbs leftover deep nutrients.',
        expectedBenefits: [
          'Low water requirement for Rabi season',
          'Natural bio-fumigant effect against soil nematodes',
          'High oil content premium price'
        ],
        nitrogenImpact: 'Neutral',
        soilCompatibilityScore: 92
      });
      recommendations.push({
        recommendedCropName: 'Wheat (HD 2967)',
        category: 'Cereals',
        reasoning: 'Thrives on leftover organic nitrogen residue left behind by soybean crop.',
        expectedBenefits: [
          'Guaranteed Govt MSP purchase',
          'High straw yield for livestock fodder',
          'Optimized seed bed conditions'
        ],
        nitrogenImpact: 'Neutral',
        soilCompatibilityScore: 88
      });
    }

    // Rule 3: If vegetable (Tomato, Onion) -> Recommend Legume or Mustard
    if (cropLower.includes('tomato') || cropLower.includes('vegetable')) {
      recommendations.push({
        recommendedCropName: 'Chickpea / Chana',
        category: 'Pulses & Legumes',
        reasoning: 'Prevents solanaceous fungal buildup in soil and restores N reserves.',
        expectedBenefits: ['Interrupts soil-borne pathogen cycle', 'Restores topsoil nutrients'],
        nitrogenImpact: 'Restoring (+N)',
        soilCompatibilityScore: 94
      });
    }

    // Default fallback recommendation
    if (recommendations.length === 0) {
      recommendations.push({
        recommendedCropName: 'Chickpea / Chana (JG 11)',
        category: 'Pulses & Legumes',
        reasoning: 'General green soil-recharging crop.',
        expectedBenefits: ['Nitrogen fixation', 'Soil organic matter replenishment'],
        nitrogenImpact: 'Restoring (+N)',
        soilCompatibilityScore: 85
      });
      recommendations.push({
        recommendedCropName: 'Mustard (Pusa 30)',
        category: 'Oilseeds',
        reasoning: 'Low maintenance cash crop suitable for most soil profiles.',
        expectedBenefits: ['Low irrigation cost', 'Breaks weed cycles'],
        nitrogenImpact: 'Neutral',
        soilCompatibilityScore: 80
      });
    }

    return recommendations;
  }
}

export const rotationService: IRotationService = new IndexedDBRotationService();
