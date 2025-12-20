'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useFocusVisible } from '@/hooks/useFocusVisible';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  LogOut,
  Menu,
  X,
  Pill,
  Building2,
  UserCircle,
  ClipboardList,
  PackageCheck,
  ArrowLeftRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { KeyboardShortcutsHelp } from '@/components/accessibility/keyboard-shortcuts-help';
import { SkipToContent } from '@/components/accessibility/skip-to-content';
import { AccessibilityToolbar } from '@/components/accessibility/accessibility-toolbar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'POS', href: '/dashboard/pos', icon: ShoppingCart },
  { name: 'Products', href: '/dashboard/products', icon: Pill },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: ClipboardList },
  { name: 'GRN', href: '/dashboard/grn', icon: PackageCheck },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: Building2 },
  { name: 'Sales', href: '/dashboard/sales', icon: FileText },
  { name: 'Stock Transfer', href: '/dashboard/stock-transfer', icon: ArrowLeftRight },
  { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('User');
  const pathname = usePathname();
  const router = useRouter();
  
  useKeyboardShortcuts();
  useFocusVisible();

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Admin');
    setUserRole(localStorage.getItem('userRole') || 'User');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SkipToContent />
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Pharmacare</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500",
                    isActive 
                      ? "bg-green-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-800 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-3">
                <UserCircle className="w-10 h-10 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {userRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-6 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              <span className="sr-only">Notifications</span>
              🔔
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              <span className="sr-only">Alerts</span>
              ⚠️
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <UserCircle className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-auto p-6" role="main">
          {children}
        </main>
        
        <footer className="bg-white border-t px-6 py-3 text-sm text-gray-600 flex items-center justify-between">
          <span>2020©Copyright</span>
          <span>Developed by: <span className="text-green-600 font-medium">Bdtask</span></span>
        </footer>
        
        <AccessibilityToolbar />
        <KeyboardShortcutsHelp />
      </div>
    </div>
  );
}
