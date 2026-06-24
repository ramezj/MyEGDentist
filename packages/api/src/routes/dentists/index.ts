import { Hono } from "hono";
import { prisma } from "../../core/lib/prisma.js";
import { auth } from "../../auth.js";

const dentists = new Hono()
  .get("/me", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const profile = await prisma.dentistProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { name: true, image: true, email: true } } },
    });

    if (!profile) return c.json({ error: "Profile not found" }, 404);

    return c.json(profile);
  })
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
  .post("/onboarding", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const existing = await prisma.dentistProfile.findUnique({
      where: { userId: user.id },
    });
    if (existing) return c.json({ error: "Profile already exists" }, 400);

    const body = (await c.req.json()) as {
      clinicName: string;
      specialty: string;
      city: string;
      phone?: string;
      bio?: string;
      experience?: string;
      languages?: string[];
      address?: string;
      services?: string[];
    };

    if (!body.clinicName?.trim() || !body.specialty?.trim() || !body.city?.trim()) {
      return c.json({ error: "clinicName, specialty and city are required" }, 400);
    }

    const [profile] = await prisma.$transaction([
      prisma.dentistProfile.create({
        data: {
          userId: user.id,
          clinicName: body.clinicName.trim(),
          specialty: body.specialty,
          city: body.city,
          phone: body.phone ?? null,
          bio: body.bio ?? null,
          experience: body.experience ?? null,
          languages: body.languages ?? [],
          address: body.address ?? null,
          services: body.services ?? [],
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { onboarding: true },
      }),
    ]);

    return c.json({ success: true, profile });
  });

export default dentists;
