import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Tag } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "#/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DentistService = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  durationMinutes: number | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Cosmetic",
  "Preventive",
  "Restorative",
  "Surgical",
  "Orthodontic",
  "Pediatric",
  "Emergency",
];

const backendUrl =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) || "http://localhost:8080/api";

// ─── Query ────────────────────────────────────────────────────────────────────

export const servicesQuery = queryOptions({
  queryKey: ["dentist", "services"],
  queryFn: async (): Promise<DentistService[]> => {
    const res = await fetch(`${backendUrl}/dentists/me/services`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load services");
    return res.json();
  },
});

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/dentist/services")({
  component: RouteComponent,
});

// ─── Service Form ─────────────────────────────────────────────────────────────

type ServiceFormData = {
  name: string;
  price: string;
  description: string;
  durationMinutes: string;
  category: string;
};

const EMPTY_FORM: ServiceFormData = {
  name: "",
  price: "",
  description: "",
  durationMinutes: "",
  category: "",
};

function serviceToForm(s: DentistService): ServiceFormData {
  return {
    name: s.name,
    price: String(s.price),
    description: s.description ?? "",
    durationMinutes: s.durationMinutes != null ? String(s.durationMinutes) : "",
    category: s.category ?? "",
  };
}

function ServiceForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: ServiceFormData;
  onSave: (d: ServiceFormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof ServiceFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.name.trim() !== "" && form.price !== "" && !isNaN(parseFloat(form.price)) && parseFloat(form.price) >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="svc-name">Service name *</Label>
          <Input id="svc-name" placeholder="e.g. Teeth Whitening" value={form.name} onChange={set("name")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="svc-price">Price (EGP) *</Label>
          <Input id="svc-price" type="number" min={0} step={50} placeholder="0" value={form.price} onChange={set("price")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="svc-duration">Duration (minutes)</Label>
          <Input id="svc-duration" type="number" min={5} step={5} placeholder="60" value={form.durationMinutes} onChange={set("durationMinutes")} />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="svc-category">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
            <SelectTrigger id="svc-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="svc-desc">Description</Label>
          <Textarea
            id="svc-desc"
            placeholder="Brief description shown to patients…"
            rows={2}
            className="resize-none"
            value={form.description}
            onChange={set("description")}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="button" size="sm" disabled={!valid || saving} onClick={() => onSave(form)}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

// ─── Service Row ──────────────────────────────────────────────────────────────

function ServiceRow({ svc }: { svc: DentistService }) {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["dentist", "services"] });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<DentistService>) => {
      const res = await fetch(`${backendUrl}/dentists/me/services/${svc.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => { invalidate(); setEditing(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${backendUrl}/dentists/me/services/${svc.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: invalidate,
  });

  function handleSave(form: ServiceFormData) {
    updateMutation.mutate({
      name: form.name.trim(),
      price: parseFloat(form.price),
      description: form.description.trim() || undefined,
      durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : undefined,
      category: form.category || undefined,
    } as Partial<DentistService>);
  }

  return (
    <div className={`px-4 py-3 ${!svc.isActive ? "opacity-50" : ""}`}>
      {editing ? (
        <ServiceForm
          initial={serviceToForm(svc)}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          saving={updateMutation.isPending}
        />
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{svc.name}</span>
              {svc.category && (
                <Badge variant="secondary" className="text-[10px]">{svc.category}</Badge>
              )}
              {!svc.isActive && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">Archived</Badge>
              )}
            </div>
            {svc.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{svc.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground tabular-nums">
                EGP {svc.price.toLocaleString()}
              </span>
              {svc.durationMinutes && <span>· {svc.durationMinutes} min</span>}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              title={svc.isActive ? "Archive" : "Restore"}
              onClick={() => updateMutation.mutate({ isActive: !svc.isActive } as Partial<DentistService>)}
              disabled={updateMutation.isPending}
            >
              {svc.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  const [adding, setAdding] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (form: ServiceFormData) => {
      const res = await fetch(`${backendUrl}/dentists/me/services`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
          description: form.description.trim() || undefined,
          durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : undefined,
          category: form.category || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "services"] });
      setAdding(false);
    },
  });

  const grouped = CATEGORIES.reduce<Record<string, DentistService[]>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});
  const uncategorized = services.filter((s) => !s.category);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Define the treatments you offer and their prices. Tourists select from this catalog when booking.
          </p>
        </div>
        {!adding && (
          <Button size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
            <Plus className="w-4 h-4" /> Add service
          </Button>
        )}
      </div>

      {adding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Service</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ServiceForm
              initial={EMPTY_FORM}
              onSave={(d) => createMutation.mutate(d)}
              onCancel={() => setAdding(false)}
              saving={createMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border rounded-xl border-dashed">
          <Tag className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No services yet</p>
          <p className="text-sm mt-1">Add your first service to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, items]) => (
            <Card key={cat}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat}
                </CardTitle>
              </CardHeader>
              <Separator />
              <div className="divide-y">
                {items.map((s) => <ServiceRow key={s.id} svc={s} />)}
              </div>
            </Card>
          ))}

          {uncategorized.length > 0 && (
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Other
                </CardTitle>
              </CardHeader>
              <Separator />
              <div className="divide-y">
                {uncategorized.map((s) => <ServiceRow key={s.id} svc={s} />)}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
