import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  // const session = await getServerSession(authOptions);
  // const userId = session?.user?.id;
  const body = await req.json()
  const userId = body.id

  if(!userId){
    console.error("Tidak mendapatkan userIdnya")
  }

  try {
    const conversation = await prisma.conversations.create({
      data: {
        userid: Number(userId),
        title: `Percakapan ${new Date().toLocaleString()}`,
      },
    });
    return new Response(JSON.stringify({id : conversation.id}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Terjadi error saat menambahkan session chat ${err}` }),
      { status: 500 }
    );
  }
}
