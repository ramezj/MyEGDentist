import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { dentistMeQuery, isAvailability, useUpdateProfile } from "#/queries/dentists";
import { SectionCard } from "#/components/dentist/section-card";
import { MultiToggle } from "#/components/multi-toggle";
import { PageLayout, LoadingLayout } from "#/components/shared/page-layout";

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

const DEFAULT_AVAILABILITY = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startTime: "09:00",
  endTime: "17:00",
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

export const Route = createFileRoute("/dentist/profile")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(dentistMeQuery),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: profile, isLoading } = useQuery(dentistMeQuery);
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);

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
      availability: DEFAULT_AVAILABILITY,
    },
  });

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
      availability: isAvailability(profile.availability)
        ? profile.availability
        : DEFAULT_AVAILABILITY,
    });
  }, [profile, form]);

  const { watch, setValue, register, formState: { errors, isSubmitting } } = form;
  const languages = watch("languages");
  const availabilityDays = watch("availability.days");

  const onSubmit = form.handleSubmit((data) => {
    updateProfile.mutate(data as Parameters<typeof updateProfile.mutate>[0], {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  });

  const isBusy = isSubmitting || updateProfile.isPending;

  const saveButton = (
    <Button onClick={onSubmit} disabled={isBusy} size="sm">
      {isBusy ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
      ) : saved ? (
        <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />Saved</>
      ) : (
        <><Save className="w-4 h-4 mr-2" />Save changes</>
      )}
    </Button>
  );

  if (isLoading) return <LoadingLayout title="Edit Profile" primaryButton={saveButton} />;
  if (!profile) return null;

  return (
    <PageLayout variant="header" title="Edit Profile" primaryButton={saveButton}>
      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
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
            <MultiToggle
              options={LANGUAGES}
              selected={languages}
              onChange={(v) => setValue("languages", v)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Clinic Details" description="Your clinic's public contact information.">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clinicName">Clinic Name *</Label>
            <Input id="clinicName" placeholder="Cairo Smile Dental Center" {...register("clinicName")} />
            {errors.clinicName && (
              <p className="text-destructive text-xs">{errors.clinicName.message}</p>
            )}
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
              {errors.specialty && (
                <p className="text-destructive text-xs">{errors.specialty.message}</p>
              )}
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
              {errors.city && (
                <p className="text-destructive text-xs">{errors.city.message}</p>
              )}
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
    </PageLayout>
  );
}
