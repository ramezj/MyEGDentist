import { Fragment } from "react";
import { Link, useParams, useRouterState } from "@tanstack/react-router";
import { SidebarTrigger } from "#/components/ui/sidebar";
import { Button } from "#/components/ui/button";
import { ArrowRight } from "lucide-react";
// import { ThemeToggle } from "#/components/shared/theme-toggle";

const ROUTE_LABELS: Record<string, string> = {
  "/_protected/$slug/": "Dashboard",
  "/_protected/$slug/jobs": "Jobs",
  "/_protected/$slug/jobs/create": "Create job",
  "/_protected/$slug/jobs/$jobId": "Job",
  "/_protected/$slug/candidates": "Candidates",
  "/_protected/$slug/candidates/$jobId": "Candidates",
  "/_protected/$slug/pipelines": "Pipelines",
  "/_protected/$slug/categories": "Categories",
  "/_protected/$slug/offices": "Offices",
  "/_protected/$slug/offices/create": "New office",
  "/_protected/$slug/organization": "Organization",
  "/_protected/$slug/billing": "Billing",
  "/_protected/$slug/team": "Team",
};

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background md:rounded-t-xl">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <div className="md:hidden block">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="hidden md:block">Dashboard</div>
        </div>
        <div className="flex items-center gap-2">{/* <ThemeToggle /> */}</div>
      </div>
    </header>
  );
}
