import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "#/lib/utils";
import { useSession } from "#/lib/session";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Checkbox } from "#/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { ServiceCatalogEditor, type DentistService } from "#/components/service-catalog-editor";

export const Route = createFileRoute("/dentist/onboarding")({
  component: RouteComponent,
});

const SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Cosmetic Dentistry",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Periodontics",
  "Endodontics",
  "Prosthodontics",
];

const CITIES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Sharm El Sheikh",
  "Hurghada",
  "Luxor",
  "Aswan",
  "Dahab",
  "Marsa Alam",
];

const LANGUAGES = ["Arabic", "English", "French", "German", "Italian", "Spanish", "Russian"];


const EXPERIENCE_OPTIONS = [
  { label: "Less than 1 year", value: "< 1 year" },
  { label: "1–2 years", value: "1-2 years" },
  { label: "3–5 years", value: "3-5 years" },
  { label: "6–10 years", value: "6-10 years" },
  { label: "10+ years", value: "10+ years" },
];

const formSchema = z.object({
  bio: z.string().optional(),
  experience: z.string().optional(),
  languages: z.array(z.string()),
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  specialty: z.string().min(1, "Please select a specialty"),
  city: z.string().min(1, "Please select a city"),
  address: z.string().optional(),
  phone: z.string().optional(),
  services: z.array(z.object({ name: z.string(), price: z.number() })),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = ["Personal", "Clinic", "Services"] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full max-w-sm mx-auto mb-8">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = current > idx;
        const active = current === idx;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  done && "bg-primary text-primary-foreground",
                  active && "border-2 border-primary text-primary bg-background",
                  !done && !active && "border-2 border-border text-muted-foreground bg-background"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : idx}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 mb-5 transition-colors",
                  done ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MultiToggle({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (item: string) => {
    onChange(
      selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]
    );
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <Checkbox
            id={item}
            checked={selected.includes(item)}
            onCheckedChange={() => toggle(item)}
          />
          <Label htmlFor={item} className="font-normal cursor-pointer">
            {item}
          </Label>
        </div>
      ))}
    </div>
  );
}

function RouteComponent() {
  const { data: user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      services: [],
    },
  });

  const { watch, setValue, trigger, formState: { errors } } = form;
  const languages = watch("languages");
  const services = watch("services");

  const nextStep = async () => {
    if (step === 2) {
      const valid = await trigger(["clinicName", "specialty", "city"]);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const backendUrl =
        (import.meta.env.VITE_BACKEND_URL as string | undefined) ||
        "http://localhost:8080/api";
      const res = await fetch(`${backendUrl}/dentists/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Something went wrong");
      }
      await queryClient.refetchQueries({ queryKey: ["session"] });
      navigate({ to: "/dentist" });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex flex-col items-center justify-start px-4 py-10 min-h-full">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Let's get your dentist profile set up. It only takes a few minutes.
          </p>
        </div>

        <StepIndicator current={step} />

        <form onSubmit={onSubmit}>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Tell patients a little about yourself.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Briefly describe your background, approach, and what makes your practice special…"
                    rows={4}
                    {...form.register("bio")}
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
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
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
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Clinic Details</CardTitle>
                <CardDescription>
                  Help patients find and contact your clinic.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g. Cairo Smile Dental Center"
                    {...form.register("clinicName")}
                  />
                  {errors.clinicName && (
                    <p className="text-destructive text-xs">{errors.clinicName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Select
                      value={watch("specialty")}
                      onValueChange={(v) => setValue("specialty", v, { shouldValidate: true })}
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALTIES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specialty && (
                      <p className="text-destructive text-xs">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Select
                      value={watch("city")}
                      onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
                    >
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-destructive text-xs">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Clinic Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g. 15 Tahrir Square, Downtown Cairo"
                    {...form.register("address")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+20 10 0000 0000"
                    {...form.register("phone")}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
                <CardDescription>
                  Add the treatments you offer and set a price for each. Tourists will see these when booking.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <ServiceCatalogEditor
                  services={services as DentistService[]}
                  onChange={(v) => setValue("services", v)}
                />

                {submitError && (
                  <p className="text-destructive text-sm text-center">{submitError}</p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className={cn(step === 1 && "invisible")}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {step < 3 ? (
              <Button key="next" type="button" onClick={nextStep}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button key="submit" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
