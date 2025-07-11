import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { token, newPass } = await req.json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password berhasil diubah." });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Token tidak valid atau kadaluarsa." }, { status: 400 });
  }
}
