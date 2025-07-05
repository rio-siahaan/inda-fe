import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { batasAtas, batasBawah } = body;

  const DOMAIN = process.env.DOMAIN_BPS;
  const KEY = process.env.API_KEY_BPS;

  // Folder simpan data JSON per tanggal
  const todayDate = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const baseFolder = path.join(process.cwd(), "data", "json", todayDate);

  // Pastikan folder ada, async
  await fs.promises.mkdir(baseFolder, { recursive: true });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let var_id = batasBawah; var_id <= batasAtas; var_id++) {
        const url = `https://webapi.bps.go.id/v1/api/list/model/data/domain/${DOMAIN}/var/${var_id}/key/${KEY}/`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`API BPS error status: ${response.status}`);
          }

          const data = await response.json();

          let result: any = {};

          if (data["data-availability"] !== "available") {
            result = { var_id, status: "tidak tersedia" };
          } else {
            // Sanitasi dan batasi label agar aman jadi filename
            const rawLabel = data.var?.[0]?.label || `var_${var_id}`;
            const sanitizedLabel = rawLabel.replace(/[\/\\:*?"<>|]/g, "-").slice(0, 100);

            const fileName = `${sanitizedLabel}.json`;
            const filePath = path.join(baseFolder, fileName);

            // Simpan file secara async non-blocking
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

            result = { var_id, status: "tersimpan", file: fileName };
          }

          controller.enqueue(encoder.encode(JSON.stringify(result) + "\n"));
        } catch (error: any) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ var_id, status: "error", error: error.message }) + "\n"
            )
          );
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
