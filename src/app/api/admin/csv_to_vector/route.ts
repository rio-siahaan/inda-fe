import { createReadStream, readdirSync, statSync } from "fs";
import path from "path";
import csv from "csv-parser";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

const BATCH_SIZE = 50; // batch size lebih kecil untuk stabilitas
const COLLECTION_NAME = "new_inda_collection";
const VECTOR_SIZE = 768;

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Inda CSV Document",
  apiKey: process.env.GOOGLE_API_KEY!,
});

const encoder = new TextEncoder();
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Fungsi retry untuk upsert agar lebih tahan gangguan
async function upsertWithRetry(client: QdrantClient, collectionName: string, points: any[], maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.upsert(collectionName, { points });
      return; // sukses langsung keluar
    } catch (e) {
      console.error(`Upsert gagal di percobaan ${attempt}:`, e);
      if (attempt === maxRetries) throw e;
      // tunggu eksponensial sebelum retry
      await delay(attempt * 1000);
    }
  }
}

export async function GET() {
  const todayDate = new Date().toISOString().slice(0, 10);
  const folderPath = path.join(process.cwd(), "data", "csv", todayDate);
  const csvFiles = readdirSync(folderPath).filter((f) => f.endsWith(".csv"));

  const client = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
    timeout: 120_000,
  });

  // Cek dan buat collection jika belum ada
  const existing = await client.getCollections();
  if (!existing.collections.some((col) => col.name === COLLECTION_NAME)) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: { size: VECTOR_SIZE, distance: "Cosine" },
    });
  }

  let pointsBatch: any[] = [];
  let totalUploaded = 0;
  let totalDocs = 0;

  // Hitung total dokumen untuk progress proporsional
  for (const file of csvFiles) {
    const filePath = path.join(folderPath, file);
    if (statSync(filePath).size === 0) continue;
    const rows = await countRowsInCSV(filePath);
    totalDocs += rows;
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode("retry: 1000\n\n"));

        for (const file of csvFiles) {
          const filePath = path.join(folderPath, file);
          if (statSync(filePath).size === 0) continue;

          const csvStream = createReadStream(filePath).pipe(csv());

          for await (const row of csvStream) {
            let content = "";
            if (row.label_turvar) {
              content = `Pada variabel ${row.label_turvar} tahun ${row.label_tahun}, dalam topik '${row.label_subject}', indikator '${row.label_var}' untuk kategori '${row.label_vervar}' memiliki nilai sebesar ${row.nilai}.`;
            } else {
              content = `Pada tahun ${row.label_tahun}, dalam topik '${row.label_subject}', indikator '${row.label_var}' untuk kategori '${row.label_vervar}' memiliki nilai sebesar ${row.nilai}.`;
            }

            const embedding = await embeddings.embedQuery(content);

            if (
              !Array.isArray(embedding) ||
              embedding.length !== VECTOR_SIZE ||
              embedding.some((v) => typeof v !== "number" || isNaN(v))
            ) {
              console.warn("Embedding invalid, skip:", content);
              continue;
            }

            const id = totalUploaded + pointsBatch.length + 1;

            const payload = {
              content,
              subject: row.label_subject || "",
              kategori: row.label_vervar || "",
              indikator: row.label_var || "",
              variabel: row.label_turvar || "",
              tahun: row.label_tahun || "",
              nilai: row.nilai || "",
            };

            pointsBatch.push({ id, payload, vector: embedding });

            if (pointsBatch.length >= BATCH_SIZE) {
              await upsertWithRetry(client, COLLECTION_NAME, pointsBatch);
              totalUploaded += pointsBatch.length;
              pointsBatch = [];

              const progress = Math.min(
                Math.round((totalUploaded / totalDocs) * 100),
                100
              );
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    totalUploaded,
                    progress,
                  })}\n\n`
                )
              );

              // delay singkat, tapi bisa disesuaikan
              await delay(500);
            }
          }
        }

        if (pointsBatch.length > 0) {
          await upsertWithRetry(client, COLLECTION_NAME, pointsBatch);
          totalUploaded += pointsBatch.length;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ totalUploaded, progress: 100 })}\n\n`
            )
          );
        }

        controller.enqueue(encoder.encode(`event: done\ndata: Upload selesai\n\n`));
        controller.close();
      } catch (error: any) {
        console.error("Error saat embed/upsert:", error);
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

// Hitung baris CSV
async function countRowsInCSV(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    createReadStream(filePath)
      .pipe(csv())
      .on("data", () => count++)
      .on("end", () => resolve(count))
      .on("error", (err) => reject(err));
  });
}
