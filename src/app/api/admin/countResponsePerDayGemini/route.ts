import { countResponseTimePerDayGemini } from "../../../../lib/countResponseTimePerDayGemini";
import { NextResponse } from "next/server";

export async function POST(){
    try {
        const res = await countResponseTimePerDayGemini()
        const {avgResponse} = await res.json()
        return new NextResponse(JSON.stringify({avgResponse: avgResponse}), {status: 200})
    } catch (err) {
        return new NextResponse(JSON.stringify({error : `Gagal menghitung respon Gemini karena ${err}`}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        )
    }
}