import { ListFile } from "@/lib/listFile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const listCsv = await ListFile()

    if (listCsv.ok) return NextResponse.json(listCsv)
  } catch (error) {
    return NextResponse.json({status: 500})
  }
}
