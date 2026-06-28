import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  DentistCard,
  DentistCardSkeleton,
} from "#/components/shared/dentist-card";
import { CITIES, SPECIALTIES } from "#/lib/constants";
import { client } from "#/lib/client";

export const Route = createFileRoute("/(marketing)/")({ component: Home });

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");

  const hasFilters = q || city || specialty;

  const { data: dentists = [], isLoading } = useQuery({
    queryKey: ["dentists", { q, city, specialty }],
    queryFn: () => client.dentists.search({ q, city, specialty }),
  });

  function clearFilters() {
    setQ("");
    setSearchInput("");
    setCity("");
    setSpecialty("");
  }

  return (
    <main>
      <section className="relative py-16 px-4 text-center border-b overflow-hidden">
        <img
          src="/pyramids.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-5xl mx-auto lg:px-4">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">
            Find Your Dentist in Egypt
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
            Quality dental care for international patients. Browse verified
            clinics across Egypt.
          </p>

          <form
            className="flex flex-col gap-2 w-full mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              setQ(searchInput);
            }}
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 bg-background border-none"
                  placeholder="Search name, clinic, specialty…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </div>

            <div className="flex gap-2">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="flex-1 bg-background border-none">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All cities</SelectItem>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="flex-1 bg-background border-none">
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All specialties</SelectItem>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {dentists.length === 0
                ? hasFilters
                  ? "No results"
                  : "No dentists registered yet"
                : `${dentists.length} dentist${dentists.length !== 1 ? "s" : ""} found`}
            </p>
          )}
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <DentistCardSkeleton key={i} />
            ))}
          </div>
        ) : dentists.length > 0 ? (
          <div className="space-y-3">
            {dentists.map((d) => (
              <DentistCard key={d.id} d={d} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-base font-medium">No dentists found</p>
            {hasFilters && (
              <p className="text-sm mt-1">
                Try adjusting your search or{" "}
                <button
                  onClick={clearFilters}
                  className="underline underline-offset-2"
                >
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
