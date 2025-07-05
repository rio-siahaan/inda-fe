import { NextRequest, NextResponse } from "next/server";
import { countFile }  from "@/lib/countFile";

export async function POST(req: NextRequest) {
  try {
    const {currentCount, selisih} = await countFile()
    return new NextResponse(
      JSON.stringify({
        count: currentCount,
        selisih: selisih
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Gagal menghitung jumlah user" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
