
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ResidentManagement from "./pages/ResidentManagement";
import EvolutionRecords from "./pages/EvolutionRecords";
import ProfessionManagement from "./pages/ProfessionManagement";
import ProfessionalManagement from "./pages/ProfessionalManagement";
import MainLayout from "./components/Layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/residents" element={<ResidentManagement />} />
              <Route path="/evolutions" element={<EvolutionRecords />} />
              <Route path="/professions" element={<ProfessionManagement />} />
              <Route path="/professionals" element={<ProfessionalManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
