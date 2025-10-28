import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"

export async function GET() {
  await requireAdmin()
  const users = await prisma.user.findMany({
    where: { status: "PENDING" },
    select: { 
      id: true, 
      email: true, 
      name: true, 
      role: true, 
      status: true, 
      adminApproved: true, 
      createdAt: true 
    }
  })
  return NextResponse.json({ users })
}
