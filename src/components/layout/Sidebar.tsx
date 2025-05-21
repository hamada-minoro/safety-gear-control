
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  ChartBar, 
  FileText, 
  LayoutDashboard, 
  Fingerprint, 
  BellRing 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for low stock notifications
const lowStockEpis = [
  { id: "1", name: "Capacete de Segurança", current: 8, min: 5 },
  { id: "2", name: "Luvas de Proteção", current: 12, min: 10 },
  { id: "3", name: "Protetor Auricular", current: 6, min: 5 },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Filter to only show items at or below minimum quantity
  const lowStockAlerts = lowStockEpis.filter(item => item.current <= item.min);
  const hasAlerts = lowStockAlerts.length > 0;

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : isMobile ? "w-full" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center">
            <img
              src="/lovable-uploads/89cf8eaf-8d86-4f1d-80b2-2b8c62e55ca7.png"
              alt="Barcelos Logo"
              className="h-8 w-auto"
            />
            {!collapsed && <span className="ml-2 font-semibold text-sm">Barcelos EPI</span>}
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <img
              src="/lovable-uploads/89cf8eaf-8d86-4f1d-80b2-2b8c62e55ca7.png"
              alt="Barcelos Logo"
              className="h-8 w-auto"
            />
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {isAdmin && (
            <NavItem
              to="/admin/companies"
              icon={<LayoutDashboard size={20} />}
              label="Empresas"
              collapsed={collapsed}
            />
          )}
          {isManager && (
            <>
              <NavItem
                to="/employees"
                icon={<Fingerprint size={20} />}
                label="Colaboradores"
                collapsed={collapsed}
              />
              <NavItem
                to="/epi"
                icon={<FileText size={20} />}
                label="EPIs"
                collapsed={collapsed}
              />
              <NavItem
                to="/processes"
                icon={<FileText size={20} />}
                label="Processos"
                collapsed={collapsed}
              />
              <NavItem
                to="/active-processes"
                icon={<FileText size={20} />}
                label="Processos Ativos"
                collapsed={collapsed}
              />
              <NavItem
                to="/reports"
                icon={<FileText size={20} />}
                label="Relatórios"
                collapsed={collapsed}
              />
              <NavItem
                to="/dashboard"
                icon={<ChartBar size={20} />}
                label="Dashboard"
                collapsed={collapsed}
              />
            </>
          )}
        </nav>
      </div>
      {isManager && (
        <div className="px-4 py-2 border-t border-sidebar-border">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "w-full justify-start",
                  hasAlerts ? "text-red-500" : "text-sidebar-foreground"
                )}
              >
                <BellRing size={18} className="mr-2" />
                {!collapsed && (
                  <>
                    <span>Notificações</span>
                    {hasAlerts && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {lowStockAlerts.length}
                      </span>
                    )}
                  </>
                )}
                {collapsed && hasAlerts && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {lowStockAlerts.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align={collapsed ? "center" : "start"}>
              <div className="space-y-4">
                <div className="font-medium">Alertas de Estoque</div>
                {hasAlerts ? (
                  <div className="space-y-2">
                    {lowStockAlerts.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2 bg-red-50 border border-red-100 rounded-md"
                      >
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-xs">Estoque: {item.current} / Mínimo: {item.min}</div>
                        </div>
                        <NavLink to="/epi">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                          >
                            Ver
                          </Button>
                        </NavLink>
                      </div>
                    ))}
                    <NavLink to="/dashboard" className="w-full block">
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 bg-barcelos text-white hover:bg-barcelos-dark"
                      >
                        Ver todos no Dashboard
                      </Button>
                    </NavLink>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Não há alertas de estoque no momento.</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center text-xs text-sidebar-foreground/80">
            <span>© 2025 Barcelos</span>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-2 py-2 rounded-md text-sidebar-foreground transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )
      }
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm">{label}</span>}
    </NavLink>
  );
};
