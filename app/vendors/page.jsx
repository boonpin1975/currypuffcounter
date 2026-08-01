'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import VendorList from '@/components/VendorList';
import { Store, RefreshCw } from 'lucide-react';

export default function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/vendors');
      if (res.ok) {
        const data = await res.json();
        setVendors(data.vendors || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between glass-panel rounded-3xl p-6 border border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Store className="w-6 h-6 text-curry-dark stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-amber-400 tracking-tight">
              Vendor Management
            </h1>
            <p className="text-xs text-gray-400">
              Manage retail locations, cafes, and kiosks receiving curry puff deliveries
            </p>
          </div>
        </div>

        <button
          onClick={fetchVendors}
          disabled={loading}
          className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/40 text-amber-300 transition-colors"
          title="Reload Vendors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <VendorList vendors={vendors} onVendorUpdated={fetchVendors} />

    </div>
  );
}
