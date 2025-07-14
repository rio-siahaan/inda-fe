import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function countResponseTimePerDayGemini() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const messagesToday = await prisma.messages.findMany({
      where: {
        selectedmodel: "gemini",
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        responsetime: true
      },
    });

    const totalUsage = messagesToday.length;

    const totalResponse = messagesToday.reduce(
      (sum, msg) => sum + (msg.responsetime ?? 0),
      0
    );

    const avgResponse = totalUsage > 0 ? Math.round(totalResponse / totalUsage) : 0;

    return new NextResponse(JSON.stringify({avgResponse: avgResponse}))
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }));
  }
}
