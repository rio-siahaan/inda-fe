import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response("Email diperlukan", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true, personifikasi: true },
    });

    if (!user) {
      return new Response("User tidak ditemukan", { status: 404 });
    }

    return new Response(JSON.stringify({ name: user.name, personifikasi: user.personifikasi }), {
      status: 200,
    });
  } catch (err) {
    console.error("GET profile error: ", err);
    return new Response("Terjadi kesalahan server", { status: 500 });
  }
}
