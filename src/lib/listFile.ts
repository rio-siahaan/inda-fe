import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function ListFile() {
  try {
    const listCsv = await prisma.files.findMany({
      select: {
        name: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(listCsv)
  } catch (error) {
    return NextResponse.json(
        {error: `Gagal mencari daftar file karena ${error}`},
        {status: 500}
    )
  }
}
