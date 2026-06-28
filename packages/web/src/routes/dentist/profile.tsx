import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { apiClient } from "#/lib/api-client";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Checkbox } from "#/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  "General Dentistry", "Orthodontics", "Cosmetic Dentistry", "Oral Surgery",
  "Pediatric Dentistry", "Periodontics", "Endodontics", "Prosthodontics",
];

const CITIES = [
  "Cairo", "Alexandria", "Giza", "Sharm El Sheikh",
  "Hurghada", "Luxor", "Aswan", "Dahab", "Marsa Alam",
];

const LANGUAGES = ["Arabic", "English", "French", "German", "Italian", "Spanish", "Russian"];


const EXPERIENCE_OPTIONS = [
  { label: "Less than 1 year", value: "< 1 year" },
  { label: "1–2 years", value: "1-2 years" },
  { label: "3–5 years", value: "3-5 years" },
  { label: "6–10 years", value: "6-10 years" },
  { label: "10+ years", value: "10+ years" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── Types & schema ───────────────────────────────────────────────────────────

type Availability = { days: string[]; startTime: string; endTime: string };

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
  availability: Availability | null;
  user: { name: string; image: string | null; email: string };
};

const formSchema = z.object({
  bio: z.string().optional(),
  experience: z.string().optional(),
  languages: z.array(z.string()),
  clinicName: z.string().min(2, "Clinic name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  availability: z.object({
    days: z.array(z.string()),
    startTime: z.string(),
    endTime: z.string(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Query ────────────────────────────────────────────────────────────────────

const profileQuery = queryOptions({
  queryKey: ["dentist", "me"],
  queryFn: async (): Promise<DentistProfile> => {
    const res = await apiClient.dentists.me.$get();
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json() as unknown as Promise<DentistProfile>;
  },
});

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/dentist/profile")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(profileQuery),
  component: RouteComponent,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

function MultiToggle({
  options,
  selected,
  onChange,
  cols = 2,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  cols?: number;
}) {
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
  return (
    <div className={cn("grid gap-2", cols === 2 ? "grid-cols-2" : "grid-cols-3 sm:grid-cols-4")}>
      {options.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <Checkbox id={item} checked={selected.includes(item)} onCheckedChange={() => toggle(item)} />
          <Label htmlFor={item} className="font-normal cursor-pointer text-sm">{item}</Label>
        </div>
      ))}
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

function RouteComponent() {
  const { data: profile } = useQuery(profileQuery);
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      experience: undefined,
      languages: [],
      clinicName: "",
      specialty: "",
      city: "",
      address: "",
      phone: "",
      availability: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], startTime: "09:00", endTime: "17:00" },
    },
  });

  // Populate once profile loads
  useEffect(() => {
    if (!profile) return;
    form.reset({
      bio: profile.bio ?? "",
      experience: profile.experience ?? undefined,
      languages: profile.languages,
      clinicName: profile.clinicName,
      specialty: profile.specialty,
      city: profile.city,
      address: profile.address ?? "",
      phone: profile.phone ?? "",
      availability: profile.availability ?? {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "09:00",
        endTime: "17:00",
      },
    });
  }, [profile, form]);

  const { watch, setValue, register, formState: { errors, isSubmitting } } = form;
  const languages = watch("languages");
  const availabilityDays = watch("availability.days");

  const onSubmit = form.handleSubmit(async (data) => {
    setSaved(false);
    setSaveError(null);
    try {
      const backendUrl =
        (import.meta.env.VITE_BACKEND_URL as string | undefined) || "http://localhost:8080/api";
      const res = await fetch(`${backendUrl}/dentists/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Save failed");
      }
      await queryClient.invalidateQueries({ queryKey: ["dentist", "me"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Something went wrong");
    }
  });

  if (!profile) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Edit Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Keep your information up to date for tourists.
          </p>
        </div>
        <Button onClick={onSubmit} disabled={isSubmitting} size="sm">
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />Saved</>
          ) : (
            <><Save className="w-4 h-4 mr-2" />Save changes</>
          )}
        </Button>
      </div>

      {saveError && (
        <p className="text-sm text-destructive text-center">{saveError}</p>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Personal */}
        <SectionCard title="Personal" description="How you present yourself to patients.">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Briefly describe your background and approach…"
              rows={4}
              {...register("bio")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="experience">Years of Experience</Label>
            <Select
              value={watch("experience") ?? ""}
              onValueChange={(v) => setValue("experience", v)}
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select experience range" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Languages Spoken</Label>
            <MultiToggle options={LANGUAGES} selected={languages} onChange={(v) => setValue("languages", v)} />
          </div>
        </SectionCard>

        {/* Clinic */}
        <SectionCard title="Clinic Details" description="Your clinic's public contact information.">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clinicName">Clinic Name *</Label>
            <Input id="clinicName" placeholder="Cairo Smile Dental Center" {...register("clinicName")} />
            {errors.clinicName && <p className="text-destructive text-xs">{errors.clinicName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Specialty *</Label>
              <Select
                value={watch("specialty")}
                onValueChange={(v) => setValue("specialty", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.specialty && <p className="text-destructive text-xs">{errors.specialty.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>City *</Label>
              <Select
                value={watch("city")}
                onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="15 Tahrir Square, Downtown Cairo" {...register("address")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+20 10 0000 0000" {...register("phone")} />
          </div>
        </SectionCard>

        {/* Availability */}
        <SectionCard title="Availability" description="Let tourists know when you're open.">
          <div className="flex flex-col gap-2">
            <Label>Working Days</Label>
            <MultiToggle
              options={DAYS}
              selected={availabilityDays}
              onChange={(v) => setValue("availability.days", v)}
              cols={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startTime">Opening Time</Label>
              <Input id="startTime" type="time" {...register("availability.startTime")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endTime">Closing Time</Label>
              <Input id="endTime" type="time" {...register("availability.endTime")} />
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}