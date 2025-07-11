import { prisma } from "../../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId;

  try {
    const conversations = await prisma.conversations.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    const conversationIds = conversations.map((conv) => conv.id);

    if (conversationIds.length > 0) {
      await prisma.messages.deleteMany({
        where: {
          conversationId: {
            in: conversationIds,
          },
        },
      });
    }

    await prisma.conversations.deleteMany({
      where: {
        id: {
          in: conversationIds,
        },
      },
    });
    const baseUrl = process.env.NEXTAUTH_URL
    const getNewConversationId = await fetch(
      `${baseUrl}/api/chat/startOrGetConversation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      }
    );

    if (!getNewConversationId.ok) {
      const text = await getNewConversationId.text();
      console.error("Response failed with:", text);
      throw new Error(
        "Gagal memulai atau mendapatkan percakapan di saat hapus sesi"
      );
    }

    const newConversations = await getNewConversationId.json();
    const firstConversationId = Array.isArray(newConversations) ? newConversations[0] : null 

    return new Response(
      JSON.stringify({ newConversationId: firstConversationId.id }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(`Tidak dapat menghapus sesi chat ini dari user : ${userId}}`);
    throw new Error(`Terdapat eror saat menghapus sesi chat ${error}`);
  }
}
