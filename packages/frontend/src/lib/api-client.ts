import { hc } from "hono/client";
import type { AppType } from "@myegdentist/backend";

const baseUrl =
  import.meta.env.VITE_BACKEND_URL ??
  (import.meta.env.MODE === "production" ? "/" : "http://localhost:8080");

export const apiClient = hc<AppType>(baseUrl);

export type { AppType };
