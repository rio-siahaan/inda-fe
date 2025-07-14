import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { nama, email, password, personifikasi } = await req.json();

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
  }

  const gambar = "../../../public/avatar-2.jpg"

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: nama,
      email: email,
      password: hashedPassword,
      personifikasi: personifikasi,
      image: gambar,
    },
  });

  return NextResponse.json({ user });
}
