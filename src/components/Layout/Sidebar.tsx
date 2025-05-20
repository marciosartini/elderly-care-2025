
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { ChevronRight, Home, Users, User, Activity, Briefcase } from "lucide-react";

const AppSidebar = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      title: "Residentes",
      icon: Users,
      path: "/residents",
      active: location.pathname === "/residents",
    },
    {
      title: "Profissionais",
      icon: Briefcase,
      path: "/professionals",
      active: location.pathname === "/professionals",
    },
    {
      title: "Evoluções",
      icon: Activity,
      path: "/evolutions",
      active: location.pathname === "/evolutions",
    },
  ];

  // Add admin-only items
  if (isAdmin()) {
    menuItems.push({
      title: "Usuários",
      icon: User,
      path: "/users",
      active: location.pathname === "/users",
    });
    
    menuItems.push({
      title: "Profissões",
      icon: Briefcase,
      path: "/professions",
      active: location.pathname === "/professions",
    });
  }

  return (
    <Sidebar className="border-r border-custom-gray/20">
      <SidebarHeader className="text-center py-6">
        <h2 className="text-2xl font-bold text-custom-beige">Cuidar</h2>
        <p className="text-custom-beige/70 text-sm">Sistema de Gestão</p>
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
              {item.active && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
