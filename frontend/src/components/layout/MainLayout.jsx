/**
 * Main Layout Component
 * Primary layout wrapper with sidebar, header, and content area
 */

import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

/**
 * Main application layout
 */
const MainLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <Header />

        {/* Page Content - Responsive padding */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
