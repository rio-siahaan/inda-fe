import { ListFile } from "../../../../lib/listFile";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const listCsv = await ListFile()

    return NextResponse.json({files: listCsv})
  } catch (error) {
    console.log(error)
    return NextResponse.json({status: 500})
  }
}
