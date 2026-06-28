import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "#/components/ui/sheet";
import { useCreateAppointment } from "#/queries/appointments";
import type { DentistProfile } from "#/queries/dentists";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: DentistProfile;
}

export function BookingSheet({ open, onClose, profile }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useCreateAppointment();

  function handleSubmit() {
    mutation.mutate(
      {
        dentistProfileId: profile.id,
        serviceIds: selectedIds,
        requestedDate: new Date(requestedDate).toISOString(),
        touristNotes: notes || undefined,
      },
      { onSuccess: () => setSuccess(true) },
    );
  }

  function handleClose() {
    setSelectedIds([]);
    setRequestedDate("");
    setNotes("");
    setSuccess(false);
    mutation.reset();
    onClose();
  }

  function toggleService(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>Book Appointment</SheetTitle>
          <SheetDescription>
            Request an appointment with Dr. {profile.user.name} at {profile.clinicName}
          </SheetDescription>
        </SheetHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CalendarDays className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">Booking Requested!</p>
              <p className="text-sm text-muted-foreground mt-1">
                The dentist will confirm your appointment shortly.
              </p>
            </div>
            <Button onClick={handleClose}>Done</Button>
          </div>
        ) : (
          <div className="space-y-5">
            {profile.services.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Services needed</p>
                <div className="space-y-2">
                  {profile.services.map((svc) => (
                    <div key={svc.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id={`svc-${svc.id}`}
                          checked={selectedIds.includes(svc.id)}
                          onCheckedChange={() => toggleService(svc.id)}
                          className="mt-0.5"
                        />
                        <div>
                          <Label
                            htmlFor={`svc-${svc.id}`}
                            className="cursor-pointer font-normal leading-snug"
                          >
                            {svc.name}
                          </Label>
                          {svc.description && (
                            <p className="text-xs text-muted-foreground">{svc.description}</p>
                          )}
                          {svc.durationMinutes && (
                            <p className="text-xs text-muted-foreground">
                              ~{svc.durationMinutes} min
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground tabular-nums shrink-0">
                        EGP {svc.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex justify-between items-center mt-3 pt-3 border-t text-sm font-medium">
                    <span>Estimated total</span>
                    <span>
                      EGP{" "}
                      {profile.services
                        .filter((s) => selectedIds.includes(s.id))
                        .reduce((sum, s) => sum + s.price, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="req-date">Preferred date</Label>
              <Input
                id="req-date"
                type="date"
                min={today}
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="req-notes">Notes (optional)</Label>
              <Textarea
                id="req-notes"
                placeholder="Describe your concern or any relevant info..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}

            <Button
              className="w-full"
              disabled={!selectedIds.length || !requestedDate || mutation.isPending}
              onClick={handleSubmit}
            >
              {mutation.isPending ? "Sending..." : "Request Appointment"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
