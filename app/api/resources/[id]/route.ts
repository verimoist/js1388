import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateResourceSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").optional(),
  fileUrl: z.string().url("올바른 파일 URL이 필요합니다").optional(),
  filetype: z.string().optional(),
  filesize: z.number().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return NextResponse.json(
        { error: "자료를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { error: "자료를 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateResourceSchema.parse(body)

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(resource)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error updating resource:", error)
    return NextResponse.json(
      { error: "자료 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    await prisma.resource.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "자료가 삭제되었습니다" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json(
      { error: "자료 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
