'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CRMProvider } from '@/context/CRMContext';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/businesses', label: 'Directory', icon: '🏪' },
  { href: '/admin/outreach', label: 'Outreach', icon: '📧' },
  { href: '/admin/sponsorships', label: 'Sponsors', icon: '💰' },
  { href: '/admin/ads', label: 'Ad Placements', icon: '📢' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary font-display">
                    Locally<span className="text-accent">SF</span>
                  </span>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded">
                    Admin
                  </span>
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>🌐</span>
                View Directory
              </Link>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:hidden border-t border-gray-100 overflow-x-auto">
          <div className="flex px-4 py-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CRMProvider>
          {children}
        </CRMProvider>
      </main>
    </div>
  );
}
