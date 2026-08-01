'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SummaryCards from '@/components/SummaryCards';
import DeliveryChart from '@/components/DeliveryChart';
import QuickCounterForm from '@/components/QuickCounterForm';
import RecentDeliveriesTable from '@/components/RecentDeliveriesTable';
import { RefreshCw, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const statsRes = await fetch(`/api/deliveries/stats?today=${todayStr}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      const vendorsRes = await fetch('/api/vendors');
      if (vendorsRes.ok) {
        const vendorsData = await vendorsRes.json();
        setVendors(vendorsData.vendors || []);
      }

      const deliveriesRes = await fetch('/api/deliveries?limit=15');
      if (deliveriesRes.ok) {
        const deliveriesData = await deliveriesRes.json();
        setDeliveries(deliveriesData.deliveries || []);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Mobile-First Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-curry-card to-amber-950/30 relative overflow-hidden">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-xl shadow-amber-500/30 shrink-0 overflow-hidden">
            <img
              src="/logo.png"
              alt="Handmade Curry Puff Logo"
              className="w-full h-full object-contain bg-amber-950 rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-amber-400 tracking-tight">
                Curry Puff Counter
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" /> RM Tracker
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-300">
              Mobile-first delivery tracking & revenue calculator
            </p>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/50 text-xs font-bold text-amber-300 transition-colors self-end sm:self-center shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

      </div>

      {/* Primary Mobile Quick Counter Form */}
      <div className="block lg:hidden">
        <QuickCounterForm vendors={vendors} onDeliveryLogged={loadDashboardData} />
      </div>

      {/* Summary Cards */}
      <SummaryCards stats={stats} loading={loading} />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <DeliveryChart data={stats?.chartData} loading={loading} />
          <RecentDeliveriesTable deliveries={deliveries} onDeliveryDeleted={loadDashboardData} />
        </div>

        {/* Desktop Counter Column */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <QuickCounterForm vendors={vendors} onDeliveryLogged={loadDashboardData} />
          </div>
        </div>

      </div>

    </div>
  );
}
