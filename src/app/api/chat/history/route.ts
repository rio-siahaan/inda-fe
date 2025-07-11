import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");

  if (!conversationId || typeof conversationId !== "string") {
    return new Response(JSON.stringify({error : "conversationId tidak valid"}), {
      status : 400
    })
  }

  try {
    const logs = await prisma.messages.findMany({
      where: { conversationId : conversationId },
      orderBy: { created_at: "asc" },
      select: {
        role: true,
        message: true,
        selectedModel: true,
        responseTime: true
      },
    });

    console.log("Isi dari chat history : ", logs)

    return new Response(JSON.stringify(logs), {
      status: 200,
      headers: {"Content-Type" : "application/json"}
    })
  } catch (error) {
    console.error("Fetch chat error:", error);
    return new Response(JSON.stringify({error : "Terdapat kesalahan"}), {
      status : 500
    })
  }
}
