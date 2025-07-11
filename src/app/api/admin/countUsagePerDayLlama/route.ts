import { countUsagePerDayLlama } from "../../../../lib/countUsagePerDayLlama";

export async function POST() {
  try {
    const res = await countUsagePerDayLlama()
    const {usage} = await res.json()

    return new Response(JSON.stringify({usage : usage}))
  } catch (err) {
    throw new Error(`Gagal mendapatkan penggunaan bulanan ${err}`);
  }
}
