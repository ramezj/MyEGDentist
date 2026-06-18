import { Hono } from "hono";
import { auth } from "../../auth.js";

const users = new Hono()
  .post("/signup", async (c) => {
    const body = await c.req.json<{ name: string; email: string; password: string }>();

    const authRes = await auth.api.signUpEmail({
      body: { name: body.name, email: body.email, password: body.password },
      asResponse: true,
    });

    if (!authRes.ok) {
      return c.json(await authRes.json(), authRes.status as 400 | 422 | 409 | 500);
    }

    const authData = await authRes.json();

    for (const cookie of authRes.headers.getSetCookie()) {
      c.header("Set-Cookie", cookie, { append: true });
    }

    return c.json(authData, 201);
  });

export default users;
