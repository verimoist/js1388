import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "이메일/비밀번호 필수" }, { status: 400 });
    }

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return NextResponse.json({ error: "이미 가입된 이메일" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { 
        email, 
        name, 
        passwordHash: hash, 
        role: "USER", 
        approved: false 
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: e.message ?? "signup 실패" }, { status: 500 });
  }
}
