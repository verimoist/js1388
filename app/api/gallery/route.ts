import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { galleryCreateSchema } from "@/lib/schemas"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const [galleryItems, total] = await Promise.all([
      prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.galleryItem.count(),
    ])

    return NextResponse.json({
      galleryItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json(
      { error: "갤러리를 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('갤러리 항목 생성 요청 시작')
    
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
      attachments: validatedData.attachments
    }

    console.log('데이터베이스 저장 시작:', galleryData)

    const galleryItem = await prisma.galleryItem.create({
      data: galleryData,
    })

    console.log('갤러리 항목 생성 완료:', galleryItem.id)
    return NextResponse.json(galleryItem, { status: 201 })
  } catch (error) {
    console.error("갤러리 항목 생성 오류:", error)
    
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
        error: "갤러리 항목 생성에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}