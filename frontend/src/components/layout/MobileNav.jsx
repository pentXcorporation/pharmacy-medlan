/**
 * Mobile Navigation Component
 * Sheet-based navigation for mobile devices
 */

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, ChevronDown, ChevronRight, Pill, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { NAVIGATION, filterNavigationByRole } from "./navigation.config";

/**
 * Mobile navigation item
 */
const MobileNavItem = ({ item, onNavigate, level = 0 }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.href;
  const Icon = item.icon;

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      onNavigate();
    }
  };

  return (
    <div className={cn("flex flex-col", level > 0 && "ml-4")}>
      <NavLink
        to={hasChildren ? "#" : item.href}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-accent"
        )}
      >
        {Icon && <Icon className="h-5 w-5 shrink-0" />}
        <span className="flex-1">{item.title}</span>
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
        <div className="mt-1 flex flex-col gap-1 border-l-2 border-accent ml-3">
          {item.children.map((child) => (
            <MobileNavItem
              key={child.href}
              item={child}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Mobile Navigation Sheet
 */
const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { role } = usePermissions();

  const filteredNav = filterNavigationByRole(NAVIGATION, role);

  const handleNavigate = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Pill className="h-5 w-5" />
            </div>
            <span>MedLan Pharmacy</span>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(100vh-5rem)]">
          <nav className="flex flex-col gap-1 p-4">
            {filteredNav.map((item) => (
              <MobileNavItem
                key={item.href}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
