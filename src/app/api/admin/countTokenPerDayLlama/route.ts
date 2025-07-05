import { countTokenPerDayLlama } from "@/lib/countTokenPerDayLlama"

export async function POST(){
    try {
        const res = await countTokenPerDayLlama()
        const {totalUsage, totalInput, totalOutput} = await res.json()

        return new Response(JSON.stringify({totalUsage: totalUsage, totalInput: totalInput, totalOutput: totalOutput}))
    } catch (error) {
        console.error(error)
    }
}