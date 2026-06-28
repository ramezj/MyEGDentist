import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import type { client } from "#/lib/client";

export type DentistListing = Awaited<ReturnType<typeof client.dentists.search>>[number];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const MAX_LANG = 3;
const MAX_SVC = 3;

export function DentistCard({ d }: { d: DentistListing }) {
  return (
    <div className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
      <Avatar className="h-14 w-14 shrink-0 text-base">
        <AvatarImage src={d.user.image ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {initials(d.user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <p className="font-semibold text-base">Dr. {d.user.name}</p>
            <p className="text-sm text-muted-foreground">{d.clinicName}</p>
          </div>
          <Button asChild size="sm" className="shrink-0 self-start">
            <Link to="/dentists/$id" params={{ id: d.id }}>View Profile</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Badge variant="secondary" className="text-xs">{d.specialty}</Badge>
          <span className="text-muted-foreground text-xs flex items-center gap-0.5">
            <MapPin className="w-3 h-3" />{d.city}
          </span>
          {d.experience && (
            <span className="text-muted-foreground text-xs">· {d.experience}</span>
          )}
        </div>

        {d.bio && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{d.bio}</p>
        )}

        <div className="flex flex-wrap gap-1 mt-2.5">
          {d.languages.slice(0, MAX_LANG).map((l) => (
            <Badge key={l} variant="outline" className="text-[11px] px-1.5 py-0">{l}</Badge>
          ))}
          {d.languages.length > MAX_LANG && (
            <Badge variant="outline" className="text-[11px] px-1.5 py-0">
              +{d.languages.length - MAX_LANG} more
            </Badge>
          )}
          {d.services.length > 0 && d.languages.length > 0 && (
            <span className="text-muted-foreground text-xs self-center">·</span>
          )}
          {d.services.slice(0, MAX_SVC).map((s) => (
            <Badge key={s.name} className="text-[11px] px-1.5 py-0 bg-muted text-muted-foreground hover:bg-muted border-0">
              {s.name}
            </Badge>
          ))}
          {d.services.length > MAX_SVC && (
            <Badge className="text-[11px] px-1.5 py-0 bg-muted text-muted-foreground hover:bg-muted border-0">
              +{d.services.length - MAX_SVC} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function DentistCardSkeleton() {
  return (
    <div className="border rounded-xl p-5 flex gap-4">
      <Skeleton className="h-14 w-14 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
