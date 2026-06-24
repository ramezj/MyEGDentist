import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dentist/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Edit Profile</h1>
      <p className="text-muted-foreground mt-1">Coming soon.</p>
    </div>
  );
}