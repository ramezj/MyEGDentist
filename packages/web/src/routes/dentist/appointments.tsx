import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import {
  CalendarDays, ChevronDown, ChevronUp, Check, Play,
  X, Plus, Stethoscope, User,
} from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { Textarea } from "#/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "#/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

type DentistService = { id: string; name: string; price: number; category: string | null; isActive: boolean };
type AppointmentStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
type TreatmentStatus = "planned" | "completed" | "cancelled";

type Treatment = {
  id: string;
  service: string;
  price: number | null;
  status: TreatmentStatus;
  notes: string | null;
  addedBy: "tourist" | "dentist";
  completedAt: string | null;
};

type Appointment = {
  id: string;
  status: AppointmentStatus;
  requestedDate: string;
  confirmedDate: string | null;
  touristNotes: string | null;
  dentistNotes: string | null;
  treatments: Treatment[];
  tourist: { id: string; name: string; image: string | null; email: string };
};

// ─── Queries ──────────────────────────────────────────────────────────────────

const backendUrl =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) || "http://localhost:8080/api";

const appointmentsQuery = queryOptions({
  queryKey: ["dentist", "appointments"],
  queryFn: async (): Promise<Appointment[]> => {
    const res = await fetch(`${backendUrl}/appointments`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load appointments");
    return res.json();
  },
});

const servicesQuery = queryOptions({
  queryKey: ["dentist", "services"],
  queryFn: async (): Promise<DentistService[]> => {
    const res = await fetch(
      `${backendUrl}/dentists/me/services`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error("Failed to load services");
    return res.json();
  },
});

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/dentist/appointments")({
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

const TREATMENT_VARIANTS: Record<
  TreatmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  planned: "secondary",
  completed: "default",
  cancelled: "destructive",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({ appt, catalog }: { appt: Appointment; catalog: DentistService[] }) {
  const [expanded, setExpanded] = useState(false);
  const [newService, setNewService] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [addingTreatment, setAddingTreatment] = useState(false);
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["dentist", "appointments"] });

  const statusMutation = useMutation({
    mutationFn: async (status: AppointmentStatus) => {
      const res = await fetch(`${backendUrl}/appointments/${appt.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    },
    onSuccess: invalidate,
  });

  const treatmentStatusMutation = useMutation({
    mutationFn: async ({ tid, status }: { tid: string; status: TreatmentStatus }) => {
      const res = await fetch(`${backendUrl}/appointments/${appt.id}/treatments/${tid}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update treatment");
    },
    onSuccess: invalidate,
  });

  const addTreatmentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${backendUrl}/appointments/${appt.id}/treatments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: newService, notes: newNotes || undefined }),
      });
      if (!res.ok) throw new Error("Failed to add treatment");
    },
    onSuccess: () => {
      setNewService("");
      setNewNotes("");
      setAddingTreatment(false);
      invalidate();
    },
  });

  const deleteTreatmentMutation = useMutation({
    mutationFn: async (tid: string) => {
      const res = await fetch(`${backendUrl}/appointments/${appt.id}/treatments/${tid}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete treatment");
    },
    onSuccess: invalidate,
  });

  const canConfirm = appt.status === "pending";
  const canStart = appt.status === "confirmed";
  const canComplete = appt.status === "in_progress";
  const canCancel = appt.status === "pending" || appt.status === "confirmed";
  const isActive = ["pending", "confirmed", "in_progress"].includes(appt.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={appt.tourist.image ?? undefined} />
              <AvatarFallback className="bg-muted text-xs font-bold">
                {initials(appt.tourist.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{appt.tourist.name}</p>
              <p className="text-xs text-muted-foreground">{appt.tourist.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANTS[appt.status]}>{STATUS_LABELS[appt.status]}</Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 ml-13">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>
            Requested: {formatDate(appt.requestedDate)}
            {appt.confirmedDate && ` · Confirmed: ${formatDate(appt.confirmedDate)}`}
          </span>
        </div>
      </CardHeader>

      {expanded && (
        <>
          <Separator />
          <CardContent className="pt-4 space-y-4">
            {/* Action buttons */}
            {isActive && (
              <div className="flex flex-wrap gap-2">
                {canConfirm && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => statusMutation.mutate("confirmed")}
                    disabled={statusMutation.isPending}
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm
                  </Button>
                )}
                {canStart && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => statusMutation.mutate("in_progress")}
                    disabled={statusMutation.isPending}
                  >
                    <Play className="w-3.5 h-3.5" /> Start Visit
                  </Button>
                )}
                {canComplete && (
                  <Button
                    size="sm"
                    variant="default"
                    className="gap-1.5"
                    onClick={() => statusMutation.mutate("completed")}
                    disabled={statusMutation.isPending}
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Complete
                  </Button>
                )}
                {canCancel && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => statusMutation.mutate("cancelled")}
                    disabled={statusMutation.isPending}
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                )}
              </div>
            )}

            {/* Tourist notes */}
            {appt.touristNotes && (
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                <span className="font-medium flex items-center gap-1 mb-0.5">
                  <User className="w-3.5 h-3.5" /> Tourist note:
                </span>
                <p className="text-muted-foreground">{appt.touristNotes}</p>
              </div>
            )}

            {/* Treatments */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Treatments
              </p>
              <div className="space-y-2">
                {appt.treatments.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <Stethoscope className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{t.service}</p>
                        {t.price != null && (
                          <p className="text-xs text-muted-foreground tabular-nums">
                            EGP {t.price.toLocaleString()}
                          </p>
                        )}
                        {t.notes && (
                          <p className="text-xs text-muted-foreground italic">{t.notes}</p>
                        )}
                        <Badge
                          variant={TREATMENT_VARIANTS[t.status]}
                          className="text-[10px] mt-1"
                        >
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                    {isActive && (
                      <div className="flex gap-1 shrink-0">
                        {t.status === "planned" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => treatmentStatusMutation.mutate({ tid: t.id, status: "completed" })}
                            disabled={treatmentStatusMutation.isPending}
                          >
                            Done
                          </Button>
                        )}
                        {t.status !== "completed" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => deleteTreatmentMutation.mutate(t.id)}
                            disabled={deleteTreatmentMutation.isPending}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add treatment */}
                {isActive && !addingTreatment && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 w-full"
                    onClick={() => setAddingTreatment(true)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add treatment
                  </Button>
                )}

                {addingTreatment && (
                  <div className="rounded-md border px-3 py-3 space-y-2">
                    <Select value={newService} onValueChange={setNewService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service from your catalog" />
                      </SelectTrigger>
                      <SelectContent>
                        {catalog.filter((s) => s.isActive).map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            <span>{s.name}</span>
                            <span className="ml-2 text-muted-foreground tabular-nums text-xs">
                              EGP {s.price.toLocaleString()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Notes (optional)"
                      rows={2}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => { setAddingTreatment(false); setNewService(""); setNewNotes(""); }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addTreatmentMutation.mutate()}
                        disabled={!newService.trim() || addTreatmentMutation.isPending}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const { data: appointments = [], isLoading } = useQuery(appointmentsQuery);
  const { data: catalog = [] } = useQuery(servicesQuery);

  const groups: Record<string, Appointment[]> = {
    active: appointments.filter((a) =>
      ["pending", "confirmed", "in_progress"].includes(a.status)
    ),
    past: appointments.filter((a) =>
      ["completed", "cancelled"].includes(a.status)
    ),
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your incoming and past appointments
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No appointments yet</p>
        </div>
      ) : (
        <>
          {groups.active.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Active
              </h2>
              {groups.active.map((a) => <AppointmentCard key={a.id} appt={a} catalog={catalog} />)}
            </section>
          )}

          {groups.past.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Past
              </h2>
              {groups.past.map((a) => <AppointmentCard key={a.id} appt={a} catalog={catalog} />)}
            </section>
          )}
        </>
      )}
    </div>
  );
}
