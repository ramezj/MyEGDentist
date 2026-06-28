import { Hono } from "hono";
import { prisma } from "../../core/lib/prisma.js";
import { auth } from "../../auth.js";
import type { AppointmentStatus, TreatmentStatus } from "../../generated/prisma/client.js";

const TOURIST_ALLOWED_STATUSES: AppointmentStatus[] = ["cancelled"];
const DENTIST_ALLOWED_STATUSES: AppointmentStatus[] = [
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

async function getSession(c: { req: { raw: Request } }) {
  return auth.api.getSession({ headers: c.req.raw.headers });
}

const TREATMENT_INCLUDE = {
  catalogService: { select: { id: true, name: true, price: true, category: true } },
};

const appointments = new Hono()

  // ── Create booking (tourist only) ──────────────────────────────────────────
  .post("/", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "tourist")
      return c.json({ error: "Only tourists can book appointments" }, 403);

    const body = (await c.req.json()) as {
      dentistProfileId: string;
      serviceIds: string[];
      requestedDate: string;
      touristNotes?: string;
    };

    if (!body.dentistProfileId || !body.serviceIds?.length || !body.requestedDate)
      return c.json({ error: "dentistProfileId, serviceIds and requestedDate are required" }, 400);

    const dentist = await prisma.dentistProfile.findUnique({
      where: { id: body.dentistProfileId },
    });
    if (!dentist) return c.json({ error: "Dentist not found" }, 404);

    // Fetch the selected services to snapshot name + price
    const services = await prisma.dentistService.findMany({
      where: {
        id: { in: body.serviceIds },
        dentistProfileId: body.dentistProfileId,
        isActive: true,
      },
    });

    if (services.length === 0)
      return c.json({ error: "No valid services selected" }, 400);

    const appointment = await prisma.appointment.create({
      data: {
        dentistProfileId: body.dentistProfileId,
        touristId: user.id,
        requestedDate: new Date(body.requestedDate),
        touristNotes: body.touristNotes ?? null,
        treatments: {
          create: services.map((s) => ({
            serviceId: s.id,
            service: s.name,
            price: s.price,
            addedBy: "tourist" as const,
          })),
        },
        statusHistory: {
          create: { toStatus: "pending", changedById: user.id },
        },
      },
      include: {
        treatments: { include: TREATMENT_INCLUDE },
        dentistProfile: { include: { user: { select: { name: true } } } },
      },
    });

    return c.json(appointment, 201);
  })

  // ── List my appointments (role-aware) ──────────────────────────────────────
  .get("/", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;

    if (user.type === "tourist") {
      const list = await prisma.appointment.findMany({
        where: { touristId: user.id },
        include: {
          treatments: { orderBy: { createdAt: "asc" }, include: TREATMENT_INCLUDE },
          dentistProfile: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
        orderBy: { requestedDate: "asc" },
      });
      return c.json(list);
    }

    if (user.type === "dentist") {
      const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
      if (!profile) return c.json({ error: "Profile not found" }, 404);

      const list = await prisma.appointment.findMany({
        where: { dentistProfileId: profile.id },
        include: {
          treatments: { orderBy: { createdAt: "asc" }, include: TREATMENT_INCLUDE },
          tourist: { select: { id: true, name: true, image: true, email: true } },
        },
        orderBy: { requestedDate: "asc" },
      });
      return c.json(list);
    }

    return c.json([]);
  })

  // ── Get single appointment ──────────────────────────────────────────────────
  .get("/:id", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: {
        treatments: {
          orderBy: { createdAt: "asc" },
          include: TREATMENT_INCLUDE,
        },
        statusHistory: {
          orderBy: { changedAt: "asc" },
          include: { changedBy: { select: { name: true } } },
        },
        dentistProfile: { include: { user: { select: { name: true, image: true } } } },
        tourist: { select: { id: true, name: true, image: true, email: true } },
      },
    });

    if (!appointment) return c.json({ error: "Not found" }, 404);

    const isOwner = appointment.touristId === user.id;
    const isDentist = user.type === "dentist" && appointment.dentistProfile.userId === user.id;
    if (!isOwner && !isDentist) return c.json({ error: "Forbidden" }, 403);

    return c.json(appointment);
  })

  // ── Update appointment status ───────────────────────────────────────────────
  .patch("/:id/status", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment) return c.json({ error: "Not found" }, 404);

    const isOwner = appointment.touristId === user.id;
    const isDentist = user.type === "dentist" && appointment.dentistProfile.userId === user.id;
    if (!isOwner && !isDentist) return c.json({ error: "Forbidden" }, 403);

    const body = (await c.req.json()) as {
      status: AppointmentStatus;
      confirmedDate?: string;
      dentistNotes?: string;
      reason?: string;
    };

    const allowed = isDentist ? DENTIST_ALLOWED_STATUSES : TOURIST_ALLOWED_STATUSES;
    if (!allowed.includes(body.status))
      return c.json({ error: `Cannot set status to "${body.status}"` }, 403);

    const updated = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.update({
        where: { id: c.req.param("id") },
        data: {
          status: body.status,
          ...(body.confirmedDate && { confirmedDate: new Date(body.confirmedDate) }),
          ...(body.dentistNotes !== undefined && { dentistNotes: body.dentistNotes }),
        },
        include: {
          treatments: { orderBy: { createdAt: "asc" }, include: TREATMENT_INCLUDE },
          dentistProfile: { include: { user: { select: { name: true, image: true } } } },
          tourist: { select: { id: true, name: true, image: true, email: true } },
        },
      });
      await tx.appointmentStatusHistory.create({
        data: {
          appointmentId: appt.id,
          fromStatus: appointment.status,
          toStatus: body.status,
          changedById: user.id,
          reason: body.reason ?? null,
        },
      });
      return appt;
    });

    return c.json(updated);
  })

  // ── Update dentist notes ────────────────────────────────────────────────────
  .patch("/:id/notes", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Forbidden" }, 403);

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment || appointment.dentistProfile.userId !== user.id)
      return c.json({ error: "Forbidden" }, 403);

    const { dentistNotes } = (await c.req.json()) as { dentistNotes: string };
    const updated = await prisma.appointment.update({
      where: { id: c.req.param("id") },
      data: { dentistNotes },
    });

    return c.json(updated);
  })

  // ── Add treatment (dentist only, from their catalog) ───────────────────────
  .post("/:id/treatments", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return c.json({ error: "Only dentists can add treatments" }, 403);

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment) return c.json({ error: "Not found" }, 404);
    if (appointment.dentistProfile.userId !== user.id)
      return c.json({ error: "Forbidden" }, 403);

    const body = (await c.req.json()) as { serviceId: string; notes?: string };
    if (!body.serviceId) return c.json({ error: "serviceId is required" }, 400);

    const service = await prisma.dentistService.findUnique({
      where: { id: body.serviceId },
    });
    if (!service || service.dentistProfileId !== appointment.dentistProfileId)
      return c.json({ error: "Service not found in your catalog" }, 404);

    const treatment = await prisma.appointmentTreatment.create({
      data: {
        appointmentId: appointment.id,
        serviceId: service.id,
        service: service.name,
        price: service.price,
        notes: body.notes ?? null,
        addedBy: "dentist",
      },
      include: TREATMENT_INCLUDE,
    });

    return c.json(treatment, 201);
  })

  // ── Update treatment ────────────────────────────────────────────────────────
  .patch("/:id/treatments/:tid", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist")
      return c.json({ error: "Only dentists can update treatments" }, 403);

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment || appointment.dentistProfile.userId !== user.id)
      return c.json({ error: "Forbidden" }, 403);

    const body = (await c.req.json()) as {
      status?: TreatmentStatus;
      notes?: string;
    };

    const treatment = await prisma.appointmentTreatment.update({
      where: { id: c.req.param("tid") },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.status === "completed" && { completedAt: new Date() }),
        ...(body.status === "planned" && { completedAt: null }),
      },
      include: TREATMENT_INCLUDE,
    });

    return c.json(treatment);
  })

  // ── Delete treatment ────────────────────────────────────────────────────────
  .delete("/:id/treatments/:tid", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist")
      return c.json({ error: "Only dentists can remove treatments" }, 403);

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment || appointment.dentistProfile.userId !== user.id)
      return c.json({ error: "Forbidden" }, 403);

    const treatment = await prisma.appointmentTreatment.findUnique({
      where: { id: c.req.param("tid") },
    });
    if (!treatment) return c.json({ error: "Not found" }, 404);
    if (treatment.status === "completed")
      return c.json({ error: "Cannot remove a completed treatment" }, 400);

    await prisma.appointmentTreatment.delete({ where: { id: c.req.param("tid") } });
    return c.json({ success: true });
  });

export default appointments;
