import { countUsagePerMonth } from "@/lib/countUsagePerMonth";

export async function POST() {
  try {
    const res = await countUsagePerMonth()
    const {usage} = await res.json()

    return new Response(JSON.stringify({usage : usage}))
  } catch (error) {
    throw new Error("Gagal mendapatkan penggunaan bulanan");
  }
}
