'use client';

import { Utensils, Store, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default function SummaryCards({ stats, loading }) {
  const cards = [
    {
      title: 'Total Delivered Today',
      value: stats?.totalDeliveredToday ?? 0,
      unit: 'puffs',
      subValue: `RM ${(stats?.totalRevenueTodayRM ?? 0).toFixed(2)}`,
      icon: Utensils,
      gradient: 'from-amber-500/20 via-amber-600/10 to-transparent',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      badge: 'Today',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      title: 'Total Vendors Active',
      value: stats?.totalVendorsActive ?? 0,
      unit: 'locations',
      subValue: 'Active Partners',
      icon: Store,
      gradient: 'from-orange-500/20 via-orange-600/10 to-transparent',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      badge: 'Vendors',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
    {
      title: 'Active Period Delivery',
      value: stats?.totalDeliveredActive ?? stats?.totalDeliveredThisWeek ?? 0,
      unit: 'puffs',
      subValue: `RM ${(stats?.totalRevenueActiveRM ?? stats?.totalRevenueThisWeekRM ?? 0).toFixed(2)}`,
      icon: Calendar,
      gradient: 'from-yellow-500/20 via-yellow-600/10 to-transparent',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      badge: 'Active Period',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel rounded-2xl p-6 relative overflow-hidden border ${card.borderColor} bg-gradient-to-br ${card.gradient} transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* Background Icon Watermark */}
            <Icon className="absolute -right-3 -bottom-3 w-28 h-28 opacity-10 text-amber-300 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {card.title}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                {card.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-10 w-24 bg-amber-900/30 animate-pulse rounded-lg" />
              ) : (
                <span className={`text-4xl font-extrabold tracking-tight ${card.textColor}`}>
                  {card.value.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {card.unit}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-200/80">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-400">{card.subValue}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                <span>RM Pricing</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
