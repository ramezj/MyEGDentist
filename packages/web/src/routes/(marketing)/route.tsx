import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSession } from "#/lib/session";
import { Navbar } from "#/components/navbar";

export const Route = createFileRoute("/(marketing)")({
  component: MarketingLayout,
});

function MarketingLayout() {
  const { data: session = null } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
}
