import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./core/lib/prisma.js";
import { UserType } from "./core/lib/roles.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      type: {
        type: Object.values(UserType) as [UserType, ...UserType[]],
        defaultValue: UserType.tourist,
        input: true,
      },
      onboarding: {
        type: "boolean",
        defaultValue: false,
        input: true,
      },
    },
  },
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
