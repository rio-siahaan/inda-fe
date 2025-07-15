import { prisma } from "./prisma";

export async function countUser() {
  try {
    const now = new Date()

    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)


    const totalUsers = await prisma.user.findMany({
      where: {
        role: "user",
      },
    });
    
    const thisMonthUser = await prisma.user.findMany({
        where: {
            role: "user",
            createdAt: {
                gte: startThisMonth,
                lte: now
            }
        }
    })

    const lastMonthUser = await prisma.user.findMany({
        where: {
            role: "user",
            createdat: {
                gte: startLastMonth,
                lte: endLastMonth
            }
        }
    })

    const selisihUserPerMonth = thisMonthUser.length - lastMonthUser.length

    const users = totalUsers.length

    return {users, selisihUserPerMonth}
  } catch (error) {
    console.error("Error di countUser: ", error)
    throw new Error("Gagal menghitung total user")
  }
}
