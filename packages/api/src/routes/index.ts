import { Hono } from "hono";
import health from "./health/index.js";
import { authRoute } from "./auth/index.js";
import dentists from "./dentists/index.js";
import users from "./users/index.js";

const api = new Hono()
  .route("/health", health)
  .route("/auth", authRoute)
  .route("/dentists", dentists)
  .route("/users", users);

export type AppType = typeof api;

export default api;
