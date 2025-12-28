/**
 * User Menu Component
 * Dropdown menu with user profile, settings, and logout
 */

import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Shield, HelpCircle } from "lucide-react";
import { useAuth, usePermissions } from "@/hooks";
import { ROUTES } from "@/config";
import { ROLE_LABELS, ROLE_COLORS } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

/**
 * User Menu dropdown component
 */
const UserMenu = () => {
  const navigate = useNavigate();
  const { user, displayName, initials, logout } = useAuth();
  const { role, isSuperAdmin } = usePermissions();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH.LOGIN);
  };

  if (!user) {
    return (
      <Button variant="ghost" onClick={() => navigate(ROUTES.AUTH.LOGIN)}>
        Sign In
      </Button>
    );
  }

  const roleLabel = ROLE_LABELS[role] || role;
  const roleColor = ROLE_COLORS[role] || "gray";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || user.username}
            </p>
            <Badge
              variant="outline"
              className="w-fit text-xs"
              style={{
                borderColor: roleColor,
                color: roleColor,
              }}
            >
              <Shield className="h-3 w-3 mr-1" />
              {roleLabel}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS.PROFILE)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS.ROOT)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {isSuperAdmin && (
            <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS.SYSTEM)}>
              <Shield className="mr-2 h-4 w-4" />
              <span>System Settings</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/help")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
