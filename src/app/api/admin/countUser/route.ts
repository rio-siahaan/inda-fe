import { countUser } from "@/lib/countUser";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    try{
        const {users, selisihUserPerMonth} = await countUser()
        return new Response(JSON.stringify({total : users, selisihUserPerMonth: selisihUserPerMonth}), {
            status: 200, headers: {"Content-Type":"application/json"}
        })
    }catch(error){
        return new Response(JSON.stringify({error : "Gagal menghitung jumlah user"}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        )
    }
}