import { Hono } from "hono";
import { prisma } from "../../core/lib/prisma.js";
import { auth } from "../../auth.js";

const SERVICE_INCLUDE = {
  where: { isActive: true },
  orderBy: [{ category: "asc" as const }, { name: "asc" as const }],
};

const dentists = new Hono()

  // ── Authenticated dentist profile ─────────────────────────────────────────
  .get("/me", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const profile = await prisma.dentistProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: { select: { name: true, image: true, email: true } },
        services: { orderBy: [{ category: "asc" }, { name: "asc" }] },
      },
    });

    if (!profile) return c.json({ error: "Profile not found" }, 404);
    return c.json(profile);
  })

  // ── Public search ─────────────────────────────────────────────────────────
  .get("/", async (c) => {
    const q = c.req.query("q") ?? "";
    const city = c.req.query("city") ?? "";
    const specialty = c.req.query("specialty") ?? "";

    const results = await prisma.dentistProfile.findMany({
      where: {
        AND: [
          q ? {
            OR: [
              { user: { name: { contains: q, mode: "insensitive" } } },
              { clinicName: { contains: q, mode: "insensitive" } },
              { specialty: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
            ],
          } : {},
          city ? { city: { contains: city, mode: "insensitive" } } : {},
          specialty ? { specialty: { equals: specialty, mode: "insensitive" } } : {},
        ],
      },
      include: {
        user: { select: { name: true, image: true } },
        services: SERVICE_INCLUDE,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return c.json(results);
  })

  // ── Public single dentist ──────────────────────────────────────────────────
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const profile = await prisma.dentistProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true } },
        services: SERVICE_INCLUDE,
      },
    });

    if (!profile) return c.json({ error: "Not found" }, 404);
    return c.json(profile);
  })

  // ── Onboarding ────────────────────────────────────────────────────────────
  .post("/onboarding", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const existing = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
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
      services?: {
        name: string;
        price: number;
        description?: string;
        durationMinutes?: number;
        category?: string;
      }[];
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
          services: body.services?.length
            ? { create: body.services.map((s) => ({ ...s, name: s.name.trim() })) }
            : undefined,
        },
      }),
      prisma.user.update({ where: { id: user.id }, data: { onboarding: true } }),
    ]);

    return c.json({ success: true, profile });
  })

  // ── Update profile ────────────────────────────────────────────────────────
  .patch("/me", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const body = (await c.req.json()) as {
      clinicName: string;
      specialty: string;
      city: string;
      phone?: string;
      bio?: string;
      experience?: string;
      languages?: string[];
      address?: string;
      availability?: { days: string[]; startTime: string; endTime: string };
    };

    if (!body.clinicName?.trim() || !body.specialty?.trim() || !body.city?.trim()) {
      return c.json({ error: "clinicName, specialty and city are required" }, 400);
    }

    const profile = await prisma.dentistProfile.update({
      where: { userId: user.id },
      data: {
        clinicName: body.clinicName.trim(),
        specialty: body.specialty,
        city: body.city,
        phone: body.phone ?? null,
        bio: body.bio ?? null,
        experience: body.experience ?? null,
        languages: body.languages ?? [],
        address: body.address ?? null,
        availability: body.availability ?? undefined,
      },
      include: {
        user: { select: { name: true, image: true, email: true } },
        services: { orderBy: [{ category: "asc" }, { name: "asc" }] },
      },
    });

    return c.json(profile);
  })

  // ── List my services ──────────────────────────────────────────────────────
  .get("/me/services", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const profile = await prisma.dentistProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return c.json({ error: "Profile not found" }, 404);

    const services = await prisma.dentistService.findMany({
      where: { dentistProfileId: profile.id },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return c.json(services);
  })

  // ── Create service ────────────────────────────────────────────────────────
  .post("/me/services", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return c.json({ error: "Profile not found" }, 404);

    const body = (await c.req.json()) as {
      name: string;
      price: number;
      description?: string;
      durationMinutes?: number;
      category?: string;
    };

    if (!body.name?.trim()) return c.json({ error: "name is required" }, 400);
    if (typeof body.price !== "number" || body.price < 0)
      return c.json({ error: "price must be a non-negative number" }, 400);

    const service = await prisma.dentistService.create({
      data: {
        dentistProfileId: profile.id,
        name: body.name.trim(),
        price: body.price,
        description: body.description ?? null,
        durationMinutes: body.durationMinutes ?? null,
        category: body.category ?? null,
      },
    });

    return c.json(service, 201);
  })

  // ── Update service ────────────────────────────────────────────────────────
  .patch("/me/services/:sid", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return c.json({ error: "Profile not found" }, 404);

    const service = await prisma.dentistService.findUnique({
      where: { id: c.req.param("sid") },
    });
    if (!service || service.dentistProfileId !== profile.id)
      return c.json({ error: "Not found" }, 404);

    const body = (await c.req.json()) as {
      name?: string;
      price?: number;
      description?: string;
      durationMinutes?: number;
      category?: string;
      isActive?: boolean;
    };

    const updated = await prisma.dentistService.update({
      where: { id: service.id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.durationMinutes !== undefined && { durationMinutes: body.durationMinutes }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return c.json(updated);
  })

  // ── Delete service ────────────────────────────────────────────────────────
  .delete("/me/services/:sid", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return c.json({ error: "Profile not found" }, 404);

    const service = await prisma.dentistService.findUnique({
      where: { id: c.req.param("sid") },
      include: { _count: { select: { treatments: true } } },
    });
    if (!service || service.dentistProfileId !== profile.id)
      return c.json({ error: "Not found" }, 404);

    if (service._count.treatments > 0) {
      // Soft delete — preserve historical treatment links
      await prisma.dentistService.update({
        where: { id: service.id },
        data: { isActive: false },
      });
      return c.json({ archived: true });
    }

    await prisma.dentistService.delete({ where: { id: service.id } });
    return c.json({ deleted: true });
  });

export default dentists;
