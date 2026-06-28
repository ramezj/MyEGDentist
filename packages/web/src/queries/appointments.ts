import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "#/lib/client";
import { handleApiError } from "#/lib/handle-error";

type AppointmentListItem = Awaited<ReturnType<typeof client.appointments.list>>[number];
export type AppointmentStatus = AppointmentListItem["status"];
export type Booking = Extract<AppointmentListItem, { dentistProfile: object }>;
export type DentistAppointment = Extract<AppointmentListItem, { tourist: object }>;
export type TreatmentStatus = "planned" | "completed" | "cancelled";

export const bookingsQuery = queryOptions({
  queryKey: ["bookings"],
  queryFn: () => client.appointments.list(),
});

export const dentistAppointmentsQuery = queryOptions({
  queryKey: ["dentist", "appointments"],
  queryFn: () => client.appointments.list(),
});

export const appointmentQuery = (id: string) =>
  queryOptions({
    queryKey: ["appointment", id],
    queryFn: () => client.appointments.get(id),
  });

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof client.appointments.create>[0]) =>
      client.appointments.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof client.appointments.updateStatus>[1];
    }) => client.appointments.updateStatus(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dentist", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useUpdateNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof client.appointments.updateNotes>[1];
    }) => client.appointments.updateNotes(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useAddTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      body,
    }: {
      appointmentId: string;
      body: Parameters<typeof client.appointments.treatments.add>[1];
    }) => client.appointments.treatments.add(appointmentId, body),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      tid,
      body,
    }: {
      appointmentId: string;
      tid: string;
      body: Parameters<typeof client.appointments.treatments.update>[2];
    }) => client.appointments.treatments.update(appointmentId, tid, body),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useRemoveTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      tid,
    }: {
      appointmentId: string;
      tid: string;
    }) => client.appointments.treatments.remove(appointmentId, tid),
    onSuccess: (_, { appointmentId }) => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
    },
    onError: (err) => handleApiError(err),
  });
}
