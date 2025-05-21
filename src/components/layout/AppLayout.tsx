
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";

export const AppLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  // Create a sidebar context value that we'll pass to children
  const sidebarContextValue = React.useMemo(() => ({
    isSidebarOpen: sidebarOpen,
    toggleSidebar: () => setSidebarOpen(prev => !prev),
    openSidebar: () => setSidebarOpen(true),
    closeSidebar: () => setSidebarOpen(false)
  }), [sidebarOpen]);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {isMobile ? (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[85%] max-w-[300px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar />
        )}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(prev => !prev)} />
          <main className="flex-1 overflow-auto p-3 md:p-6">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};
