import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

export const SERVICE_CATEGORIES = [
  "Cosmetic",
  "Preventive",
  "Restorative",
  "Surgical",
  "Orthodontic",
  "Pediatric",
  "Emergency",
];

export type ServiceFormData = {
  name: string;
  price: string;
  description: string;
  durationMinutes: string;
  category: string;
};

export const EMPTY_SERVICE_FORM: ServiceFormData = {
  name: "",
  price: "",
  description: "",
  durationMinutes: "",
  category: "",
};

interface Props {
  initial: ServiceFormData;
  onSave: (data: ServiceFormData) => void;
  onCancel: () => void;
  saving: boolean;
}

export function ServiceForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState(initial);
  const set =
    (k: keyof ServiceFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid =
    form.name.trim() !== "" &&
    form.price !== "" &&
    !isNaN(parseFloat(form.price)) &&
    parseFloat(form.price) >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="svc-name">Service name *</Label>
          <Input
            id="svc-name"
            placeholder="e.g. Teeth Whitening"
            value={form.name}
            onChange={set("name")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="svc-price">Price (EGP) *</Label>
          <Input
            id="svc-price"
            type="number"
            min={0}
            step={50}
            placeholder="0"
            value={form.price}
            onChange={set("price")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="svc-duration">Duration (minutes)</Label>
          <Input
            id="svc-duration"
            type="number"
            min={5}
            step={5}
            placeholder="60"
            value={form.durationMinutes}
            onChange={set("durationMinutes")}
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="svc-category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
          >
            <SelectTrigger id="svc-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
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
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" disabled={!valid || saving} onClick={() => onSave(form)}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
