import { hc } from "hono/client";
import type { AppType } from "@myegdentist/api";
import { createIsomorphicFn } from "@tanstack/react-start";

const getApiHeaders = createIsomorphicFn()
  .client(() => ({}) as Record<string, string>)
  .server(async () => {
    const { getRequestHeaders } = await import("@tanstack/react-start/server");
    const cookie = getRequestHeaders().get("cookie");
    return cookie ? { cookie } : ({} as Record<string, string>);
  });

export const apiClient = hc<AppType>(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api",
  {
    headers: getApiHeaders,
    init: { credentials: "include" },
  },
);
