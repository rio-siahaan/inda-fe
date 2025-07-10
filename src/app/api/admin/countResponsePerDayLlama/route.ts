import { countResponseTimePerDayLlama } from "@/lib/countResponseTimePerDayLlama";
import { NextResponse } from "next/server";

export async function POST(){
    try {
        const res = await countResponseTimePerDayLlama()
        const {avgResponse} = await res.json()
        return new NextResponse(JSON.stringify({avgResponse: avgResponse}), {status: 200})
    } catch (err) {
        return new NextResponse(JSON.stringify({error : `Gagal menghitung respon Llama karena ${err}`}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        )
    }
}