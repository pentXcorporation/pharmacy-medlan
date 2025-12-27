import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ROLES } from '@/modules/auth/constants';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/components/ui/Button';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  Truck,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  X,
  Pill,
} from 'lucide-react';

/**
 * Sidebar Component
 * Main navigation sidebar
 */
export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.EMPLOYEE],
    },
    {
      title: 'POS',
      icon: ShoppingCart,
      path: '/pos',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.CASHIER],
    },
    {
      title: 'Inventory',
      icon: Package,
      children: [
        { title: 'Products', path: '/inventory/products' },
        { title: 'Categories', path: '/inventory/categories' },
        { title: 'Stock Transfer', path: '/inventory/stock-transfer' },
        { title: 'Stock Adjustment', path: '/inventory/adjustment' },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.INVENTORY_MANAGER],
    },
    {
      title: 'Sales',
      icon: TrendingUp,
      children: [
        { title: 'All Sales', path: '/sales' },
        { title: 'Sale Returns', path: '/sales/returns' },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.CASHIER],
    },
    {
      title: 'Purchases',
      icon: Truck,
      children: [
        { title: 'Purchase Orders', path: '/purchases/orders' },
        { title: 'GRN', path: '/purchases/grn' },
        { title: 'Suppliers', path: '/purchases/suppliers' },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST],
    },
    {
      title: 'Customers',
      icon: Users,
      path: '/customers',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.CASHIER],
    },
    {
      title: 'Reports',
      icon: BarChart3,
      path: '/reports',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER],
    },
    {
      title: 'Administration',
      icon: Settings,
      children: [
        { title: 'Dashboard', path: '/admin/dashboard' },
        { title: 'Users', path: '/admin/users' },
        { title: 'Roles', path: '/admin/roles' },
        { title: 'Branches', path: '/admin/branches' },
        { title: 'Settings', path: '/admin/settings' },
        { title: 'Audit Logs', path: '/admin/audit-logs' },
      ],
      roles: [ROLES.ADMIN],
    },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border",
        "transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Pill className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">MedLan</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {filteredNavItems.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        item.children.some(child => isActive(child.path))
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                      onClick={() => toggleMenu(item.title)}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        expandedMenus[item.title] && "rotate-180"
                      )} />
                    </button>
                    {expandedMenus[item.title] && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive(child.path)
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                            onClick={onClose}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                    onClick={onClose}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4 bg-sidebar">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user?.fullName || user?.username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
