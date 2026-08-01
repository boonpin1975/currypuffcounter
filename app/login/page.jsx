'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const isRegistered = searchParams.get('registered');
    const paramEmail = searchParams.get('email');

    if (paramEmail) {
      setEmail(paramEmail);
    }

    if (isRegistered === 'true') {
      setSuccessMessage('Account created successfully! Please enter your password to sign in.');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
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
    <div className="max-w-md mx-auto my-6 sm:my-12">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="Handmade Curry Puff Logo"
              className="w-full h-full object-contain bg-amber-950 rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-black text-amber-400 tracking-tight">
            Handmade Curry Puff Counter
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in to track your curry puff delivery fleet
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-500/70 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="vendor@bakery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-curry-dark border border-amber-900/50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-400 min-h-[48px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-500/70 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-curry-dark border border-amber-900/50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-400 min-h-[48px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-curry-dark font-black text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mt-2 min-h-[48px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-curry-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-amber-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12 text-amber-400 font-bold text-sm">
        Loading sign in...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
