import { ListFile } from "../../../../lib/listFile";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const {listCsv} = await ListFile();
    return NextResponse.json({ files: listCsv });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}