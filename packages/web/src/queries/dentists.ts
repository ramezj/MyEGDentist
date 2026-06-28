import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "#/lib/client";
import { handleApiError } from "#/lib/handle-error";

export type DentistListing = Awaited<ReturnType<typeof client.dentists.search>>[number];
export type DentistProfile = Awaited<ReturnType<typeof client.dentists.get>>;
export type DentistMe = Awaited<ReturnType<typeof client.dentists.me>>;
export type DentistService = Awaited<ReturnType<typeof client.dentists.services.list>>[number];

export type Availability = { days: string[]; startTime: string; endTime: string };
export function isAvailability(v: unknown): v is Availability {
  return (
    typeof v === "object" &&
    v !== null &&
    "days" in v &&
    "startTime" in v &&
    "endTime" in v
  );
}

export const dentistsQuery = (params: { q?: string; city?: string; specialty?: string } = {}) =>
  queryOptions({
    queryKey: ["dentists", params],
    queryFn: () => client.dentists.search(params),
    staleTime: 2 * 60 * 1000,
  });

export const dentistQuery = (id: string) =>
  queryOptions({
    queryKey: ["dentist", id],
    queryFn: () => client.dentists.get(id),
  });

export const dentistMeQuery = queryOptions({
  queryKey: ["dentist", "me"],
  queryFn: () => client.dentists.me(),
});

export const dentistServicesQuery = queryOptions({
  queryKey: ["dentist", "services"],
  queryFn: () => client.dentists.services.list(),
});

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof client.dentists.update>[0]) =>
      client.dentists.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "me"] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof client.dentists.services.create>[0]) =>
      client.dentists.services.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "services"] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sid,
      body,
    }: {
      sid: string;
      body: Parameters<typeof client.dentists.services.update>[1];
    }) => client.dentists.services.update(sid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "services"] });
    },
    onError: (err) => handleApiError(err),
  });
}

export function useRemoveService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sid: string) => client.dentists.services.remove(sid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentist", "services"] });
    },
    onError: (err) => handleApiError(err),
  });
}
