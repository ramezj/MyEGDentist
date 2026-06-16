import { Hono } from "hono";
import { auth } from "../../auth.js";

export const authRoute = new Hono().on(["POST", "GET"], "/*", async (c) => {
  return auth.handler(c.req.raw);
});
