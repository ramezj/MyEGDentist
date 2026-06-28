import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../../core/lib/prisma.js";
import { auth } from "../../auth.js";
import { unauthorized, forbidden, notFound, badRequest } from "../../core/lib/response.js";
import type { AppointmentStatus } from "../../generated/prisma/client.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createAppointmentSchema = z.object({
  dentistProfileId: z.string(),
  serviceIds: z.array(z.string()).min(1),
  requestedDate: z.string(),
  touristNotes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]),
  confirmedDate: z.string().optional(),
  dentistNotes: z.string().optional(),
  reason: z.string().optional(),
});

const updateNotesSchema = z.object({
  dentistNotes: z.string(),
});

const addTreatmentSchema = z.object({
  serviceId: z.string(),
  notes: z.string().optional(),
});

const updateTreatmentSchema = z.object({
  status: z.enum(["planned", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOURIST_ALLOWED_STATUSES: AppointmentStatus[] = ["cancelled"];
const DENTIST_ALLOWED_STATUSES: AppointmentStatus[] = [
  "confirmed", "in_progress", "completed", "cancelled",
];

async function getSession(c: { req: { raw: Request } }) {
  return auth.api.getSession({ headers: c.req.raw.headers });
}

const TREATMENT_INCLUDE = {
  catalogService: { select: { id: true, name: true, price: true, category: true } },
};

function validate<T extends z.ZodTypeAny>(schema: T) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return badRequest(c, result.error.issues[0]?.message ?? "Invalid request body");
    }
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const appointments = new Hono()

  .post("/", validate(createAppointmentSchema), async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "tourist") return forbidden(c, "Only tourists can book appointments");

    const body = c.req.valid("json");

    const dentist = await prisma.dentistProfile.findUnique({
      where: { id: body.dentistProfileId },
    });
    if (!dentist) return notFound(c, "Dentist not found");

    const services = await prisma.dentistService.findMany({
      where: {
        id: { in: body.serviceIds },
        dentistProfileId: body.dentistProfileId,
        isActive: true,
      },
    });
    if (services.length === 0) return badRequest(c, "No valid services selected");

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

  .get("/", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;

    if (user.type === "tourist") {
      const list = await prisma.appointment.findMany({
        where: { touristId: user.id },
        include: {
          treatments: { orderBy: { createdAt: "asc" }, include: TREATMENT_INCLUDE },
          dentistProfile: { include: { user: { select: { name: true, image: true } } } },
        },
        orderBy: { requestedDate: "asc" },
      });
      return c.json(list);
    }

    if (user.type === "dentist") {
      const profile = await prisma.dentistProfile.findUnique({ where: { userId: user.id } });
      if (!profile) return notFound(c, "Profile not found");

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

  .get("/:id", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: {
        treatments: { orderBy: { createdAt: "asc" }, include: TREATMENT_INCLUDE },
        statusHistory: {
          orderBy: { changedAt: "asc" },
          include: { changedBy: { select: { name: true } } },
        },
        dentistProfile: { include: { user: { select: { name: true, image: true } } } },
        tourist: { select: { id: true, name: true, image: true, email: true } },
      },
    });

    if (!appointment) return notFound(c);

    const isOwner = appointment.touristId === user.id;
    const isDentist = user.type === "dentist" && appointment.dentistProfile.userId === user.id;
    if (!isOwner && !isDentist) return forbidden(c);

    return c.json(appointment);
  })

  .patch("/:id/status", validate(updateStatusSchema), async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment) return notFound(c);

    const isOwner = appointment.touristId === user.id;
    const isDentist = user.type === "dentist" && appointment.dentistProfile.userId === user.id;
    if (!isOwner && !isDentist) return forbidden(c);

    const body = c.req.valid("json");
    const allowed = isDentist ? DENTIST_ALLOWED_STATUSES : TOURIST_ALLOWED_STATUSES;
    if (!allowed.includes(body.status as AppointmentStatus))
      return forbidden(c, `Cannot set status to "${body.status}"`);

    const updated = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.update({
        where: { id: c.req.param("id") },
        data: {
          status: body.status as AppointmentStatus,
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
          toStatus: body.status as AppointmentStatus,
          changedById: user.id,
          reason: body.reason ?? null,
        },
      });
      return appt;
    });

    return c.json(updated);
  })

  .patch("/:id/notes", validate(updateNotesSchema), async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c);

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment || appointment.dentistProfile.userId !== user.id) return forbidden(c);

    const { dentistNotes } = c.req.valid("json");
    const updated = await prisma.appointment.update({
      where: { id: c.req.param("id") },
      data: { dentistNotes },
    });

    return c.json(updated);
  })

  .post("/:id/treatments", validate(addTreatmentSchema), async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c, "Only dentists can add treatments");

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment) return notFound(c);
    if (appointment.dentistProfile.userId !== user.id) return forbidden(c);

    const { serviceId, notes } = c.req.valid("json");

    const service = await prisma.dentistService.findUnique({ where: { id: serviceId } });
    if (!service || service.dentistProfileId !== appointment.dentistProfileId)
      return notFound(c, "Service not found in your catalog");

    const treatment = await prisma.appointmentTreatment.create({
      data: {
        appointmentId: appointment.id,
        serviceId: service.id,
        service: service.name,
        price: service.price,
        notes: notes ?? null,
        addedBy: "dentist",
      },
      include: TREATMENT_INCLUDE,
    });

    return c.json(treatment, 201);
  })

  .patch("/:id/treatments/:tid", validate(updateTreatmentSchema), async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c, "Only dentists can update treatments");

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment || appointment.dentistProfile.userId !== user.id) return forbidden(c);

    const body = c.req.valid("json");

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

  .delete("/:id/treatments/:tid", async (c) => {
    const session = await getSession(c);
    if (!session?.user) return unauthorized(c);
    const user = session.user as typeof auth.$Infer.Session.user;
    if (user.type !== "dentist") return forbidden(c, "Only dentists can remove treatments");

    const appointment = await prisma.appointment.findUnique({
      where: { id: c.req.param("id") },
      include: { dentistProfile: true },
    });
    if (!appointment || appointment.dentistProfile.userId !== user.id) return forbidden(c);

    const treatment = await prisma.appointmentTreatment.findUnique({
      where: { id: c.req.param("tid") },
    });
    if (!treatment) return notFound(c);
    if (treatment.status === "completed")
      return badRequest(c, "Cannot remove a completed treatment");

    await prisma.appointmentTreatment.delete({ where: { id: c.req.param("tid") } });
    return c.json({ ok: true });
  });

export default appointments;
