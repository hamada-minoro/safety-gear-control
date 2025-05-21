
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import Login from "./pages/Login";
import Companies from "./pages/admin/Companies";
import Employees from "./pages/Employees";
import EPIPage from "./pages/EPI";
import Processes from "./pages/Processes";
import ActiveProcesses from "./pages/ActiveProcesses";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route element={<AppLayout />}>
              {/* Admin Routes */}
              <Route path="/admin/companies" element={<Companies />} />
              
              {/* Manager Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/epi" element={<EPIPage />} />
              <Route path="/processes" element={<Processes />} />
              <Route path="/active-processes" element={<ActiveProcesses />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
