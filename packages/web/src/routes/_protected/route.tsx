import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { sessionQuery } from '#/lib/session'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '#/components/ui/sidebar'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(sessionQuery)
    if (!user) throw redirect({ to: '/auth' })
    return { user }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { user } = Route.useRouteContext()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <p className="font-semibold text-sm">MyEGDentist</p>
          <p className="text-xs text-muted-foreground truncate">{user.name}</p>
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
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
