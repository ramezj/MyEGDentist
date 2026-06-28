import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { useUpdateService, useRemoveService, type DentistService } from "#/queries/dentists";
import { ServiceForm, type ServiceFormData } from "#/components/dentist/service-form";

function serviceToForm(s: DentistService): ServiceFormData {
  return {
    name: s.name,
    price: String(s.price),
    description: s.description ?? "",
    durationMinutes: s.durationMinutes != null ? String(s.durationMinutes) : "",
    category: s.category ?? "",
  };
}

interface Props {
  svc: DentistService;
}

export function ServiceRow({ svc }: Props) {
  const [editing, setEditing] = useState(false);
  const updateMutation = useUpdateService();
  const removeMutation = useRemoveService();

  function handleSave(form: ServiceFormData) {
    updateMutation.mutate(
      {
        sid: svc.id,
        body: {
          name: form.name.trim(),
          price: parseFloat(form.price),
          description: form.description.trim() || undefined,
          durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : undefined,
          category: form.category || undefined,
        },
      },
      { onSuccess: () => setEditing(false) },
    );
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
                <Badge variant="secondary" className="text-[10px]">
                  {svc.category}
                </Badge>
              )}
              {!svc.isActive && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Archived
                </Badge>
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
              onClick={() =>
                updateMutation.mutate({ sid: svc.id, body: { isActive: !svc.isActive } })
              }
              disabled={updateMutation.isPending}
            >
              {svc.isActive ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
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
              onClick={() => removeMutation.mutate(svc.id)}
              disabled={removeMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
