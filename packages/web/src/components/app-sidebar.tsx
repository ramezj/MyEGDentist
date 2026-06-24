import { Link } from "@tanstack/react-router";
import { LayoutDashboard, UserCog, Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "#/components/ui/sidebar";

const navItems = [
  { label: "Overview", to: "/dentist", icon: LayoutDashboard },
  { label: "My Profile", to: "/dentist/profile", icon: UserCog },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">EGDentist</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, to, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild>
                    <Link to={to}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}