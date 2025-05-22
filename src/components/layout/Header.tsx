
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Helper function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes("/admin/companies")) return "Empresas";
    if (path.includes("/employees")) return "Colaboradores";
    if (path.includes("/epi")) return "EPIs";
    if (path.includes("/processes")) return "Processos";
    if (path.includes("/active-processes")) return "Processos Ativos";
    if (path.includes("/reports")) return "Relatórios";
    if (path.includes("/dashboard")) return "Dashboard";
    
    return "Sistema de Gestão de EPI";
  };

  return (
    <header className="border-b bg-card w-full">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </Button>
          )}
          <h1 className={`font-bold text-foreground ${isMobile ? "text-lg" : "text-xl"}`}>
            {isMobile ? getPageTitle() : "Sistema de Gestão de EPI"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                {!isMobile && <span className="hidden md:inline-block">{user?.name}</span>}
                <div className="h-8 w-8 rounded-full bg-barcelos flex items-center justify-center text-white">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {}}>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
