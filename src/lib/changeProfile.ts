import {prisma} from "../lib/prisma";

export async function ChangeProfile(name: string, personifikasi: string, email: string){
    try {
        if(!name || !personifikasi || !email){
            throw new Error("Parameter ubah profil tidak lengkap!")
        }

        await prisma.user.update({
            where:{
                email: email
            },
            data: {
                name: name,
                personifikasi: personifikasi
            }
        })

        return new Response(JSON.stringify({message: "success", status: 200}))
    } catch (error) {
        console.log("Terdapat eror saat ubah profil karena ", error)
        throw new Error("Terdapat eror saat ubah profil!")
    }
}