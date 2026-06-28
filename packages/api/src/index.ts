import { Hono } from "hono";
import { cors } from "hono/cors";
import { Prisma } from "./generated/prisma/client.js";
import { createError } from "./core/lib/errors.js";
import api from "./routes/index.js";
import { auth } from "./auth.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: [process.env.APP_URL as string, "http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api", api);

app.onError((err, c) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      const e = createError.notFound();
      return c.json({ code: e.code, message: e.message }, e.status);
    }
    if (err.code === "P2002") {
      const e = createError.conflict("Already exists");
      return c.json({ code: e.code, message: e.message }, e.status);
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    const e = createError.badRequest("Invalid request data");
    return c.json({ code: e.code, message: e.message }, e.status);
  }
  console.error(err);
  const e = createError.internal();
  return c.json({ code: e.code, message: e.message }, e.status);
});

export { app, auth };
export type { AppType } from "./routes/index.js";
export type { ApiErrorBody, ErrorCode } from "./core/lib/errors.js";
