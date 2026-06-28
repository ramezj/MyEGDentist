import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../../core/lib/prisma.js";
import { auth } from "../../auth.js";
import { unauthorized, forbidden, notFound, badRequest, conflict } from "../../core/lib/response.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const serviceSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
  category: z.string().optional(),
});

const onboardSchema = z.object({
  clinicName: z.string().min(1),
  specialty: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  languages: z.array(z.string()).optional(),
  address: z.string().optional(),
  services: z.array(serviceSchema).optional(),
});

const updateProfileSchema = z.object({
  clinicName: z.string().min(1),
  specialty: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  languages: z.array(z.string()).optional(),
  address: z.string().optional(),
  availability: z.object({
    days: z.array(z.string()),
    startTime: z.string(),
    endTime: z.string(),
  }).optional(),
});

const updateServiceSchema = serviceSchema.partial().extend({ isActive: z.boolean().optional() });

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_INCLUDE = {
  where: { isActive: true },
  orderBy: [{ category: "asc" as const }, { name: "asc" as const }],
};

function validate<T extends z.ZodTypeAny>(schema: T) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return badRequest(c, result.error.issues[0]?.message ?? "Invalid request body");
    }
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const dentists = new Hono()

  .get("/me", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const profile = await prisma.dentistProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: { select: { name: true, image: true, email: true } },
        services: { orderBy: [{ category: "asc" }, { name: "asc" }] },
      },
    });

    if (!profile) return notFound(c, "Profile not found");
    return c.json(profile);
  })

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

  .get("/:id", async (c) => {
    const profile = await prisma.dentistProfile.findUnique({
      where: { id: c.req.param("id") },
      include: {
        user: { select: { name: true, image: true } },
        services: SERVICE_INCLUDE,
      },
    });

    if (!profile) return notFound(c);
    return c.json(profile);
  })

  .post("/onboarding", validate(onboardSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c);

    const existing = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (existing) return conflict(c, "Profile already exists");

    const body = c.req.valid("json");

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

    return c.json(profile, 201);
  })

  .patch("/me", validate(updateProfileSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c);

    const body = c.req.valid("json");

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

  .get("/me/services", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const profile = await prisma.dentistProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return notFound(c, "Profile not found");

    const services = await prisma.dentistService.findMany({
      where: { dentistProfileId: profile.id },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return c.json(services);
  })

  .post("/me/services", validate(serviceSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c);

    const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return notFound(c, "Profile not found");

    const body = c.req.valid("json");

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

  .patch("/me/services/:sid", validate(updateServiceSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c);

    const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return notFound(c, "Profile not found");

    const service = await prisma.dentistService.findUnique({
      where: { id: c.req.param("sid") },
    });
    if (!service || service.dentistProfileId !== profile.id) return notFound(c);

    const body = c.req.valid("json");

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

  .delete("/me/services/:sid", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return unauthorized(c);

    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c);

    const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return notFound(c, "Profile not found");

    const service = await prisma.dentistService.findUnique({
      where: { id: c.req.param("sid") },
      include: { _count: { select: { treatments: true } } },
    });
    if (!service || service.dentistProfileId !== profile.id) return notFound(c);

    if (service._count.treatments > 0) {
      // Soft delete — preserve historical treatment links
      await prisma.dentistService.update({
        where: { id: service.id },
        data: { isActive: false },
      });
      return c.json({ ok: true, archived: true });
    }

    await prisma.dentistService.delete({ where: { id: service.id } });
    return c.json({ ok: true });
  });

export default dentists;
