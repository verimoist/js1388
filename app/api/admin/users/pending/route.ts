import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET() {
  const users = await prisma.user.findMany({ where: { approved: false } as any, select: { id: true, email: true, name: true, role: true } });
  return NextResponse.json({ users });
}