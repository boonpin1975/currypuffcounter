'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Store, LayoutDashboard, History, LogOut } from 'lucide-react';

export default function Navbar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Vendors', href: '/vendors', icon: Store },
    { label: 'Deliveries', href: '/deliveries', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-amber-900/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Nat Kitchen Curry Puff Logo Branding */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-md group-hover:scale-105 transition-transform duration-200 overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="Nat Kitchen Curry Puff Logo"
                className="w-full h-full object-contain bg-amber-950 rounded-full"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg text-amber-400 tracking-tight block leading-none">
                Nat Kitchen Curry Puff
              </span>
              <span className="text-[10px] text-amber-200/70 font-semibold tracking-widest uppercase">
                Vendor Counter (RM)
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                        : 'text-gray-300 hover:text-amber-200 hover:bg-amber-950/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Email & Logout */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-xs font-mono text-amber-300/80 bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-900/40">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{loggingOut ? 'Exit...' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-600/40 hover:bg-amber-900/50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
