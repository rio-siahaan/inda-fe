// /app/api/reset/send-token.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { resetEmailTemplate } from "../../../../../lib/resetEmailTemplate";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { message: "Format email tidak valid." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { message: "Email tidak ditemukan." },
      { status: 404 }
    );
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/newpassword?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail", // Atau pakai SMTP provider lain
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"INDA BPS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password INDA",
      html: resetEmailTemplate(resetLink, user.name || "Pengguna"),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Gagal mengirim email." }, { status: 500 });
  }

  return NextResponse.json({ message: "Email terkirim." });
}
