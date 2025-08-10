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

    return {listCsv: listCsv}
  } catch (error) {
    console.error("Gagal mengambil file knowledge karena ", error)
    return {listCsv: []}
  }
}
