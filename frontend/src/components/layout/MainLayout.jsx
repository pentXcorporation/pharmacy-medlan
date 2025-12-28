/**
 * Main Layout Component
 * Primary layout wrapper with sidebar, header, and content area
 */

import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * Main application layout
 */
const MainLayout = ({ children }) => {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
