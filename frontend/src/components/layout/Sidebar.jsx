/**
 * Sidebar Component
 * Role-aware navigation sidebar with collapsible menu
 */

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, usePermissions } from '@/hooks';
import { useUiStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { NAVIGATION, filterNavigationByRole } from './navigation.config';

/**
 * Single navigation item component
 */
const NavItem = ({ item, isCollapsed, level = 0 }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.href || 
    (hasChildren && item.children.some(child => location.pathname.startsWith(child.href)));
  const isChildActive = hasChildren && item.children.some(child => location.pathname === child.href);

  const Icon = item.icon;

  // Toggle submenu
  const handleToggle = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Collapsed sidebar - show tooltip
  if (isCollapsed && level === 0) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={hasChildren ? item.children[0]?.href : item.href}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <span className="font-medium">{item.title}</span>
            {hasChildren && (
              <div className="flex flex-col gap-1 pt-1 border-t">
                {item.children.map((child) => (
                  <NavLink
                    key={child.href}
                    to={child.href}
                    className={cn(
                      'text-sm px-2 py-1 rounded hover:bg-accent',
                      location.pathname === child.href && 'bg-accent'
                    )}
                  >
                    {child.title}
                  </NavLink>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn('flex flex-col', level > 0 && 'ml-4')}>
      <NavLink
        to={hasChildren ? '#' : item.href}
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
          isActive && !hasChildren
            ? 'bg-primary text-primary-foreground'
            : isActive || isChildActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <span className="flex-1 truncate">{item.title}</span>
        {item.badge && (
          <Badge variant="destructive" className="h-5 px-1.5 text-xs">
            !
          </Badge>
        )}
        {hasChildren && (
          <span className="shrink-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </NavLink>
      
      {hasChildren && isOpen && (
        <div className="mt-1 flex flex-col gap-1">
          {item.children.map((child) => (
            <NavItem key={child.href} item={child} isCollapsed={false} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Main Sidebar component
 */
const Sidebar = ({ className }) => {
  const { role } = usePermissions();
  const { sidebarCollapsed } = useUiStore();
  
  // Filter navigation based on role
  const filteredNav = filterNavigationByRole(NAVIGATION, role);

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b px-4',
        sidebarCollapsed ? 'justify-center' : 'gap-2'
      )}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Pill className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-semibold">MedLan</span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            MedLan Pharmacy v1.0
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
