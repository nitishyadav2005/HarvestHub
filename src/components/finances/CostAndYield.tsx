import React, { useState, useMemo } from 'react';
import type { Expense, YieldRecord, Field, FarmFinancialSummary } from '../../types';
import { FinancialCharts } from './FinancialCharts';
import { ExpenseFormModal } from './ExpenseFormModal';
import { YieldFormModal } from './YieldFormModal';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { IndianRupee, Plus, TrendingUp, TrendingDown, Trash2, Edit, Sprout } from 'lucide-react';
import { computeFinancialSummary } from '../../services/financialService';

interface CostAndYieldProps {
  expenses: Expense[];
  yields: YieldRecord[];
  fields: Field[];
  financialSummary: FarmFinancialSummary;
  onAddExpense: (exp: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (id: number, exp: Partial<Expense>) => void;
  onDeleteExpense: (id: number) => void;
  onAddYield: (yld: Omit<YieldRecord, 'id'>) => void;
  onUpdateYield: (id: number, yld: Partial<YieldRecord>) => void;
  onDeleteYield: (id: number) => void;
}

export const CostAndYield: React.FC<CostAndYieldProps> = ({
  expenses,
  yields,
  fields,
  financialSummary,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onAddYield,
  onUpdateYield,
  onDeleteYield
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'yields'>('expenses');

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false);
  const [editingYield, setEditingYield] = useState<YieldRecord | null>(null);

  // Synchronized single calculation layer across cards and charts
  const summary = useMemo(() => {
    if (
      financialSummary &&
      (financialSummary.expensesByCategory.length > 0 || financialSummary.cropWiseProfitability.length > 0)
    ) {
      return financialSummary;
    }
    return computeFinancialSummary(expenses, yields, fields);
  }, [financialSummary, expenses, yields, fields]);

  const isProfit = summary.netProfitInr >= 0;

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (exp: Expense) => {
    setEditingExpense(exp);
    setIsExpenseModalOpen(true);
  };

  const handleOpenAddYield = () => {
    setEditingYield(null);
    setIsYieldModalOpen(true);
  };

  const handleOpenEditYield = (yld: YieldRecord) => {
    setEditingYield(yld);
    setIsYieldModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-[#1b4332] flex items-center gap-2 truncate">
            <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-[#2d6a4f] shrink-0" /> Cost & Yield Financial Tracking
          </h2>
          <p className="text-xs text-emerald-800/80 font-medium">
            Monitor agricultural inputs, harvest production output, sales revenue, and net profit
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
          <button onClick={handleOpenAddExpense} className="clay-btn-secondary text-xs py-2 px-3.5 cursor-pointer whitespace-nowrap">
            <Plus className="w-3.5 h-3.5" /> Log Expense
          </button>
          <button onClick={handleOpenAddYield} className="clay-btn-primary text-xs py-2 px-3.5 cursor-pointer whitespace-nowrap">
            <Plus className="w-3.5 h-3.5" /> Log Harvest Sales
          </button>
        </div>
      </div>

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <ClayCard variant="white" className="border border-emerald-100 p-3.5 sm:p-4 min-w-0">
          <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider block truncate">
            Total Input Expenses
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-950 mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            ₹{summary.totalExpensesInr.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-800 mt-1 font-medium truncate">Inputs, seeds & labor</p>
        </ClayCard>

        <ClayCard variant="white" className="border border-emerald-100 p-3.5 sm:p-4 min-w-0">
          <span className="text-[11px] sm:text-xs font-bold text-[#1b4332] uppercase tracking-wider block truncate">
            Total Harvest Revenue
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            ₹{summary.totalRevenueInr.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">Mandi sales & MSP</p>
        </ClayCard>

        <ClayCard variant="white" className="border border-emerald-100 p-3.5 sm:p-4 min-w-0">
          <span className="text-[11px] sm:text-xs font-bold text-[#1b4332] uppercase tracking-wider block truncate">
            Net Season Profit
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1.5 sm:mt-2 truncate font-mono tabular-nums">
            ₹{summary.netProfitInr.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium truncate">After all operational costs</p>
        </ClayCard>

        <ClayCard variant="green" className="p-3.5 sm:p-4 min-w-0">
          <span className="text-[11px] sm:text-xs font-bold text-emerald-200 uppercase tracking-wider block truncate">
            Return on Investment
          </span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1.5 sm:mt-2 flex items-center gap-1 truncate font-mono tabular-nums">
            {isProfit ? <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 shrink-0" /> : <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-300 shrink-0" />}
            {summary.roiPercentage}%
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-200 mt-1 font-medium truncate">Profit margin percentage</p>
        </ClayCard>
      </div>

      {/* Visual Analytics Charts */}
      <FinancialCharts summary={summary} />

      {/* Sub Tabs: Expenses vs Harvest Sales */}
      <div className="clay-card p-3 sm:p-4 border border-emerald-100 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-3 mb-4 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSubTab('expenses')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'expenses'
                  ? 'bg-[#2d6a4f] text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Expenses Journal ({expenses.length})
            </button>
            <button
              onClick={() => setActiveSubTab('yields')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'yields'
                  ? 'bg-[#2d6a4f] text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Harvest Yield & Sales ({yields.length})
            </button>
          </div>

          <div className="shrink-0">
            {activeSubTab === 'expenses' ? (
              <button onClick={handleOpenAddExpense} className="clay-btn-primary text-xs py-1.5 px-3">
                <Plus className="w-3.5 h-3.5" /> Add Expense
              </button>
            ) : (
              <button onClick={handleOpenAddYield} className="clay-btn-primary text-xs py-1.5 px-3">
                <Plus className="w-3.5 h-3.5" /> Log Harvest
              </button>
            )}
          </div>
        </div>

        {/* Expenses Table/List */}
        {activeSubTab === 'expenses' && (
          <div>
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-emerald-700 text-xs">
                No expenses logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-emerald-950 min-w-[620px]">
                  <thead className="bg-[#e8f5e9] text-[#1b4332] font-bold uppercase tracking-wider text-[11px] rounded-xl">
                    <tr>
                      <th className="p-3 rounded-l-xl whitespace-nowrap">Date</th>
                      <th className="p-3 whitespace-nowrap">Field</th>
                      <th className="p-3 whitespace-nowrap">Category</th>
                      <th className="p-3 whitespace-nowrap">Description</th>
                      <th className="p-3 whitespace-nowrap">Payment Method</th>
                      <th className="p-3 whitespace-nowrap">Amount (₹)</th>
                      <th className="p-3 text-right rounded-r-xl whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-emerald-50/50 transition-colors font-medium">
                        <td className="p-3 font-semibold text-emerald-900 whitespace-nowrap font-mono tabular-nums">{exp.date}</td>
                        <td className="p-3 font-bold text-[#1b4332] whitespace-nowrap">{exp.fieldName}</td>
                        <td className="p-3 whitespace-nowrap">
                          <Badge variant="green" size="sm">
                            {exp.category}
                          </Badge>
                        </td>
                        <td className="p-3 text-gray-800 max-w-[200px] truncate" title={exp.description}>{exp.description}</td>
                        <td className="p-3 text-emerald-900 font-semibold whitespace-nowrap">{exp.paymentMethod}</td>
                        <td className="p-3 font-black text-amber-950 whitespace-nowrap font-mono tabular-nums">
                          ₹{exp.amountInr.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditExpense(exp)}
                              className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-md cursor-pointer"
                              title="Edit Expense"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {exp.id && (
                              <button
                                onClick={() => onDeleteExpense(exp.id!)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                title="Delete Expense"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Yields Table/List */}
        {activeSubTab === 'yields' && (
          <div>
            {yields.length === 0 ? (
              <div className="text-center py-8 text-emerald-700 text-xs">
                No harvest yield sales logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-emerald-950 min-w-[700px]">
                  <thead className="bg-[#d8f3dc] text-[#1b4332] font-bold uppercase tracking-wider text-[11px] rounded-xl">
                    <tr>
                      <th className="p-3 rounded-l-xl whitespace-nowrap">Harvest Date</th>
                      <th className="p-3 whitespace-nowrap">Field</th>
                      <th className="p-3 whitespace-nowrap">Crop Variety</th>
                      <th className="p-3 whitespace-nowrap">Quantity (Qtl)</th>
                      <th className="p-3 whitespace-nowrap">Rate / Qtl (₹)</th>
                      <th className="p-3 whitespace-nowrap">Total Revenue (₹)</th>
                      <th className="p-3 whitespace-nowrap">Buyer / Mandi</th>
                      <th className="p-3 text-right rounded-r-xl whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {yields.map((yld) => (
                      <tr key={yld.id} className="hover:bg-emerald-50/50 transition-colors font-medium">
                        <td className="p-3 font-semibold text-emerald-900 whitespace-nowrap font-mono tabular-nums">{yld.harvestDate}</td>
                        <td className="p-3 font-bold text-[#1b4332] whitespace-nowrap">{yld.fieldName}</td>
                        <td className="p-3 font-bold text-[#2d6a4f] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {yld.cropName}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-900 whitespace-nowrap font-mono tabular-nums">{yld.quantityQuintals} Quintals</td>
                        <td className="p-3 font-semibold text-gray-800 whitespace-nowrap font-mono tabular-nums">
                          ₹{yld.pricePerQuintalInr.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 font-black text-[#1b4332] text-sm whitespace-nowrap font-mono tabular-nums">
                          ₹{yld.totalRevenueInr.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 font-medium text-emerald-900 whitespace-nowrap">{yld.buyerName || 'Local Mandi'}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditYield(yld)}
                              className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-md cursor-pointer"
                              title="Edit Yield Record"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {yld.id && (
                              <button
                                onClick={() => onDeleteYield(yld.id!)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                title="Delete Yield Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={(expData) => {
          if (editingExpense && editingExpense.id) {
            onUpdateExpense(editingExpense.id, expData);
          } else {
            onAddExpense(expData);
          }
        }}
        fields={fields}
        initialData={editingExpense}
      />

      <YieldFormModal
        isOpen={isYieldModalOpen}
        onClose={() => setIsYieldModalOpen(false)}
        onSubmit={(yldData) => {
          if (editingYield && editingYield.id) {
            onUpdateYield(editingYield.id, yldData);
          } else {
            onAddYield(yldData);
          }
        }}
        fields={fields}
        initialData={editingYield}
      />
    </div>
  );
};
