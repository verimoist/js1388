import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/authz"

export async function POST(req: Request, { params }: { params: { id: string }}) {
  await requireAdmin()
  const { approve, makeAdmin } = await req.json() as { approve: boolean, makeAdmin?: boolean }
  
  const data = approve
    ? { 
        status: "ACTIVE" as const, 
        adminApproved: true, 
        role: makeAdmin ? "ADMIN" as const : "USER" as const 
      }
    : { 
        status: "REJECTED" as const, 
        adminApproved: false 
      }
    
  const user = await prisma.user.update({ 
    where: { id: params.id }, 
    data 
  })
  
  return NextResponse.json({ ok: true, user })
}
