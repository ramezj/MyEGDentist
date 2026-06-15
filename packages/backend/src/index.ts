import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";

export const app = new Hono()
  .use(
    "/api/*",
    cors({
      origin: [process.env.APP_URL as string, "http://localhost:3000"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .get("/api/health", (c) => {
    return c.json({ ok: true, timestamp: new Date().toISOString() });
  })
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    return auth.handler(c.req.raw);
  });

export type AppType = typeof app;
