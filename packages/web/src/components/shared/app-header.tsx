import { Fragment } from "react";
import { Link, useParams, useRouterState } from "@tanstack/react-router";
import { SidebarTrigger } from "#/components/ui/sidebar";
import { Button } from "#/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background md:rounded-t-xl">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <div className="md:hidden block">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="hidden md:block"></div>
        </div>
        <div className="flex items-center gap-2"></div>
      </div>
    </header>
  );
}
