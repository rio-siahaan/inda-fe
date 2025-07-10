import { NextRequest } from "next/server";
import { countFile }  from "@/lib/countFile";

export async function POST(req: NextRequest) {
  try {
    const {count, selisih} = await countFile()
    return new Response(
      JSON.stringify({
        count: count,
        selisih: selisih
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Gagal menghitung jumlah user" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
