import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) {
    return new NextResponse("Missing file name", { status: 400 });
  }

  const filePath = path.join("/tmp", name);

  try {
    const stat = fs.statSync(filePath);
    const stream = fs.createReadStream(filePath);

    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    // ❗Hapus file setelah stream selesai
    stream.on("close", () => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`❌ Gagal menghapus file ${filePath}:`, err);
        } else {
          console.log(`🧹 File ${filePath} berhasil dihapus`);
        }
      });
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `inline; filename="${name}"`,
      },
    });
  } catch (err) {
    return new NextResponse(`File not found ${err}`, { status: 404 });
  }
}
