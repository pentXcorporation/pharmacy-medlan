/**
 * App Sidebar Component
 * Role-aware navigation sidebar using shadcn sidebar component
 */

import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Pill } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks";
import { NAVIGATION, filterNavigationByRole } from "./navigation.config";

/**
 * Navigation item with collapsible children
 */
const NavItem = ({ item }) => {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    location.pathname === item.href ||
    (hasChildren &&
      item.children.some((child) => location.pathname.startsWith(child.href)));

  const Icon = item.icon;

  // Close mobile sidebar on navigation
  const handleMobileClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
              {Icon && <Icon />}
              <span>{item.title}</span>
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-5 px-1.5 text-xs"
                >
                  !
                </Badge>
              )}
              <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const isChildActive = location.pathname === child.href;
                return (
                  <SidebarMenuSubItem key={child.href}>
                    <SidebarMenuSubButton asChild isActive={isChildActive}>
                      <NavLink to={child.href} onClick={handleMobileClose}>
                        {ChildIcon && <ChildIcon />}
                        <span>{child.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <NavLink to={item.href} onClick={handleMobileClose}>
          {Icon && <Icon />}
          <span>{item.title}</span>
          {item.badge && (
            <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
              !
            </Badge>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/**
 * Main App Sidebar component
 */
export function AppSidebar({ ...props }) {
  const { role } = usePermissions();

  // Filter navigation based on role
  const filteredNav = filterNavigationByRole(NAVIGATION, role);

  // Group navigation items by category if needed
  const mainNavigation = filteredNav.filter((item) => !item.group);
  const groupedNavigation = filteredNav.reduce((acc, item) => {
    if (item.group) {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
    }
    return acc;
  }, {});

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Pill className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MedLan</span>
                  <span className="truncate text-xs">Pharmacy</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Navigation */}
        {mainNavigation.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavigation.map((item) => (
                  <NavItem key={item.href} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Grouped Navigation */}
        {Object.entries(groupedNavigation).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <NavItem key={item.href} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className="text-xs text-muted-foreground"
            >
              MedLan Pharmacy v1.0
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
