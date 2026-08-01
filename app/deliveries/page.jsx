'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RecentDeliveriesTable from '@/components/RecentDeliveriesTable';
import { History, Store, Filter } from 'lucide-react';

export default function DeliveriesPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      // Fetch vendors list for filter dropdown
      const vRes = await fetch('/api/vendors');
      if (vRes.ok) {
        const vData = await vRes.json();
        setVendors(vData.vendors || []);
      }

      // Fetch deliveries with vendor filter if selected
      const query = selectedVendorId ? `?vendorId=${selectedVendorId}&limit=100` : '?limit=100';
      const dRes = await fetch(`/api/deliveries${query}`);
      if (dRes.ok) {
        const dData = await dRes.json();
        setDeliveries(dData.deliveries || []);
      }
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  }, [router, selectedVendorId]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 border border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <History className="w-6 h-6 text-curry-dark stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-amber-400 tracking-tight">
              Delivery Logs History
            </h1>
            <p className="text-xs text-gray-400">
              Complete chronological audit trail of all curry puff deliveries
            </p>
          </div>
        </div>

        {/* Vendor Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-400 shrink-0" />
          <select
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="bg-curry-dark border border-amber-900/50 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500 transition-colors w-full sm:w-48"
          >
            <option value="">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3" />
          <p className="text-xs text-gray-400">Loading delivery records...</p>
        </div>
      ) : (
        <RecentDeliveriesTable deliveries={deliveries} onDeliveryDeleted={fetchDeliveries} />
      )}

    </div>
  );
}
