import { ChangeProfile } from "@/lib/changeProfile";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const {name, personifikasi, email} = await req.json()

    if(!name || !personifikasi || !email){
        return new Response("Missing parameters", {status: 400})
    }

    try {
        const res = await ChangeProfile(name, personifikasi, email)
        const {message, status} = await res.json()

        if (message == "success" || status == 200){
            return new Response(message)
        }
    } catch (error) {
        console.log("Terdapat eror saat ubah profil karena ", error)
        throw new Error("Terdapat eror saat ubah profil!")
    }
    
}