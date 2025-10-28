import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { galleryCreateSchema } from "@/lib/schemas"
import { z } from "zod"
import { revalidateTag, revalidatePath } from 'next/cache'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('갤러리 항목 수정 요청 시작')
    
    const session = await getServerSession(authOptions)
    console.log('세션 정보:', { 
      user: session?.user?.email, 
      role: session?.user?.role,
      hasSession: !!session 
    })
    
    if (!session || session.user.role !== "admin") {
      console.log('관리자 권한 없음')
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('요청 데이터:', body)
    
    const validatedData = await galleryCreateSchema.parseAsync(body)
    console.log('검증된 데이터:', validatedData)

    const galleryData = {
      title: validatedData.title,
      caption: validatedData.caption,
      imageUrl: validatedData.imageUrl,
      attachments: validatedData.attachments || [],
    }

    console.log('데이터베이스 수정 시작:', galleryData)

    const galleryItem = await prisma.galleryItem.update({
      where: { id: params.id },
      data: galleryData,
    })

    console.log('갤러리 항목 수정 완료:', galleryItem.id)
    
    // 캐시 무효화
    revalidateTag('gallery')
    revalidatePath('/')
    revalidatePath('/gallery')

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("갤러리 항목 수정 오류:", error)
    
    if (error instanceof z.ZodError) {
      console.error("검증 오류:", error.issues)
      const errorMessages = error.issues.map(issue => issue.message).join(", ")
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: errorMessages },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "갤러리 항목 수정에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('갤러리 항목 삭제 요청 시작')
    
    const session = await getServerSession(authOptions)
    console.log('세션 정보:', { 
      user: session?.user?.email, 
      role: session?.user?.role,
      hasSession: !!session 
    })
    
    if (!session || session.user.role !== "admin") {
      console.log('관리자 권한 없음')
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    await prisma.galleryItem.delete({
      where: { id: params.id },
    })

    console.log('갤러리 항목 삭제 완료:', params.id)
    
    // 캐시 무효화
    revalidateTag('gallery')
    revalidatePath('/')
    revalidatePath('/gallery')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("갤러리 항목 삭제 오류:", error)
    return NextResponse.json(
      { 
        error: "갤러리 항목 삭제에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}