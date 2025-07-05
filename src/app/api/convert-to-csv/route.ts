import { NextRequest } from "next/server";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({ multiple: true });

  const files = await new Promise<any>((resolve, reject) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      resolve(files);
    });
  });

  const jsonFiles = Array.isArray(files.files) ? files.Files : [files.files];

  const results: { filename: string; success: boolean }[] = [];

  for (const file of jsonFiles) {
    const buffer = await fs.readFile(file.filepath);

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([buffer], { type: "application/json" }),
      file.originalFilename
    );

    const fastapiResponse = await fetch(
      `${process.env.FAST_API_URL}/convert-json-to-csv`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (fastapiResponse.ok) {
      const blob = await fastapiResponse.blob();
      const filename =
        file.originalFilename?.replace(/\.json$/, ".csv") || uuidv4 + ".csv";
      const filePath = path.join(
        process.cwd(),
        "public",
        "csv_output",
        filename
      );
      await fs.writeFile(filePath, Buffer.from(await blob.arrayBuffer()));
      results.push({ filename, success: true });
    } else {
      results.push({
        filename: file.originalFilename || "unknown.json",
        success: false,
      });
    }
  }
  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
