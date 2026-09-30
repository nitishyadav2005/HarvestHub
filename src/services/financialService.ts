import { db } from '../db';
import type { Expense, YieldRecord, FarmFinancialSummary } from '../types';
import { authService } from './authService';

export interface IFinancialService {
  getAllExpenses(userId?: number): Promise<Expense[]>;
  addExpense(expense: Omit<Expense, 'id'>): Promise<number>;
  updateExpense(id: number, expense: Partial<Expense>): Promise<void>;
  deleteExpense(id: number): Promise<void>;

  getAllYields(userId?: number): Promise<YieldRecord[]>;
  addYield(yieldRecord: Omit<YieldRecord, 'id'>): Promise<number>;
  updateYield(id: number, yieldRecord: Partial<YieldRecord>): Promise<void>;
  deleteYield(id: number): Promise<void>;

  getFinancialSummary(userId?: number): Promise<FarmFinancialSummary>;
}

export class IndexedDBFinancialService implements IFinancialService {
  async getAllExpenses(userId?: number): Promise<Expense[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    if (targetUserId) {
      return await db.expenses
        .filter((e) => e.userId === targetUserId || (!e.userId && targetUserId === 1))
        .toArray();
    }
    return await db.expenses.toArray();
  }

  async addExpense(expense: Omit<Expense, 'id'>): Promise<number> {
    const userId = expense.userId ?? authService.getCurrentUserId() ?? 1;
    return await db.expenses.add({
      ...expense,
      userId
    } as Expense);
  }

  async updateExpense(id: number, expense: Partial<Expense>): Promise<void> {
    await db.expenses.update(id, expense);
  }

  async deleteExpense(id: number): Promise<void> {
    await db.expenses.delete(id);
  }

  async getAllYields(userId?: number): Promise<YieldRecord[]> {
    const targetUserId = userId ?? authService.getCurrentUserId();
    if (targetUserId) {
      return await db.yields
        .filter((y) => y.userId === targetUserId || (!y.userId && targetUserId === 1))
        .toArray();
    }
    return await db.yields.toArray();
  }

  async addYield(yieldRecord: Omit<YieldRecord, 'id'>): Promise<number> {
    const userId = yieldRecord.userId ?? authService.getCurrentUserId() ?? 1;
    return await db.yields.add({
      ...yieldRecord,
      userId
    } as YieldRecord);
  }

  async updateYield(id: number, yieldRecord: Partial<YieldRecord>): Promise<void> {
    await db.yields.update(id, yieldRecord);
  }

  async deleteYield(id: number): Promise<void> {
    await db.yields.delete(id);
  }

  async getFinancialSummary(userId?: number): Promise<FarmFinancialSummary> {
    const expenses = await this.getAllExpenses(userId);
    const yields = await this.getAllYields(userId);

    const totalExpensesInr = expenses.reduce((sum, e) => sum + (e.amountInr || 0), 0);
    const totalRevenueInr = yields.reduce((sum, y) => sum + (y.totalRevenueInr || 0), 0);
    const netProfitInr = totalRevenueInr - totalExpensesInr;
    const roiPercentage = totalExpensesInr > 0 ? (netProfitInr / totalExpensesInr) * 100 : 0;

    // Expenses by Category
    const categoryMap = new Map<string, number>();
    for (const exp of expenses) {
      const cat = exp.category || 'Miscellaneous';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + (exp.amountInr || 0));
    }

    const expensesByCategory = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));

    // Crop-wise Profitability
    const cropMap = new Map<string, { totalCost: number; totalRevenue: number; yieldQuintals: number }>();

    // Accumulate yields
    for (const y of yields) {
      const cropName = y.cropName || 'Other Crop';
      const existing = cropMap.get(cropName) || { totalCost: 0, totalRevenue: 0, yieldQuintals: 0 };
      existing.totalRevenue += y.totalRevenueInr || 0;
      existing.yieldQuintals += y.quantityQuintals || 0;
      cropMap.set(cropName, existing);
    }

    // Accumulate expenses by matching field crops if possible
    const targetUserId = userId ?? authService.getCurrentUserId();
    const fields = targetUserId
      ? await db.fields
          .filter((f) => f.userId === targetUserId || (!f.userId && targetUserId === 1))
          .toArray()
      : await db.fields.toArray();

    const fieldCropLookup = new Map<number, string>();
    fields.forEach((f) => {
      if (f.id && f.currentCropName) {
        fieldCropLookup.set(f.id, f.currentCropName);
      }
    });

    for (const exp of expenses) {
      const cropName = fieldCropLookup.get(exp.fieldId) || 'General Farm Expenses';
      const existing = cropMap.get(cropName) || { totalCost: 0, totalRevenue: 0, yieldQuintals: 0 };
      existing.totalCost += exp.amountInr || 0;
      cropMap.set(cropName, existing);
    }

    const cropWiseProfitability = Array.from(cropMap.entries()).map(([cropName, val]) => ({
      cropName,
      totalCost: val.totalCost,
      totalRevenue: val.totalRevenue,
      profit: val.totalRevenue - val.totalCost,
      yieldQuintals: val.yieldQuintals
    }));

    return {
      totalExpensesInr,
      totalRevenueInr,
      netProfitInr,
      roiPercentage: Number(roiPercentage.toFixed(1)),
      expensesByCategory,
      cropWiseProfitability
    };
  }
}

export const financialService: IFinancialService = new IndexedDBFinancialService();
