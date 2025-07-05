import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), "data", "json");

    // Baca semua folder tanggal (YYYY-MM-DD)
    const folders = await fs.promises.readdir(baseDir);

    // Cari folder terbaru berdasarkan nama folder (tanggal)
    const latestFolder = folders
      .filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f))
      .sort()
      .reverse()[0];

    if (!latestFolder) {
      return NextResponse.json({ files: [] });
    }

    const folderPath = path.join(baseDir, latestFolder);

    const files = await fs.promises.readdir(folderPath);

    const fileInfos = files
      .filter(f => f.endsWith(".json"))
      .map(f => ({
        filename: f.replace(/\.json$/i, ""),
        waktu_masuk: latestFolder, // dari nama folder parent
      }));

    return NextResponse.json({ files: fileInfos });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ files: [], error: "Gagal membaca folder" });
  }
}
