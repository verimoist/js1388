import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { action } = await req.json();
    const id = params.id;

    if (action === "approve") {
      await prisma.user.update({ 
        where: { id }, 
        data: { approved: true } 
      });
    } else if (action === "reject") {
      await prisma.user.delete({ where: { id } });
    } else if (action === "promote") {
      await prisma.user.update({ 
        where: { id }, 
        data: { role: "ADMIN", approved: true } 
      });
    } else {
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin user action error:", error);
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }
}
