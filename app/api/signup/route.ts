import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "INVALID" }, { status: 400 });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "EXISTS" }, { status: 409 });
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, name: name ?? "", passwordHash: hash, role: "USER", approved: false },
    } as any);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
