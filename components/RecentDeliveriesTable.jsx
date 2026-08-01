'use client';

import { useState } from 'react';
import { History, Trash2, Calendar, Store, Utensils, Search, DollarSign } from 'lucide-react';

export default function RecentDeliveriesTable({ deliveries, onDeliveryDeleted }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this delivery entry?')) return;

    try {
      const res = await fetch(`/api/deliveries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      if (onDeliveryDeleted) onDeliveryDeleted();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredDeliveries = (deliveries || []).filter((item) => {
    const vName = item.vendor?.name?.toLowerCase() || '';
    const qStr = String(item.quantity);
    const search = searchTerm.toLowerCase();
    return vName.includes(search) || qStr.includes(search);
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-amber-900/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-base">Delivery History</h3>
            <p className="text-xs text-gray-400">Log of recent curry puff shipments & RM earnings</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendor or quantity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-curry-dark border border-amber-900/40 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-amber-900/30 rounded-xl">
          <Utensils className="w-8 h-8 text-amber-500/30 mx-auto mb-2" />
          No delivery records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs font-semibold uppercase bg-amber-950/40 text-amber-300/80 border-b border-amber-900/40">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Vendor</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Total Revenue</th>
                <th className="px-4 py-3">Date Delivered</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/20">
              {filteredDeliveries.map((item) => {
                const priceRM = item.unit_price || 1.50;
                const totalRM = (item.quantity * priceRM).toFixed(2);

                const itemDate = new Date(item.date);
                const dateFormatted = itemDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const timeFormatted = itemDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={item.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-100 flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item.vendor?.name || 'Unknown Vendor'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        +{item.quantity} puffs
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300 font-mono">
                      RM {priceRM.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400 text-xs font-mono">
                      RM {totalRM}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500/70" />
                        <span>{dateFormatted}</span>
                        <span className="text-[10px] text-gray-500">({timeFormatted})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-950/60 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
