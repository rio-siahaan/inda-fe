import { ListFile } from "../../../../lib/listFile";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const {listCsv} = await ListFile();
    return new Response(
      JSON.stringify({
        files: listCsv,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}