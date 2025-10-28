import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();
export async function GET() {
  const users = await prisma.user.findMany({ where: { approved: false } as any, select: { id: true, email: true, name: true, role: true } });
  return NextResponse.json({ users });
}