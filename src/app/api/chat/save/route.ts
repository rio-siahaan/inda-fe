import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { response_text, id_chat, selectedModel, name, persona } =
    await req.json();
  if (!response_text || !id_chat || !selectedModel || !persona) {
    return new Response("Missing parameters", { status: 400 });
  }

  const fastApiUrl = process.env.NEXT_PUBLIC_FAST_API_URL;

  //mulai track waktu respon
  const startTrack = Date.now();

  // 3. Stream ke FastAPI
  // const fastapiRes = await fetch(`${fastApiUrl}/get_response_stream`, {
  const fastapiRes = await fetch(`${fastApiUrl}/get_response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_text: response_text,
      id: id_chat,
      selectedModel: selectedModel,
      name: name,
      persona: persona,
    }),
  });

  if (!fastapiRes.ok || !fastapiRes.body) {
    const text = await fastapiRes.text(); // baca pesan error dari FastAPI
    return new Response(JSON.stringify({ error: `FastAPI error: ${text}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { processed_text, usage_metadata } = await fastapiRes.json();

  //selesai track waktu respon
  const endTrack = Date.now();
  const responseTimeTrack = endTrack - startTrack;

  // Simpan pesan dari user
  await prisma.messages.create({
    data: {
      conversationId: id_chat,
      role: "user",
      message: response_text,
      selectedModel: selectedModel,
      responseTime: 0,
      inputToken: usage_metadata?.input_tokens || 0,
      outputToken: 0,
    },
  });

  // Simpan pesan dari bot
  await prisma.messages.create({
    data: {
      conversationId: id_chat,
      role: "bot",
      message: processed_text,
      selectedModel: selectedModel,
      responseTime: responseTimeTrack,
      inputToken: 0,
      outputToken: usage_metadata?.output_tokens,
    },
  });

  await prisma.usages.create({
    data: {
      selectedModel: selectedModel,
      responseTime: responseTimeTrack,
      inputToken: usage_metadata?.input_tokens || 0,
      outputToken: usage_metadata?.output_tokens || 0,
    },
  });

  return new Response(
    JSON.stringify({
      message: processed_text,
      responseTime: responseTimeTrack,
      model: selectedModel,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
