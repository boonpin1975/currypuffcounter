'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Store, CheckCircle, AlertCircle, Sparkles, DollarSign, Tag } from 'lucide-react';
import Link from 'next/link';

export default function QuickCounterForm({ vendors, onDeliveryLogged }) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [vendorId, setVendorId] = useState(vendors?.[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(1.50);
  const [date, setDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const selectedVendor = vendors?.find(v => v.id === vendorId);

  useEffect(() => {
    if (selectedVendor) {
      setUnitPrice(selectedVendor.default_price || 1.50);
    }
  }, [vendorId, selectedVendor]);

  useEffect(() => {
    if (!vendorId && vendors && vendors.length > 0) {
      setVendorId(vendors[0].id);
      setUnitPrice(vendors[0].default_price || 1.50);
    }
  }, [vendors, vendorId]);

  const handleQuickAdd = (amount) => {
    setQuantity((prev) => Math.max(1, (parseInt(prev) || 0) + amount));
  };

  const calculatedSubtotal = ((parseInt(quantity) || 0) * (parseFloat(unitPrice) || 0)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!vendorId) {
      setFeedback({ type: 'error', message: 'Please select a vendor first.' });
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid quantity greater than 0.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: vendorId,
          quantity: parseInt(quantity),
          unit_price: parseFloat(unitPrice) || 1.50,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to log delivery');
      }

      setFeedback({
        type: 'success',
        message: data.message || `Logged ${quantity} curry puffs delivered!`,
      });

      if (onDeliveryLogged) {
        onDeliveryLogged();
      }

      setTimeout(() => {
        setFeedback(null);
      }, 4000);

    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-amber-500/40 relative shadow-2xl">
      
      {/* Mobile-friendly Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-100 text-base sm:text-lg">Delivery Counter</h3>
            <p className="text-[11px] text-amber-200/70">Tap & log curry puff shipments instantly</p>
          </div>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 font-bold">
          <Sparkles className="w-3 h-3 text-amber-400" /> Mobile Counter
        </span>
      </div>

      {feedback && (
        <div
          className={`mb-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/60 border-red-500/50 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {(!vendors || vendors.length === 0) ? (
        <div className="text-center py-6 border border-dashed border-amber-900/40 rounded-xl bg-amber-950/20">
          <Store className="w-10 h-10 text-amber-500/50 mx-auto mb-2" />
          <p className="text-sm text-gray-300 font-bold">No Vendors Configured!</p>
          <p className="text-xs text-gray-400 mb-4">Add a vendor to start counting deliveries.</p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-curry-dark font-black text-xs transition-transform active:scale-95"
          >
            + Create Vendor
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Vendor Dropdown */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Vendor</span>
              </span>
              <Link href="/vendors" className="text-[11px] text-amber-400 underline">
                + Manage
              </Link>
            </label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full bg-curry-dark border border-amber-500/40 rounded-xl px-4 py-3 text-sm text-gray-100 font-bold focus:outline-none focus:border-amber-400 min-h-[48px]"
              required
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (RM {(v.default_price || 1.50).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input & Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Curry Puffs Quantity
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-curry-dark border border-amber-500/40 rounded-xl px-4 py-3 text-2xl font-black text-amber-400 focus:outline-none focus:border-amber-400 min-h-[52px] mb-2 text-center tracking-wide"
              required
            />
            
            {/* Large Mobile Quick Add Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => handleQuickAdd(amt)}
                  className="py-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 hover:bg-amber-900 text-amber-300 text-sm font-black transition-all active:scale-95 shadow-md flex items-center justify-center min-h-[44px]"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Rate & Subtotal Panel */}
          <div className="grid grid-cols-2 gap-3 bg-amber-950/40 p-3 rounded-xl border border-amber-500/30">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" />
                <span>Rate (RM)</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-xs text-emerald-400 font-extrabold">RM</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.05"
                  min="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full bg-curry-dark border border-amber-800/60 rounded-lg pl-9 pr-2 py-2 text-sm font-extrabold text-emerald-400 focus:outline-none focus:border-emerald-400 min-h-[40px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span>Total Revenue</span>
              </label>
              <div className="bg-curry-dark border border-emerald-500/40 rounded-lg px-3 py-2 text-sm font-black text-emerald-300 flex items-center justify-between min-h-[40px]">
                <span className="text-xs">RM</span>
                <span className="text-base text-emerald-400">{calculatedSubtotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-curry-dark border border-amber-900/60 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-400 min-h-[44px]"
            />
          </div>

          {/* Big Record Delivery Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-curry-dark font-black text-base shadow-xl shadow-amber-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[52px]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-curry-dark border-t-transparent rounded-full animate-spin" />
                <span>Saving Delivery...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                <span>RECORD DELIVERY (RM {calculatedSubtotal})</span>
              </>
            )}
          </button>

        </form>
      )}
    </div>
  );
}
