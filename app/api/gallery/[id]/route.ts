import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateGallerySchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").optional(),
  imageUrl: z.string().url("올바른 이미지 URL이 필요합니다").optional(),
  caption: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: params.id },
    })

    if (!galleryItem) {
      return NextResponse.json(
        { error: "갤러리 항목을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error fetching gallery item:", error)
    return NextResponse.json(
      { error: "갤러리 항목을 가져오는데 실패했습니다" },
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
    const validatedData = updateGallerySchema.parse(body)

    const galleryItem = await prisma.galleryItem.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(galleryItem)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error updating gallery item:", error)
    return NextResponse.json(
      { error: "갤러리 항목 수정에 실패했습니다" },
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

    await prisma.galleryItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "갤러리 항목이 삭제되었습니다" })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return NextResponse.json(
      { error: "갤러리 항목 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
