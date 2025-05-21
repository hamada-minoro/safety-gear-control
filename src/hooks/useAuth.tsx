
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager";
  companyId?: string;
  companyName?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mock users for demonstration
  const mockUsers = [
    {
      id: "1",
      name: "Admin Barcelos",
      email: "admin@barcelos.com",
      password: "admin123",
      role: "admin" as const,
    },
    {
      id: "2",
      name: "Gestor Empresa",
      email: "gestor@cliente.com",
      password: "gestor123",
      role: "manager" as const,
      companyId: "1",
      companyName: "Empresa Cliente",
    },
  ];

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciais inválidas");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);

      // Redirect based on role
      if (foundUser.role === "admin") {
        navigate("/admin/companies");
      } else {
        navigate("/dashboard");
      }

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de login",
        description: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
