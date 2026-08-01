'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UtensilsCrossed, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="glass-panel rounded-3xl p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3">
            <UtensilsCrossed className="w-7 h-7 text-curry-dark stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-amber-400 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Start tracking curry puff deliveries across vendors today
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-500/70 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="vendor@bakery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-curry-dark border border-amber-900/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-500/70 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-curry-dark border border-amber-900/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-500/70 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-curry-dark border border-amber-900/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-curry-dark font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-curry-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-amber-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
