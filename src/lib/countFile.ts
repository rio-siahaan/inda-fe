import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function countFile() {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfThisMonth.getTime() - 1); // sehari sebelum bulan ini

    // 🔹 File bulan ini
    const thisMonthCount = await prisma.files.count({
      where: {
        created_at: {
          gte: startOfThisMonth,
          lte: now,
        },
      },
    });

    // 🔹 File bulan lalu
    const lastMonthCount = await prisma.files.count({
      where: {
        created_at: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const selisih = thisMonthCount - lastMonthCount;

    return {count: thisMonthCount, selisih}
  } catch (error) {
    console.error("Gagal menghitung file:", error);
    return new Response(
      JSON.stringify({ error: "Gagal menghitung file", status: 500 })
    );
  }
}
