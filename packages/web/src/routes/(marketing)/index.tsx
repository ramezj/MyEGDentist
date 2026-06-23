import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { apiClient } from "#/lib/api-client";
export const Route = createFileRoute("/(marketing)/")({ component: Home });

function Home() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const { data: dentists = [], isLoading } = useQuery({
    queryKey: ["dentists", query],
    queryFn: async () => {
      const res = await apiClient.dentists.$get({ query: { q: query } });
      if (!res.ok) throw new Error("Failed to fetch dentists");
      return res.json();
    },
  });

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-4 text-center border-b bg-muted/30">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Find Your Dentist in Egypt
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
          Quality dental care for international patients. Search by name,
          specialty, or city.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(input);
          }}
          className="flex gap-2 w-full max-w-lg mx-auto"
        >
          <Input
            className="bg-white"
            placeholder="Search by name, specialty, or city…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </section>

      {/* Results */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : dentists.length > 0 ? (
          <div className="space-y-4">
            {query && (
              <p className="text-sm text-muted-foreground mb-2">
                {dentists.length} result{dentists.length !== 1 ? "s" : ""} for "
                {query}"
              </p>
            )}
            {dentists.map((d) => (
              <div
                key={d.id}
                className="bg-card border rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {d.user.image ? (
                      <img
                        src={d.user.image}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-muted-foreground">
                        {d.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{d.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.clinicName}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                      <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs font-medium">
                        {d.specialty}
                      </span>
                      <span>·</span>
                      <span>{d.city}</span>
                      {d.phone && (
                        <>
                          <span>·</span>
                          <span>{d.phone}</span>
                        </>
                      )}
                    </div>
                    {d.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {d.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <p className="text-center text-muted-foreground py-10">
            No dentists found for "{query}".
          </p>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No dentists registered yet.
          </p>
        )}
      </section>
    </main>
  );
}
