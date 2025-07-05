import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const todayDate = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const inputFolder = path.join(process.cwd(), "data", "json", todayDate);
  const outputFolder = path.join(process.cwd(), "data", "csv", todayDate);

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const files = fs.readdirSync(inputFolder).filter((f) => f.endsWith(".json"));
  const encoder = new TextEncoder();

  // Fungsi escape CSV aman (untuk koma, kutip, newline)
  function escapeCSV(value: string | number) {
    if (typeof value === "number") return value.toString();
    if (typeof value !== "string") return "-";
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  // Fungsi ekstrak id sesuai pola di python
  function extractIDs(
    key: string,
    vervars: string[],
    vars: string[],
    turvars: string[],
    tahuns: string[]
  ): [string | null, string | null, string | null, string | null] {
    for (let vervar of vervars) {
      if (key.startsWith(vervar)) {
        const rem1 = key.slice(vervar.length);
        for (let v of vars) {
          if (rem1.startsWith(v)) {
            const rem2 = rem1.slice(v.length);
            for (let tur of turvars) {
              if (rem2.startsWith(tur)) {
                const rem3 = rem2.slice(tur.length);
                for (let thn of tahuns) {
                  if (rem3.startsWith(thn) && rem3.endsWith("0")) {
                    return [vervar, v, tur, thn];
                  }
                }
              }
            }
          }
        }
      }
    }
    return [null, null, null, null];
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          const raw = fs.readFileSync(path.join(inputFolder, file), "utf-8");
          const data = JSON.parse(raw);

          if (!data.datacontent) continue;

          // Extract labels dan map seperti python
          const subject_label =
            (data.subject?.[0]?.label || data.subj?.[0]?.label) || "-";
          const var_label = data.var?.[0]?.label || "-";

          const vervarMap = Object.fromEntries(
            (data.vervar || []).map((i: any) => [i.val.toString(), i.label])
          );
          const turvarMap = Object.fromEntries(
            (data.turvar || []).map((i: any) => [i.val.toString(), i.label])
          );
          const tahunMap = Object.fromEntries(
            (data.tahun || []).map((i: any) => [i.val.toString(), i.label])
          );

          const vervarKeys = Object.keys(vervarMap).sort(
            (a, b) => b.length - a.length
          );
          const varKeys = (data.var || [])
            .map((i: any) => i.val.toString())
            .sort((a: string, b: string) => b.length - a.length);
          const turvarKeys = Object.keys(turvarMap).sort(
            (a, b) => b.length - a.length
          );
          const tahunKeys = Object.keys(tahunMap).sort(
            (a, b) => b.length - a.length
          );

          const csvRows = [
            "label_subject,label_vervar,label_var,label_turvar,label_tahun,nilai",
          ];

          for (const [key, value] of Object.entries(data.datacontent)) {
            if (value === null) continue;

            const [vervar, v, turvar, tahun] = extractIDs(
              key,
              vervarKeys,
              varKeys,
              turvarKeys,
              tahunKeys
            );

            if (!vervar || !turvar || !tahun) continue;

            const row = [
              subject_label,
              vervarMap[vervar]?.replace("Tidak ada", "-") || "-",
              var_label?.replace("Tidak ada", "-") || "-",
              turvarMap[turvar]?.replace("Tidak ada", "-") || "-",
              tahunMap[tahun]?.replace("Tidak ada", "-") || "-",
              value,
            ].map(escapeCSV);

            csvRows.push(row.join(","));
          }

          const csvContent = csvRows.join("\n");
          const outputFilePath = path.join(outputFolder, file.replace(".json", ".csv"));
          fs.writeFileSync(outputFilePath, csvContent, "utf-8");

          // Kirim progress SSE ke client
          const progress = Math.round(((i + 1) / totalFiles) * 100);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                message: `Selesai konversi file ${file} (${i + 1}/${totalFiles})`,
                progress,
              })}\n\n`
            )
          );
        }

        // Kirim event selesai
        controller.enqueue(encoder.encode("event: done\ndata: Konversi CSV selesai\n\n"));
        controller.close();
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify(error.message)}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
