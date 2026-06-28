import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQuery } from "#/lib/session";
import { SidebarProvider, SidebarInset } from "#/components/ui/sidebar";
import { AppSidebar } from "#/components/app-sidebar";
import { AppHeader } from "#/components/shared/app-header";

export const Route = createFileRoute("/dentist")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(sessionQuery);
    if (!user) throw redirect({ to: "/auth" });
    if (user.type !== "dentist") throw redirect({ to: "/" });
    if (
      user.onboarding === false &&
      location.pathname !== "/dentist/onboarding"
    )
      throw redirect({ to: "/dentist/onboarding" });
    return { user };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex flex-1 flex-col min-h-0 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
