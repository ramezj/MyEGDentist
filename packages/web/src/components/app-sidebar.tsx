import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, UserCog, Globe, LogOut, CalendarDays, Tag } from "lucide-react";
import { authClient } from "#/lib/auth-client";
import { useSession } from "#/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  { label: "Appointments", to: "/dentist/appointments", icon: CalendarDays },
  { label: "Services", to: "/dentist/services", icon: Tag },
  { label: "My Profile", to: "/dentist/profile", icon: UserCog },
];

export function AppSidebar() {
  const { data: user } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function signOut() {
    authClient.signOut({
      fetchOptions: { onSuccess: () => { window.location.href = "/auth"; } },
    });
  }

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
              {navItems.map(({ label, to, icon: Icon }) => {
                const isActive =
                  to === "/dentist"
                    ? pathname === "/dentist" || pathname === "/dentist/"
                    : pathname.startsWith(to);
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={to}>
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="text-xs bg-primary/20 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{user?.name ?? ""}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email ?? ""}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}