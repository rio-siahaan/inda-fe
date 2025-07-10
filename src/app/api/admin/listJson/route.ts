import { ListFile } from "@/lib/listFile";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const listCsv = await ListFile()

    if (listCsv.ok) return NextResponse.json(listCsv)
  } catch () {
    return NextResponse.json({status: 500})
  }
}
