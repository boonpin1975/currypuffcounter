'use client';

import { useState } from 'react';
import { Store, Plus, Edit2, Trash2, Check, X, Building2, PackageCheck, DollarSign } from 'lucide-react';

export default function VendorList({ vendors, onVendorUpdated }) {
  const [newVendorName, setNewVendorName] = useState('');
  const [newDefaultPrice, setNewDefaultPrice] = useState(1.50);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingPrice, setEditingPrice] = useState(1.50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Vendor
  const handleAddVendor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newVendorName.trim()) {
      setError('Please enter a vendor name');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newVendorName,
          default_price: parseFloat(newDefaultPrice) || 1.50
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add vendor');

      setNewVendorName('');
      setNewDefaultPrice(1.50);
      setSuccess(`Vendor "${data.vendor.name}" added successfully with default unit price RM ${(data.vendor.default_price || 1.50).toFixed(2)}!`);
      if (onVendorUpdated) onVendorUpdated();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start Editing
  const startEditing = (vendor) => {
    setEditingId(vendor.id);
    setEditingName(vendor.name);
    setEditingPrice(vendor.default_price || 1.50);
  };

  // Save Vendor Edit
  const handleSaveEdit = async (id) => {
    setError('');
    if (!editingName.trim()) {
      setError('Vendor name cannot be empty');
      return;
    }

    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingName,
          default_price: parseFloat(editingPrice) || 1.50
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update vendor');

      setEditingId(null);
      if (onVendorUpdated) onVendorUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Vendor
  const handleDelete = async (vendor) => {
    if (!confirm(`Are you sure you want to delete "${vendor.name}"? This will also remove all logged deliveries for this vendor.`)) {
      return;
    }

    setError('');
    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete vendor');

      if (onVendorUpdated) onVendorUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Add New Vendor Form */}
      <div className="glass-panel rounded-2xl p-6 border border-amber-900/30">
        <h3 className="font-bold text-gray-100 text-base mb-1 flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-400" />
          <span>Add New Vendor Location</span>
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Create a vendor account with default unit price (RM) to begin logging curry puff deliveries.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
            {success}
          </div>
        )}

        <form onSubmit={handleAddVendor} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Vendor Name (e.g. Uncle Ali's Cafe)"
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
              className="w-full bg-curry-dark border border-amber-900/50 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-emerald-400 font-bold">RM</span>
              <input
                type="number"
                step="0.05"
                min="0.1"
                placeholder="Unit Price"
                value={newDefaultPrice}
                onChange={(e) => setNewDefaultPrice(e.target.value)}
                className="w-full bg-curry-dark border border-amber-900/50 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-emerald-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-curry-dark font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Vendors Grid */}
      <div className="glass-panel rounded-2xl p-6 border border-amber-900/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-100 text-sm">
            Active Vendor List ({vendors?.length || 0})
          </h4>
        </div>

        {(!vendors || vendors.length === 0) ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No vendors created yet. Add one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((vendor) => {
              const isEditing = editingId === vendor.id;
              const deliveryCount = vendor._count?.deliveries || 0;
              const defaultPrice = vendor.default_price || 1.50;

              return (
                <div
                  key={vendor.id}
                  className="bg-curry-dark/70 border border-amber-900/40 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-amber-400" />
                    </div>

                    {isEditing ? (
                      <div className="flex flex-col gap-1.5 w-full">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="bg-curry-dark border border-amber-500 rounded-lg px-2.5 py-1 text-sm text-gray-100 focus:outline-none w-full"
                          autoFocus
                        />
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1 text-xs text-emerald-400 font-bold">RM</span>
                          <input
                            type="number"
                            step="0.05"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="bg-curry-dark border border-amber-500 rounded-lg pl-7 pr-2 py-0.5 text-xs text-emerald-400 focus:outline-none w-full font-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-gray-200 text-sm truncate">
                            {vendor.name}
                          </h5>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                            RM {defaultPrice.toFixed(2)}/puff
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-300/70 flex items-center gap-1 mt-0.5">
                          <PackageCheck className="w-3 h-3" />
                          <span>{deliveryCount} delivery record{deliveryCount !== 1 ? 's' : ''}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(vendor.id)}
                          className="p-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 transition-colors"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(vendor)}
                          className="p-2 rounded-lg hover:bg-amber-950/50 text-gray-400 hover:text-amber-300 transition-colors"
                          title="Edit Vendor & Pricing"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor)}
                          className="p-2 rounded-lg hover:bg-red-950/50 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
