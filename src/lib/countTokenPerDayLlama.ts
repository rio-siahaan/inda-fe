import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function countTokenPerDayLlama() {
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
        inputToken: true,
        outputToken: true,
      },
    });

    const totalUsage = messagesToday.length;

    const totalInput = messagesToday.reduce(
      (sum, msg) => sum + (msg.inputtoken ?? 0),
      0
    );
    const totalOutput = messagesToday.reduce(
      (sum, msg) => sum + (msg.outputtoken ?? 0),
      0
    );

    // const avgInputLlama = totalUsage > 0 ? Math.round(totalInput / totalUsage) : 0;
    // const avgOutputLlama = totalUsage > 0 ? Math.round(totalOutput / totalUsage) : 0;

    return new NextResponse(JSON.stringify({totalUsage: totalUsage, totalInput: totalInput, totalOutput: totalOutput}))
  } catch (error) {
    return new Response(JSON.stringify({ error: error }));
  }
}
