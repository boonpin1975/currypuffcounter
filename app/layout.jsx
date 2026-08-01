import '@/app/globals.css';
import { getAuthUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Curry Puff Counter - Mobile Vendor Delivery Tracker',
  description: 'Track and analyze curry puff deliveries across vendors on-the-go with real-time analytics.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#181512',
};

export default async function RootLayout({ children }) {
  const user = await getAuthUser();

  return (
    <html lang="en" className="dark">
      <body className="antialiased text-gray-100 flex flex-col min-h-screen pb-16 sm:pb-0 bg-curry-dark">
        <Navbar user={user} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {children}
        </main>
        <BottomNav user={user} />
        <footer className="hidden sm:block py-6 border-t border-amber-950/40 text-center text-xs text-amber-300/50">
          <p>© 2026 Handmade Curry Puff Counter • Designed Mobile-First for Bakers & Delivery Partners</p>
        </footer>
      </body>
    </html>
  );
}
