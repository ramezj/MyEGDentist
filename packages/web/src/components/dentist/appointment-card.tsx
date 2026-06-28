import { useState } from "react";
import {
  CalendarDays, ChevronDown, ChevronUp, Check, Play,
  X, Plus, Stethoscope, User,
} from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Textarea } from "#/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import {
  useUpdateStatus,
  useAddTreatment,
  useUpdateTreatment,
  useRemoveTreatment,
  type DentistAppointment,
  type AppointmentStatus,
  type TreatmentStatus,
} from "#/queries/appointments";
import type { DentistService } from "#/queries/dentists";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<AppointmentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "secondary",
  confirmed: "default",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
};

const TREATMENT_VARIANTS: Record<TreatmentStatus, "default" | "secondary" | "outline" | "destructive"> = {
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

interface Props {
  appt: DentistAppointment;
  catalog: DentistService[];
}

export function AppointmentCard({ appt, catalog }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [newService, setNewService] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [addingTreatment, setAddingTreatment] = useState(false);

  const statusMutation = useUpdateStatus();
  const addTreatmentMutation = useAddTreatment();
  const updateTreatmentMutation = useUpdateTreatment();
  const removeTreatmentMutation = useRemoveTreatment();

  const canConfirm = appt.status === "pending";
  const canStart = appt.status === "confirmed";
  const canComplete = appt.status === "in_progress";
  const canCancel = appt.status === "pending" || appt.status === "confirmed";
  const isActive = ["pending", "confirmed", "in_progress"].includes(appt.status);

  function handleAddTreatment() {
    addTreatmentMutation.mutate(
      { appointmentId: appt.id, body: { serviceId: newService, notes: newNotes || undefined } },
      {
        onSuccess: () => {
          setNewService("");
          setNewNotes("");
          setAddingTreatment(false);
        },
      },
    );
  }

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
            {isActive && (
              <div className="flex flex-wrap gap-2">
                {canConfirm && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => statusMutation.mutate({ id: appt.id, body: { status: "confirmed" } })}
                    disabled={statusMutation.isPending}
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm
                  </Button>
                )}
                {canStart && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => statusMutation.mutate({ id: appt.id, body: { status: "in_progress" } })}
                    disabled={statusMutation.isPending}
                  >
                    <Play className="w-3.5 h-3.5" /> Start Visit
                  </Button>
                )}
                {canComplete && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => statusMutation.mutate({ id: appt.id, body: { status: "completed" } })}
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
                    onClick={() => statusMutation.mutate({ id: appt.id, body: { status: "cancelled" } })}
                    disabled={statusMutation.isPending}
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                )}
              </div>
            )}

            {appt.touristNotes && (
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                <span className="font-medium flex items-center gap-1 mb-0.5">
                  <User className="w-3.5 h-3.5" /> Tourist note:
                </span>
                <p className="text-muted-foreground">{appt.touristNotes}</p>
              </div>
            )}

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
                          variant={TREATMENT_VARIANTS[t.status as TreatmentStatus]}
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
                            onClick={() =>
                              updateTreatmentMutation.mutate({
                                appointmentId: appt.id,
                                tid: t.id,
                                body: { status: "completed" },
                              })
                            }
                            disabled={updateTreatmentMutation.isPending}
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
                            onClick={() =>
                              removeTreatmentMutation.mutate({ appointmentId: appt.id, tid: t.id })
                            }
                            disabled={removeTreatmentMutation.isPending}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

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
                        onClick={() => {
                          setAddingTreatment(false);
                          setNewService("");
                          setNewNotes("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddTreatment}
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
