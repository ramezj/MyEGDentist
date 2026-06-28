import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { dentistServicesQuery, useCreateService } from "#/queries/dentists";
import { ServiceRow } from "#/components/dentist/service-row";
import {
  ServiceForm,
  SERVICE_CATEGORIES,
  EMPTY_SERVICE_FORM,
  type ServiceFormData,
} from "#/components/dentist/service-form";
import { PageLayout } from "#/components/shared/page-layout";

export const Route = createFileRoute("/dentist/services")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: services = [], isLoading } = useQuery(dentistServicesQuery);
  const [adding, setAdding] = useState(false);
  const createMutation = useCreateService();

  function handleCreate(form: ServiceFormData) {
    createMutation.mutate(
      {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim() || undefined,
        durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : undefined,
        category: form.category || undefined,
      },
      { onSuccess: () => setAdding(false) },
    );
  }

  const grouped = SERVICE_CATEGORIES.reduce<Record<string, typeof services>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});
  const uncategorized = services.filter((s) => !s.category);

  const addButton = !adding && (
    <Button size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
      <Plus className="w-4 h-4" /> Add service
    </Button>
  );

  return (
    <PageLayout variant="header" title="Services" primaryButton={addButton}>
      <div className="space-y-6 max-w-2xl">
        {adding && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">New Service</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <ServiceForm
                initial={EMPTY_SERVICE_FORM}
                onSave={handleCreate}
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
    </PageLayout>
  );
}
