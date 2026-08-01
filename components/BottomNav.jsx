'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Store, History } from 'lucide-react';

export default function BottomNav({ user }) {
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Vendors', href: '/vendors', icon: Store },
    { label: 'Deliveries', href: '/deliveries', icon: History },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-curry-dark/95 border-t border-amber-500/30 backdrop-blur-xl px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-amber-400 bg-amber-500/15 font-bold scale-105'
                  : 'text-gray-400 hover:text-amber-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
