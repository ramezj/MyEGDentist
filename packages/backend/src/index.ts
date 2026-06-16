import { Hono } from "hono";
import { cors } from "hono/cors";
import api from "./routes/index.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: [process.env.APP_URL as string, "http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api", api);

export { app };

export type { AppType } from "./routes/index.js";
