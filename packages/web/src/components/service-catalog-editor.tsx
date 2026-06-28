import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Badge } from "#/components/ui/badge";

export type DentistService = { name: string; price: number };

const SUGGESTED_SERVICES = [
  "Teeth Whitening",
  "Dental Implants",
  "Veneers",
  "Braces / Invisalign",
  "Root Canal Treatment",
  "Professional Cleaning",
  "Crowns & Bridges",
  "Tooth Extractions",
  "Dental Fillings",
  "Smile Makeover",
];

export function ServiceCatalogEditor({
  services,
  onChange,
}: {
  services: DentistService[];
  onChange: (s: DentistService[]) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const existingNames = new Set(services.map((s) => s.name));

  function add() {
    const trimmed = name.trim();
    const p = parseFloat(price);
    if (!trimmed || isNaN(p) || p < 0) return;
    onChange([...services, { name: trimmed, price: p }]);
    setName("");
    setPrice("");
  }

  function addSuggestion(s: string) {
    if (existingNames.has(s)) return;
    setName(s);
  }

  function remove(idx: number) {
    onChange(services.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {/* Suggestions */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Quick add common services:</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SERVICES.map((s) => (
            <Badge
              key={s}
              variant={existingNames.has(s) ? "default" : "outline"}
              className={
                existingNames.has(s)
                  ? "opacity-40 cursor-default"
                  : "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              }
              onClick={() => !existingNames.has(s) && addSuggestion(s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* Add row */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <Label htmlFor="svc-name" className="text-xs">Service name</Label>
          <Input
            id="svc-name"
            placeholder="e.g. Teeth Whitening"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          />
        </div>
        <div className="w-28 space-y-1">
          <Label htmlFor="svc-price" className="text-xs">Price (EGP)</Label>
          <Input
            id="svc-price"
            type="number"
            min={0}
            step={50}
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={add}
          disabled={!name.trim() || price === "" || isNaN(parseFloat(price))}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </Button>
      </div>

      {/* Current catalog */}
      {services.length > 0 && (
        <div className="rounded-md border divide-y">
          {services.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2">
              <span className="text-sm">{s.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium tabular-nums">
                  EGP {s.price.toLocaleString()}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(i)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
          No services added yet. Click a suggestion or fill the form above.
        </p>
      )}
    </div>
  );
}
