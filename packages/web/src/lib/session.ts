import { createIsomorphicFn } from "@tanstack/react-start";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { authClient } from "./auth-client";

const fetchSession = createIsomorphicFn()
  .client(async () => {
    const { data } = await authClient.getSession();
    return data?.user ?? null;
  })
  .server(async () => {
    const { getRequestHeaders } = await import("@tanstack/react-start/server");
    const cookie = getRequestHeaders().get("cookie") ?? "";
    const { data } = await authClient.getSession({
      fetchOptions: { headers: cookie ? { cookie } : {} },
    });
    return data?.user ?? null;
  });

export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: fetchSession,
  staleTime: 5 * 60 * 1000,
});

export function useSession() {
  return useQuery(sessionQuery);
}
