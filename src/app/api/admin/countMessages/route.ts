import { countMessages } from "@/lib/countMessages";
import { NextRequest } from "next/server";

export async function POST(){
    try{
        const {totalMessages, selisihMessagesPerMonth} = await countMessages()
        return new Response(JSON.stringify({totalMessages : totalMessages, selisihMessagesPerMonth: selisihMessagesPerMonth}), {
            status: 200, headers: {"Content-Type":"application/json"}
        })
    }catch(err){
        return new Response(JSON.stringify({error : `Gagal menghitung jumlah user ${err}`}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        )
    }
}