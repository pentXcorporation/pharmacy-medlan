/**
 * Header Component
 * Top navigation bar with user menu, branch selector, and notifications
 */

import { Bell, Menu, Moon, Sun, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import BranchSelector from "./BranchSelector";
import UserMenu from "./UserMenu";
import NotificationDropdown from "./NotificationDropdown";

/**
 * Main Header component
 */
const Header = ({ className }) => {
  const { sidebarCollapsed, toggleSidebar, theme, setTheme } = useUiStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "flex h-16 items-center gap-4 border-b bg-card px-4",
        className
      )}
    >
      {/* Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="shrink-0"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Search Bar */}
      <div className="relative hidden md:flex flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products, customers, orders..."
          className="pl-9 bg-background"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Branch Selector */}
        <BranchSelector />

        <Separator orientation="vertical" className="h-6" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="shrink-0"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        <Separator orientation="vertical" className="h-6" />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
