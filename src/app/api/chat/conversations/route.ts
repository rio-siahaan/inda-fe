import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId tidak ditemukan di query param" },
      { status: 400 }
    );
  }

  try {
    const conversations = await prisma.conversations.findMany({
      where: { userid: userId },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        updatedat: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Gagal fetch conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
