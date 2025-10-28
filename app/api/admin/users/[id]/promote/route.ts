import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(_: Request, { params }: { params: { id: string } }) {
  await prisma.user.update({ where: { id: params.id }, data: { role: "ADMIN", approved: true } as any });
  return NextResponse.json({ ok: true });
}
