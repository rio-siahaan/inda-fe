import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function countUsagePerMonth() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const messages = await prisma.messages.findMany({
    where: {
      role: "bot",
      created_at: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31T23:59:59`),
      },
    },
  });
  const usagePerMonth = Array(12).fill(0);
  messages.forEach((msg) => {
    const monthIndex = new Date(msg.created_at).getMonth(); // 0 = Jan
    usagePerMonth[monthIndex]++;
  });

  return new NextResponse(JSON.stringify({ usage: usagePerMonth }));
}
