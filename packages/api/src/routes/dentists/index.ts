import { Hono } from "hono";
import { prisma } from "../../core/lib/prisma.js";
import { auth } from "../../auth.js";

const dentists = new Hono()
  .get("/", async (c) => {
    const q = c.req.query("q") ?? "";
    const city = c.req.query("city") ?? "";
    const results = await prisma.dentistProfile.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { user: { name: { contains: q, mode: "insensitive" } } },
                  { clinicName: { contains: q, mode: "insensitive" } },
                  { specialty: { contains: q, mode: "insensitive" } },
                  { city: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          city ? { city: { contains: city, mode: "insensitive" } } : {},
        ],
      },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return c.json(results);
  })
  .post("/signup", async (c) => {
    const body = await c.req.json<{
      name: string;
      email: string;
      password: string;
    }>();
    const authRes = await auth.api.signUpEmail({
      body: { name: body.name, email: body.email, password: body.password },
      asResponse: true,
    });
    if (!authRes.ok) {
      return c.json(
        await authRes.json(),
        authRes.status as 400 | 422 | 409 | 500,
      );
    }
    const authData = (await authRes.json()) as { user: { id: string } };

    try {
      await prisma.user.update({
        where: { id: authData.user.id },
        data: { role: "dentist" },
      });
    } catch {
      // Compensate: remove the user that was just created so we don't leave broken state
      await prisma.user
        .delete({ where: { id: authData.user.id } })
        .catch(() => {});
      return c.json({ message: "Sign up failed, please try again" }, 500);
    }

    const setCookies = authRes.headers.getSetCookie();
    for (const cookie of setCookies) {
      c.header("Set-Cookie", cookie, { append: true });
    }

    // Fetch the session using the cookies from signup so the response reflects
    // the updated role rather than the stale data Better Auth returned.
    const cookieHeader = setCookies.map((c) => c.split(";")[0]).join("; ");
    const session = await auth.api.getSession({
      headers: new Headers({ cookie: cookieHeader }),
    });

    return c.json(session, 201);
  });

export default dentists;
