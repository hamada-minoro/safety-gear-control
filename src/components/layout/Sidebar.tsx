
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChartBar, FileText, LayoutDashboard, Fingerprint } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </Button>
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
