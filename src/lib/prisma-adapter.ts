import { Adapter } from "next-auth/adapters";
import { prisma } from "../lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export function CustomPrismaAdapter(): Adapter {
  const defaultAdapter = PrismaAdapter(prisma);

  return {
    ...defaultAdapter,
    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      const account = await prisma.account.findFirst({
        where: {
          provider,
          provideraccountid: providerAccountId, // lowercase key untuk Railway
        },
        include: {
          user: true,
        },
      });
      return account?.user ?? null;
    },
  };
}
