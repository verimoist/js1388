import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"

export async function GET() {
  await requireAdmin()
  const users = await prisma.user.findMany({
    where: { approved: false },
    select: { 
      id: true, 
      email: true, 
      name: true, 
      role: true, 
      approved: true, 
      createdAt: true 
    },
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json({ users })
}
