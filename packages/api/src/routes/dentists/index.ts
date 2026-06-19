import { Hono } from "hono";
import { prisma } from "../../core/lib/prisma.js";

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

export default dentists;
