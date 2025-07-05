import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function countUsagePerDayGemini() {
  const now = new Date();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const messages = await prisma.messages.findMany({
    where: {
      role: "bot",
      selectedModel: 'gemini',
      created_at: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const totalUsage = messages.length;

  return new NextResponse(JSON.stringify({ 
    usage: totalUsage, 
  }));
}
