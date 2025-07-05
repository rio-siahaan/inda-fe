import { prisma } from "./prisma";

export async function countMessages() {
  try {
    const messages = await prisma.messages.findMany({
        where:{
            role:"bot"
        }
    });

    const now = new Date();

    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    const thisMonthMessages = await prisma.messages.findMany({
      where: {
        role: "bot",
        created_at: {
          gte: startThisMonth,
          lte: now,
        },
      },
    });

    const lastMonthMessages = await prisma.messages.findMany({
      where: {
        created_at: {
          gte: startLastMonth,
          lte: endLastMonth,
        },
      },
    });

    const selisihMessagesPerMonth = thisMonthMessages.length - lastMonthMessages.length || 0;

    const totalMessages = messages.length || 0
    return {totalMessages, selisihMessagesPerMonth};
  } catch (error) {
    throw new Error("Gagal menghitung jumlah Messages");
  }
}
