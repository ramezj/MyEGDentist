import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, X, Stethoscope } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { sessionQuery } from "#/lib/session";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
type TreatmentStatus = "planned" | "completed" | "cancelled";

type Treatment = {
  id: string;
  service: string;
  price: number | null;
  status: TreatmentStatus;
  notes: string | null;
  addedBy: "tourist" | "dentist";
};

type Booking = {
  id: string;
  status: AppointmentStatus;
  requestedDate: string;
  confirmedDate: string | null;
  touristNotes: string | null;
  dentistNotes: string | null;
  treatments: Treatment[];
  dentistProfile: {
    id: string;
    clinicName: string;
    specialty: string;
    city: string;
    user: { name: string; image: string | null };
  };
};

// ─── Query ────────────────────────────────────────────────────────────────────

const backendUrl =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) || "http://localhost:8080/api";

const bookingsQuery = queryOptions({
  queryKey: ["bookings", "mine"],
  queryFn: async (): Promise<Booking[]> => {
    const res = await fetch(`${backendUrl}/appointments`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load bookings");
    return res.json();
  },
});

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/(marketing)/bookings")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(sessionQuery);
    if (!user) throw redirect({ to: "/auth" });
    if (user.type !== "tourist") throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<
  AppointmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  confirmed: "default",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

function RouteComponent() {
  const { data: bookings = [], isLoading } = useQuery(bookingsQuery);
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${backendUrl}/appointments/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) throw new Error("Failed to cancel");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] }),
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to search
          </Link>
          <h1 className="text-2xl font-bold">My Bookings</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No bookings yet</p>
          <Button asChild variant="link" className="mt-1">
            <Link to="/">Find a dentist</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={b.dentistProfile.user.image ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials(b.dentistProfile.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">Dr. {b.dentistProfile.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.dentistProfile.clinicName} · {b.dentistProfile.city}
                      </p>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANTS[b.status]}>{STATUS_LABELS[b.status]}</Badge>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>
                    Requested: {formatDate(b.requestedDate)}
                    {b.confirmedDate && ` · Confirmed: ${formatDate(b.confirmedDate)}`}
                  </span>
                </div>

                {b.treatments.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      Treatments
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {b.treatments.map((t) => (
                        <Badge
                          key={t.id}
                          variant={
                            t.status === "completed"
                              ? "default"
                              : t.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                          className="gap-1 font-normal"
                        >
                          <Stethoscope className="w-2.5 h-2.5" />
                          {t.service}
                          {t.price != null && (
                            <span className="opacity-70 tabular-nums">
                              · EGP {t.price.toLocaleString()}
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {b.touristNotes && (
                  <p className="text-sm text-muted-foreground italic">"{b.touristNotes}"</p>
                )}

                {b.dentistNotes && (
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                    <span className="font-medium">Dentist note: </span>
                    {b.dentistNotes}
                  </div>
                )}

                {(b.status === "pending" || b.status === "confirmed") && (
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                      onClick={() => cancelMutation.mutate(b.id)}
                      disabled={cancelMutation.isPending}
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
