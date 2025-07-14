import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // const body = await req.json();
  // const userId = body.id;

  const userId = req.nextUrl.searchParams.get("userId")

  if (!userId) {
    return new Response("Tidak mendapatkan userId di startOrGetConversation", {
      status: 400,
    });
  }

  try {
    let conversations = await prisma.conversations.findMany({
      where: { userid: Number(userId) },
    });

    if (conversations.length === 0) {
      const newConversation = await prisma.conversations.create({
        data: {
          userid: Number(userId),
          title: `Percakapan ${new Date().toLocaleString()}`,
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
