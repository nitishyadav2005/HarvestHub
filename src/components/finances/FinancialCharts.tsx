import React from 'react';
import type { FarmFinancialSummary } from '../../types';
import { ClayCard } from '../common/ClayCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

interface FinancialChartsProps {
  summary: FarmFinancialSummary;
}

const CATEGORY_COLORS = [
  '#2d6a4f',
  '#52b788',
  '#74c69d',
  '#b7e4c7',
  '#d97706',
  '#2563eb',
  '#9333ea',
  '#e11d48'
];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ summary }) => {
  // Chart 1: Normalize & map expense category data
  const expenseData = (summary?.expensesByCategory || [])
    .filter((e) => (Number(e.value ?? e.amount ?? 0)) > 0)
    .map((e) => ({
      name: e.name || e.category || 'Other',
      value: Number(e.value ?? e.amount ?? 0),
      amount: Number(e.value ?? e.amount ?? 0)
    }));

  // Chart 2: Normalize & map crop profitability data
  const cropData = (summary?.cropWiseProfitability || [])
    .filter((c) => (Number(c.revenue ?? c.Revenue ?? c.totalRevenue ?? 0) > 0 || Number(c.cost ?? c.Cost ?? c.totalCost ?? 0) > 0))
    .map((c) => {
      const cropLabel = c.crop || c.cropName || c.name || 'Crop';
      const costVal = Number(c.cost ?? c.Cost ?? c.totalCost ?? 0);
      const revenueVal = Number(c.revenue ?? c.Revenue ?? c.totalRevenue ?? 0);
      const profitVal = Number(c.profit ?? c.Profit ?? (revenueVal - costVal));

      return {
        crop: cropLabel.length > 16 ? cropLabel.substring(0, 16) + '...' : cropLabel,
        name: cropLabel,
        cost: costVal,
        Cost: costVal,
        profit: profitVal,
        Profit: profitVal,
        revenue: revenueVal,
        Revenue: revenueVal
      };
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
      {/* Chart 1: Input Expenses by Category */}
      <ClayCard variant="white" className="border border-emerald-100 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-[#1b4332] mb-1 truncate">
            Input Expenses by Category
          </h3>
          <p className="text-xs text-emerald-800/80 mb-3 truncate">
            Cost distribution across fertilizers, seeds, labor, equipment & fuel
          </p>
        </div>

        <div className="w-full min-w-0 min-h-[260px] flex items-center justify-center">
          {expenseData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center p-4 text-center">
              <p className="text-xs sm:text-sm font-bold text-[#1b4332]">No expense data available</p>
              <p className="text-[11px] text-emerald-800/80 mt-1 max-w-xs">
                Add an expense to see category-wise cost distribution.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={240}>
              <RePieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {expenseData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#1b4332',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                    padding: '8px 12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </div>
      </ClayCard>

      {/* Chart 2: Crop Profitability Comparison */}
      <ClayCard variant="white" className="border border-emerald-100 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-[#1b4332] mb-1 truncate">
            Crop Profitability Comparison
          </h3>
          <p className="text-xs text-emerald-800/80 mb-3 truncate">
            Gross revenue vs cultivation cost vs net margin in ₹ (Rupees)
          </p>
        </div>

        <div className="w-full min-w-0 min-h-[260px] flex items-center justify-center">
          {cropData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center p-4 text-center">
              <p className="text-xs sm:text-sm font-bold text-[#1b4332]">No harvest sales data available</p>
              <p className="text-[11px] text-emerald-800/80 mt-1 max-w-xs">
                Log a harvest yield sale to see crop-wise profitability.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={240}>
              <BarChart data={cropData} margin={{ top: 10, right: 10, left: -5, bottom: 25 }}>
                <XAxis dataKey="crop" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 9 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, name]}
                  contentStyle={{
                    backgroundColor: '#1b4332',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                    padding: '8px 12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="Cost" fill="#d97706" radius={[4, 4, 0, 0]} name="Cost" />
                <Bar dataKey="Profit" fill="#74c69d" radius={[4, 4, 0, 0]} name="Profit" />
                <Bar dataKey="Revenue" fill="#2d6a4f" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ClayCard>
    </div>
  );
};
