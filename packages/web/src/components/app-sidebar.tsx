import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "#/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b items-center content-center justify-center">
        <h1 className="font-bold text-lg">EGDentist</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">Home</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
