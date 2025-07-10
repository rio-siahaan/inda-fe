// app/api/convert-to-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convertJsonToCsvAndSave } from "@/lib/convert-to-csv";

export async function POST(req: NextRequest) {
  try {
    
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const results: { filename: string; success: boolean }[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const jsonText = Buffer.from(arrayBuffer).toString("utf-8");
      const filename = file.name
      let jsonContent;
      try {
        jsonContent = JSON.parse(jsonText);
      } catch (e) {
        console.error("Invalid JSON:", e);
        results.push({ filename: file.name, success: false });
        continue;
      }

      const result = await convertJsonToCsvAndSave(jsonContent, filename);
      results.push(result);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Gagal upload dan konversi:", error);
    return NextResponse.json({ error: "Gagal memproses file" }, { status: 500 });
  }
}
