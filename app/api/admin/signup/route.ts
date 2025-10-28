import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name, inviteToken } = await req.json()
    
    if (inviteToken !== process.env.ADMIN_SIGNUP_TOKEN) {
      return NextResponse.json({ error: "Invalid invite token" }, { status: 403 })
    }
    
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    
    const exist = await prisma.user.findUnique({ where: { email } })
    if (exist?.passwordHash) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "ADMIN", name },
      create: { email, name, passwordHash, role: "ADMIN" }
    })
    
    return NextResponse.json({ ok: true, id: user.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
