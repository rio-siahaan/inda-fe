import { countUser } from "@/lib/countUser";

export async function POST(){
    try{
        const {users, selisihUserPerMonth} = await countUser()
        return new Response(JSON.stringify({total : users, selisihUserPerMonth: selisihUserPerMonth}), {
            status: 200, headers: {"Content-Type":"application/json"}
        })
    }catch(err){
        return new Response(JSON.stringify({error : `Gagal menghitung jumlah user ${err}`}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        )
    }
}