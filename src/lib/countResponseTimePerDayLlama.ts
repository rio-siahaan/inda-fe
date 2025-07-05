import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function countResponseTimePerDayLlama() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const messagesToday = await prisma.messages.findMany({
      where: {
        selectedModel: "llama",
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        responseTime: true
      },
    });

    const totalUsage = messagesToday.length;

    const totalResponse = messagesToday.reduce(
      (sum, msg) => sum + (msg.responseTime ?? 0),
      0
    );

    const avgResponse = totalUsage > 0 ? Math.round(totalResponse / totalUsage) : 0;

    return new NextResponse(JSON.stringify({totalUsage: totalUsage, avgResponse: avgResponse}))
  } catch (error) {
    return new Response(JSON.stringify({ error: error }));
  }
}
