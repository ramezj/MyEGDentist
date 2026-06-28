import { apiClient } from "#/lib/api-client";
import { parseResponse } from "#/lib/api-error";

export const client = {
  dentists: {
    search: (params: { q?: string; city?: string; specialty?: string } = {}) =>
      apiClient.dentists
        .$get({ query: { q: params.q ?? "", city: params.city ?? "", specialty: params.specialty ?? "" } })
        .then(parseResponse),

    get: (id: string) =>
      apiClient.dentists[":id"]
        .$get({ param: { id } })
        .then(parseResponse),

    me: () =>
      apiClient.dentists.me
        .$get({})
        .then(parseResponse),

    onboard: (body: Parameters<typeof apiClient.dentists.onboarding.$post>[0]["json"]) =>
      apiClient.dentists.onboarding
        .$post({ json: body })
        .then(parseResponse),

    update: (body: Parameters<typeof apiClient.dentists.me.$patch>[0]["json"]) =>
      apiClient.dentists.me
        .$patch({ json: body })
        .then(parseResponse),

    services: {
      list: () =>
        apiClient.dentists.me.services
          .$get({})
          .then(parseResponse),

      create: (body: Parameters<typeof apiClient.dentists.me.services.$post>[0]["json"]) =>
        apiClient.dentists.me.services
          .$post({ json: body })
          .then(parseResponse),

      update: (sid: string, body: Parameters<typeof apiClient.dentists.me.services[":sid"]["$patch"]>[0]["json"]) =>
        apiClient.dentists.me.services[":sid"]
          .$patch({ param: { sid }, json: body })
          .then(parseResponse),

      remove: (sid: string) =>
        apiClient.dentists.me.services[":sid"]
          .$delete({ param: { sid } })
          .then(parseResponse),
    },
  },

  appointments: {
    create: (body: Parameters<typeof apiClient.appointments.$post>[0]["json"]) =>
      apiClient.appointments
        .$post({ json: body })
        .then(parseResponse),

    list: () =>
      apiClient.appointments
        .$get({})
        .then(parseResponse),

    get: (id: string) =>
      apiClient.appointments[":id"]
        .$get({ param: { id } })
        .then(parseResponse),

    updateStatus: (id: string, body: Parameters<typeof apiClient.appointments[":id"]["status"]["$patch"]>[0]["json"]) =>
      apiClient.appointments[":id"].status
        .$patch({ param: { id }, json: body })
        .then(parseResponse),

    updateNotes: (id: string, body: Parameters<typeof apiClient.appointments[":id"]["notes"]["$patch"]>[0]["json"]) =>
      apiClient.appointments[":id"].notes
        .$patch({ param: { id }, json: body })
        .then(parseResponse),

    treatments: {
      add: (appointmentId: string, body: Parameters<typeof apiClient.appointments[":id"]["treatments"]["$post"]>[0]["json"]) =>
        apiClient.appointments[":id"].treatments
          .$post({ param: { id: appointmentId }, json: body })
          .then(parseResponse),

      update: (appointmentId: string, tid: string, body: Parameters<typeof apiClient.appointments[":id"]["treatments"][":tid"]["$patch"]>[0]["json"]) =>
        apiClient.appointments[":id"].treatments[":tid"]
          .$patch({ param: { id: appointmentId, tid }, json: body })
          .then(parseResponse),

      remove: (appointmentId: string, tid: string) =>
        apiClient.appointments[":id"].treatments[":tid"]
          .$delete({ param: { id: appointmentId, tid } })
          .then(parseResponse),
    },
  },
};
