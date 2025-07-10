import { countFile }  from "@/lib/countFile";

export async function POST() {
  try {
    const {count, selisih} = await countFile()
    return new Response(
      JSON.stringify({
        count: count,
        selisih: selisih
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Gagal menghitung jumlah user karena ${err}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
