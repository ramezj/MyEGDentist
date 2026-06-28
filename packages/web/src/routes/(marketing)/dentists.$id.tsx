import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import {
  MapPin, Phone, Clock, Building2, Stethoscope,
  Languages, ChevronLeft, CalendarDays,
} from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { Card, CardContent } from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Input } from "#/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "#/components/ui/sheet";
import { sessionQuery } from "#/lib/session";

// ─── Types ────────────────────────────────────────────────────────────────────

type Availability = { days: string[]; startTime: string; endTime: string };
type DentistService = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  durationMinutes: number | null;
  category: string | null;
};

type DentistProfile = {
  id: string;
  clinicName: string;
  specialty: string;
  city: string;
  phone: string | null;
  bio: string | null;
  experience: string | null;
  languages: string[];
  address: string | null;
  services: DentistService[];
  availability: Availability | null;
  user: { name: string; image: string | null };
};

// ─── Query / constants ────────────────────────────────────────────────────────

const backendUrl =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) || "http://localhost:8080/api";

const dentistQuery = (id: string) =>
  queryOptions({
    queryKey: ["dentist", id],
    queryFn: async (): Promise<DentistProfile> => {
      const res = await fetch(`${backendUrl}/dentists/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Dentist not found");
      return res.json();
    },
  });

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/(marketing)/dentists/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(dentistQuery(id)),
  component: RouteComponent,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const DAY_ABBR: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// ─── Booking Sheet ────────────────────────────────────────────────────────────

function BookingSheet({
  open,
  onClose,
  profile,
}: {
  open: boolean;
  onClose: () => void;
  profile: DentistProfile;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${backendUrl}/appointments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dentistProfileId: profile.id,
          serviceIds: selectedIds,
          requestedDate: new Date(requestedDate).toISOString(),
          touristNotes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
    },
    onSuccess: () => setSuccess(true),
  });

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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
            {/* Services */}
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
                          <Label htmlFor={`svc-${svc.id}`} className="cursor-pointer font-normal leading-snug">
                            {svc.name}
                          </Label>
                          {svc.description && (
                            <p className="text-xs text-muted-foreground">{svc.description}</p>
                          )}
                          {svc.durationMinutes && (
                            <p className="text-xs text-muted-foreground">~{svc.durationMinutes} min</p>
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

            {/* Date */}
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

            {/* Notes */}
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
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? "Sending..." : "Request Appointment"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Skeleton className="h-4 w-28" />
      <Card>
        <CardContent className="p-6 flex gap-5">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: profile, isLoading } = useQuery(dentistQuery(id));
  const { data: user } = useQuery(sessionQuery);
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleBookClick() {
    if (!user) { void navigate({ to: "/auth" }); return; }
    if (user.type !== "tourist") return;
    setSheetOpen(true);
  }

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return (
    <div className="text-center py-24 text-muted-foreground">
      <p className="font-medium">Dentist not found.</p>
      <Button asChild variant="link" className="mt-2"><Link to="/">Back to search</Link></Button>
    </div>
  );

  const avail = profile.availability;
  const canBook = !user || user.type === "tourist";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      {profile && (
        <BookingSheet open={sheetOpen} onClose={() => setSheetOpen(false)} profile={profile} />
      )}

      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to search
      </Link>

      {/* Hero card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <Avatar className="h-20 w-20 text-xl shrink-0">
              <AvatarImage src={profile.user.image ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {initials(profile.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">Dr. {profile.user.name}</h1>
              <p className="text-muted-foreground mt-0.5">{profile.clinicName}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="gap-1">
                  <Stethoscope className="w-3 h-3" />
                  {profile.specialty}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city}
                </Badge>
                {profile.experience && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {profile.experience}
                  </Badge>
                )}
              </div>
            </div>

            {canBook && (
              <Button
                className="shrink-0 self-start gap-2"
                size="sm"
                onClick={handleBookClick}
              >
                <CalendarDays className="w-4 h-4" />
                Book Appointment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      {profile.bio && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            About
          </h2>
          <p className="text-sm leading-relaxed">{profile.bio}</p>
        </section>
      )}

      {/* Languages */}
      {profile.languages.length > 0 && (
        <>
          <Separator />
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Languages className="w-4 h-4" /> Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((l) => (
                <Badge key={l} variant="secondary">{l}</Badge>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Services */}
      {profile.services.length > 0 && (
        <>
          <Separator />
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Services & Pricing
            </h2>
            <div className="rounded-md border divide-y">
              {profile.services.map((s) => (
                <div key={s.id} className="flex items-start justify-between px-3 py-2.5 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.name}</p>
                    {s.description && (
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    )}
                    {s.durationMinutes && (
                      <p className="text-xs text-muted-foreground">~{s.durationMinutes} min</p>
                    )}
                  </div>
                  <span className="text-sm font-medium tabular-nums text-muted-foreground shrink-0">
                    EGP {s.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Availability */}
      {avail && avail.days.length > 0 && (
        <>
          <Separator />
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Availability
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {avail.days.map((day) => (
                <Badge key={day} variant="secondary" className="font-normal">
                  {DAY_ABBR[day] ?? day}
                </Badge>
              ))}
              {avail.startTime && avail.endTime && (
                <>
                  <span className="text-muted-foreground text-sm mx-1">·</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(avail.startTime)} – {formatTime(avail.endTime)}
                  </span>
                </>
              )}
            </div>
          </section>
        </>
      )}

      {/* Contact */}
      {(profile.phone || profile.address) && (
        <>
          <Separator />
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Contact & Location
            </h2>
            <div className="flex flex-col gap-2">
              {profile.address && (
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{profile.address}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a
                    href={`tel:${profile.phone}`}
                    className="hover:underline underline-offset-2"
                  >
                    {profile.phone}
                  </a>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Bottom CTA */}
      {canBook && (
        <div className="pt-4">
          <Button className="w-full gap-2" size="lg" onClick={handleBookClick}>
            <CalendarDays className="w-5 h-5" />
            Book an Appointment
          </Button>
        </div>
      )}
    </div>
  );
}
