import { prisma } from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // const { searchParams } = new URL(req.url);
  // const email = searchParams.get("email");
  const {email} = await req.json()

  if (!email) {
    return new Response("Email diperlukan", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, personifikasi: true, role: true},
    });

    if (!user) {
      return new Response("User tidak ditemukan", { status: 404 });
    }

    return new Response(JSON.stringify({ id: user.id, name: user.name, personifikasi: user.personifikasi, role: user.role }), {
      status: 200,
    });
  } catch (err) {
    console.error("GET profile error: ", err);
    return new Response("Terjadi kesalahan server", { status: 500 });
  }
}
