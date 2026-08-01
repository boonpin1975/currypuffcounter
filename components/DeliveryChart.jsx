'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-curry-dark border border-amber-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold text-amber-300 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">
          <span className="text-amber-400 font-extrabold text-base">
            {payload[0].value}
          </span>{' '}
          curry puffs delivered
        </p>
      </div>
    );
  }
  return null;
};

export default function DeliveryChart({ data, loading }) {
  const chartData = data && data.length > 0 ? data : [
    { day: 'Mon 01', total: 0 },
    { day: 'Tue 02', total: 0 },
    { day: 'Wed 03', total: 0 },
    { day: 'Thu 04', total: 0 },
    { day: 'Fri 05', total: 0 },
    { day: 'Sat 06', total: 0 },
    { day: 'Sun 07', total: 0 },
  ];

  const maxTotal = Math.max(...chartData.map((d) => d.total), 10);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-amber-900/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-base">
              7-Day Delivery Volume
            </h3>
            <p className="text-xs text-gray-400">
              Total curry puffs delivered per day over the last week
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3831" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }} />
              <Bar
                dataKey="total"
                radius={[8, 8, 0, 0]}
                maxBarSize={45}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.total === maxTotal && maxTotal > 0 ? "url(#activeGradient)" : "url(#amberGradient)"}
                    stroke={entry.total === maxTotal && maxTotal > 0 ? "#fbbf24" : "#d97706"}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
