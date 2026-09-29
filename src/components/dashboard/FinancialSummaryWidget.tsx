import React from 'react';
import type { FarmFinancialSummary } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { IndianRupee, TrendingUp, TrendingDown, ArrowRight, PieChart } from 'lucide-react';

interface FinancialSummaryWidgetProps {
  summary: FarmFinancialSummary;
  onNavigateToFinances: () => void;
}

export const FinancialSummaryWidget: React.FC<FinancialSummaryWidgetProps> = ({
  summary,
  onNavigateToFinances
}) => {
  const isProfit = summary.netProfitInr >= 0;

  return (
    <ClayCard variant="white" className="border border-emerald-100 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1b4332] flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#2d6a4f]" /> Cost & Yield Financials
          </h3>
          <p className="text-xs text-emerald-800/80">Season cash flow & net farm profitability</p>
        </div>
        <button
          onClick={onNavigateToFinances}
          className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 transition-colors"
        >
          Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Total Revenue */}
        <div className="p-3.5 rounded-2xl bg-[#e8f5e9] border border-emerald-200">
          <div className="text-xs font-bold text-[#1b4332] uppercase tracking-wide">
            Total Yield Revenue
          </div>
          <div className="text-xl font-black text-[#1b4332] mt-1">
            ₹{summary.totalRevenueInr.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-medium text-emerald-700 mt-0.5">Harvest sales</div>
        </div>

        {/* Total Expenses */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Total Input Cost
          </div>
          <div className="text-xl font-black text-amber-950 mt-1">
            ₹{summary.totalExpensesInr.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-medium text-amber-800 mt-0.5">Inputs & labor</div>
        </div>
      </div>

      {/* Net Profit Banner */}
      <div
        className={`p-4 rounded-2xl border ${
          isProfit
            ? 'bg-emerald-900 text-white border-emerald-700 shadow-md shadow-emerald-900/20'
            : 'bg-red-900 text-white border-red-700'
        } mb-4 flex items-center justify-between`}
      >
        <div>
          <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
            Season Net Profit
          </div>
          <div className="text-2xl font-black mt-0.5">
            ₹{Math.abs(summary.netProfitInr).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-bold text-emerald-200 border border-white/20">
            {isProfit ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" /> +{summary.roiPercentage}% ROI
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-red-300" /> {summary.roiPercentage}% ROI
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expense breakdown preview */}
      <div className="mt-auto pt-3 border-t border-emerald-100">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
          <span className="flex items-center gap-1">
            <PieChart className="w-3.5 h-3.5 text-[#2d6a4f]" /> Top Expense Categories
          </span>
        </div>
        <div className="space-y-1.5">
          {summary.expensesByCategory.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-emerald-950 font-medium">{item.category}</span>
              <span className="font-bold text-emerald-900">₹{item.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </ClayCard>
  );
};
