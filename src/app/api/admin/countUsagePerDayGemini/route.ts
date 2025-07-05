import { countUsagePerDayGemini } from "@/lib/countUsagePerDayGemini";

export async function POST() {
  try {
    const res = await countUsagePerDayGemini()
    const {usage} = await res.json()

    return new Response(JSON.stringify({usage : usage}))
  } catch (error) {
    throw new Error("Gagal mendapatkan penggunaan bulanan");
  }
}
