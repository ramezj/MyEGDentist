import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { Skeleton } from "#/components/ui/skeleton";
import { dentistAppointmentsQuery, type DentistAppointment } from "#/queries/appointments";
import { dentistServicesQuery } from "#/queries/dentists";
import { AppointmentCard } from "#/components/dentist/appointment-card";
import { PageLayout } from "#/components/shared/page-layout";

export const Route = createFileRoute("/dentist/appointments")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: allAppointments = [], isLoading } = useQuery({
    ...dentistAppointmentsQuery,
    select: (data): DentistAppointment[] =>
      data.filter((d): d is DentistAppointment => "tourist" in d),
  });
  const { data: catalog = [] } = useQuery(dentistServicesQuery);

  const active = allAppointments.filter((a) =>
    ["pending", "confirmed", "in_progress"].includes(a.status),
  );
  const past = allAppointments.filter((a) =>
    ["completed", "cancelled"].includes(a.status),
  );

  return (
    <PageLayout variant="header" title="Appointments">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : allAppointments.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No appointments yet</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {active.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Active
              </h2>
              {active.map((a) => <AppointmentCard key={a.id} appt={a} catalog={catalog} />)}
            </section>
          )}

          {past.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Past
              </h2>
              {past.map((a) => <AppointmentCard key={a.id} appt={a} catalog={catalog} />)}
            </section>
          )}
        </div>
      )}
    </PageLayout>
  );
}
