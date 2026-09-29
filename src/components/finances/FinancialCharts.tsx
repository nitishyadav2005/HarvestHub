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
  const expenseData = summary.expensesByCategory.map((e) => ({
    name: e.category,
    amount: e.amount
  }));

  const cropData = summary.cropWiseProfitability.map((c) => ({
    name: c.cropName.length > 15 ? c.cropName.substring(0, 15) + '...' : c.cropName,
    Revenue: c.totalRevenue,
    Cost: c.totalCost,
    Profit: c.profit
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Expenses by Category */}
      <ClayCard variant="white" className="border border-emerald-100 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1b4332] mb-1">
            Input Expenses by Category
          </h3>
          <p className="text-xs text-emerald-800/80 mb-4">
            Cost distribution across fertilizers, seeds, labor, equipment & fuel
          </p>
        </div>

        <div className="h-64 w-full">
          {expenseData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-emerald-700">
              No expense data recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {expenseData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${Number(value || 0).toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: '#1b4332',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </div>
      </ClayCard>

      {/* Chart 2: Crop Profitability */}
      <ClayCard variant="white" className="border border-emerald-100 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1b4332] mb-1">
            Crop Profitability Comparison
          </h3>
          <p className="text-xs text-emerald-800/80 mb-4">
            Gross revenue vs cultivation cost vs net margin in ₹ (Rupees)
          </p>
        </div>

        <div className="h-64 w-full">
          {cropData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-emerald-700">
              No harvest yield data recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => `₹${Number(value || 0).toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: '#1b4332',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="Revenue" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cost" fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#74c69d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ClayCard>
    </div>
  );
};
