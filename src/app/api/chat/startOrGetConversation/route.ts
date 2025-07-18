import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.id;

  // const userId = req.nextUrl.searchParams.get("userId")

  if (!userId) {
    return new Response("Tidak mendapatkan userId di startOrGetConversation", {
      status: 400,
    });
  }

  try {
    let conversations = await prisma.conversations.findMany({
      where: { userId: userId },
    });

    if (conversations.length === 0) {
      const newConversation = await prisma.conversations.create({
        data: {
          userId: userId,
          title: `Percakapan ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
        },
      });
      conversations = [newConversation];
    }

    return new Response(
      JSON.stringify(
        conversations.map((conv) => ({ id: conv.id, title: conv.title }))
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    // return NextResponse.json(conversations)

  } catch (error) {
    console.error("Start/Get conversation error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
