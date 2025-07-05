import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function countFile() {
  try {
    const baseDir = path.join(process.cwd(), "data");

    // Baca semua folder tanggal (YYYY-MM-DD)
    const folders = await fs.promises.readdir(baseDir);

    // Cari folder terbaru berdasarkan nama folder (tanggal)
    const latestFolder = folders
      .filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f))
      .sort()
      .reverse()[0];

    if (!latestFolder) {
    return { currentCount: 0, selisih: 0 };
    }

    const folderPath = path.join(baseDir, latestFolder);
    const files = await fs.promises.readdir(folderPath);
    const jsonFileCount = files.filter(f => f.endsWith(".json")).length || 0;

    // Cari folder bulan lalu berdasarkan nama folder (tanggal)
    const lastMonthFolder = folders
      .filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f))
      .sort()
      .reverse()[1];


    if (!lastMonthFolder) {
      return { currentCount: jsonFileCount, selisih: 0}
    }

    const lastMonthFolderPath = path.join(baseDir, lastMonthFolder)
    const lastMonthFiles = await fs.promises.readdir(lastMonthFolderPath)
    const lastMonthJsonFileCount = lastMonthFiles.filter(f => f.endsWith(".json")).length || 0

    const selisihFiles = jsonFileCount - lastMonthJsonFileCount

    return { currentCount: jsonFileCount, selisih: selisihFiles };
  } catch (error) {
    console.error(error);
    return NextResponse.json({ count: 0, error: "Gagal membaca folder" });
  }
}