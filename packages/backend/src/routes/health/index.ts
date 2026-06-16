import { Hono } from "hono";

const health = new Hono().get("/", (c) => {
  return c.json({ ok: true, timestamp: new Date().toISOString() });
});

export default health;
