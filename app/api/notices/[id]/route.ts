import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateNoticeSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").optional(),
  content: z.string().min(1, "내용은 필수입니다").optional(),
  category: z.enum(["notice", "press"]).optional(),
  published: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: params.id },
      include: { author: { select: { name: true, email: true } } },
    })

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(notice)
  } catch (error) {
    console.error("Error fetching notice:", error)
    return NextResponse.json(
      { error: "공지사항을 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateNoticeSchema.parse(body)

    const notice = await prisma.notice.update({
      where: { id: params.id },
      data: validatedData,
      include: { author: { select: { name: true, email: true } } },
    })

    return NextResponse.json(notice)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error updating notice:", error)
    return NextResponse.json(
      { error: "공지사항 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    await prisma.notice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "공지사항이 삭제되었습니다" })
  } catch (error) {
    console.error("Error deleting notice:", error)
    return NextResponse.json(
      { error: "공지사항 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
