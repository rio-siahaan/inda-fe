import { countUsagePerDayGemini } from "@/lib/countUsagePerDayGemini";

export async function POST() {
  try {
    const res = await countUsagePerDayGemini()
    const {usage} = await res.json()

    return new Response(JSON.stringify({usage : usage}))
  } catch (err) {
    throw new Error(`Gagal mendapatkan penggunaan bulanan karena ${err}`);
  }
}
