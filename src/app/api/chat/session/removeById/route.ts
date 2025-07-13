import { prisma } from "../../../../../lib/prisma"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log("Isi body dari removeById : ", body)
  const userId = body.userId
  const conversationId = body.conversationId

  if (!conversationId) {
    console.error(
      "Tidak dapat menemukan sesi chat ini : ",
      conversationId.id
    )
    throw new Error("Terdapat eror saat menghapus sesi chat ")
  }

  try {
    await prisma.messages.deleteMany({
      where: {
        conversationid: conversationId,
      },
    })

    await prisma.conversations.delete({
      where: {
        id: conversationId,
        userid: userId,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL
    const getNewConversationId = await fetch(`${baseUrl}/api/chat/startOrGetConversation`, {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({id: userId})
    })

    if (!getNewConversationId.ok) {
      const text = await getNewConversationId.text()
      console.error("Response failed with:", text)
      throw new Error(
        "Gagal memulai atau mendapatkan percakapan di saat hapus sesi"
      )
    }

    const newConversationId = await getNewConversationId.json()

    const firstConversation = Array.isArray(newConversationId) ? newConversationId[0] : null

    return new Response(JSON.stringify({newConversationId: firstConversation.id}), {
        status: 200
    })
    
  } catch (error) {
    console.log(`Tidak dapat menghapus sesi chat ini : ${conversationId}`)
    throw new Error(`Terdapat eror saat menghapus sesi chat dengan eror : ${error}`)
  }
}
