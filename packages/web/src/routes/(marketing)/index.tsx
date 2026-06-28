import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import { apiClient } from "#/lib/api-client";

export const Route = createFileRoute("/(marketing)/")({ component: Home });

// ─── Constants ────────────────────────────────────────────────────────────────

const CITIES = [
  "Cairo", "Alexandria", "Giza", "Sharm El Sheikh",
  "Hurghada", "Luxor", "Aswan", "Dahab", "Marsa Alam",
];

const SPECIALTIES = [
  "General Dentistry", "Orthodontics", "Cosmetic Dentistry", "Oral Surgery",
  "Pediatric Dentistry", "Periodontics", "Endodontics", "Prosthodontics",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type DentistService = { id: string; name: string; price: number; category: string | null };

type DentistListing = {
  id: string;
  clinicName: string;
  specialty: string;
  city: string;
  phone: string | null;
  bio: string | null;
  experience: string | null;
  languages: string[];
  services: DentistService[];
  user: { name: string; image: string | null };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function DentistCard({ d }: { d: DentistListing }) {
  const MAX_LANG = 3;
  const MAX_SVC = 3;

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
            <Link to="/dentists/$id" params={{ id: d.id }}>
              View Profile
            </Link>
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

function CardSkeleton() {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");

  const hasFilters = q || city || specialty;

  const { data: dentists = [], isLoading } = useQuery({
    queryKey: ["dentists", { q, city, specialty }],
    queryFn: async () => {
      const res = await apiClient.dentists.$get({
        query: { q, city, specialty },
      });
      if (!res.ok) throw new Error("Failed to fetch dentists");
      return res.json() as unknown as Promise<DentistListing[]>;
    },
  });

  function clearFilters() {
    setQ("");
    setSearchInput("");
    setCity("");
    setSpecialty("");
  }

  return (
    <main>
      {/* Hero */}
      <section className="py-16 px-4 text-center border-b bg-muted/30">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Find Your Dentist in Egypt
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Quality dental care for international patients. Browse verified clinics
          across Egypt.
        </p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl mx-auto">
          <form
            className="flex gap-2 flex-1"
            onSubmit={(e) => { e.preventDefault(); setQ(searchInput); }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9 bg-background"
                placeholder="Search name, clinic, specialty…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All cities</SelectItem>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All specialties</SelectItem>
              {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {dentists.length === 0
                ? hasFilters ? "No results" : "No dentists registered yet"
                : `${dentists.length} dentist${dentists.length !== 1 ? "s" : ""} found`}
            </p>
          )}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="w-3.5 h-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : dentists.length > 0 ? (
          <div className="space-y-3">
            {dentists.map((d) => <DentistCard key={d.id} d={d} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-base font-medium">No dentists found</p>
            {hasFilters && (
              <p className="text-sm mt-1">
                Try adjusting your search or{" "}
                <button onClick={clearFilters} className="underline underline-offset-2">
                  clear all filters
                </button>
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
