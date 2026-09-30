import React from 'react';
import type { FarmFinancialSummary } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { IndianRupee, TrendingUp, TrendingDown, ArrowRight, PieChart, Scale } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface FinancialSummaryWidgetProps {
  summary: FarmFinancialSummary;
  onNavigateToFinances: () => void;
}

export const FinancialSummaryWidget: React.FC<FinancialSummaryWidgetProps> = ({
  summary,
  onNavigateToFinances
}) => {
  const isProfit = (summary.netProfitInr ?? 0) >= 0;

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-[#1b4332] flex items-center gap-2 truncate">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#2d6a4f] shrink-0" /> Cost & Yield Financials
          </h3>
          <p className="text-xs text-emerald-800/80 truncate">Season cash flow & net farm profitability</p>
        </div>
        <button
          onClick={onNavigateToFinances}
          className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 transition-colors shrink-0 cursor-pointer ml-2"
        >
          Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Total Revenue */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#e8f5e9] border border-emerald-200 min-w-0">
          <div className="text-[11px] sm:text-xs font-bold text-[#1b4332] uppercase tracking-wide truncate">
            Total Harvest Revenue
          </div>
          <div className="text-lg sm:text-xl font-black text-[#1b4332] mt-1 truncate font-mono tabular-nums">
            {formatINR(summary.totalRevenueInr)}
          </div>
          <div className="text-[11px] font-medium text-emerald-700 mt-0.5 truncate">
            SUM(yields.quantity × price)
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50 border border-amber-200 min-w-0">
          <div className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wide truncate">
            Total Input Expenses
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-950 mt-1 truncate font-mono tabular-nums">
            {formatINR(summary.totalExpensesInr)}
          </div>
          <div className="text-[11px] font-medium text-amber-800 mt-0.5 truncate">
            SUM(expenses.amount)
          </div>
        </div>
      </div>

      {/* Net Profit Banner */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border ${
          isProfit
            ? 'bg-emerald-900 text-white border-emerald-700 shadow-md shadow-emerald-900/20'
            : 'bg-red-900 text-white border-red-700 shadow-md shadow-red-900/20'
        } mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0`}
      >
        <div className="min-w-0">
          <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider truncate">
            Net Season Profit
          </div>
          <div className="text-xl sm:text-2xl font-black mt-0.5 truncate font-mono tabular-nums">
            {formatINR(summary.netProfitInr)}
          </div>
        </div>
        <div className="self-start sm:self-auto shrink-0">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-bold text-emerald-200 border border-white/20 whitespace-nowrap">
            {isProfit ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> {summary.roiPercentage > 0 ? `+${summary.roiPercentage}%` : `${summary.roiPercentage}%`} ROI
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-red-300 shrink-0" /> {summary.roiPercentage}% ROI
              </>
            )}
          </div>
        </div>
      </div>

      {/* Total Yield Banner */}
      <div className="p-3 rounded-2xl bg-[#f0f7f2] border border-emerald-200/80 mb-3 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-[#d8f3dc] text-[#1b4332] shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
              Total Harvest Production
            </span>
            <span className="text-xs sm:text-sm font-black text-[#1b4332] font-mono tabular-nums truncate block">
              {summary.totalYieldFormatted || '0 kg'}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          SUM(yields.quantity)
        </span>
      </div>

      {/* Expense breakdown preview */}
      <div className="mt-auto pt-3 border-t border-emerald-100 min-w-0">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
          <span className="flex items-center gap-1 truncate">
            <PieChart className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" /> Top Expense Categories
          </span>
        </div>
        <div className="space-y-1.5 min-w-0">
          {summary.expensesByCategory.length === 0 ? (
            <p className="text-[11px] text-emerald-700 italic">No expenses recorded yet.</p>
          ) : (
            summary.expensesByCategory.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs min-w-0 gap-2">
                <span className="text-emerald-950 font-medium truncate">{item.category}</span>
                <span className="font-bold text-emerald-900 shrink-0 font-mono tabular-nums">
                  {formatINR(item.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </ClayCard>
  );
};
