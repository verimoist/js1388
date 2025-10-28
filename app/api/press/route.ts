import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pressCreateSchema } from "@/lib/schemas"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    // 보도자료는 Notice 모델의 press 카테고리에서 조회
    const whereWithCategory = {
      ...where,
      category: 'press' // 보도자료만 조회
    }

    const [press, total] = await Promise.all([
      prisma.notice.findMany({
        where: whereWithCategory,
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notice.count({ where: whereWithCategory }),
    ])

    return NextResponse.json({
      press,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching press:", error)
    return NextResponse.json(
      { error: "보도자료를 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('보도자료 생성 요청 시작')
    
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
    
    const validatedData = await pressCreateSchema.parseAsync(body)
    console.log('검증된 데이터:', validatedData)

    // 보도자료를 Notice 모델의 press 카테고리로 저장
    const noticeData = {
      title: validatedData.title,
      content: validatedData.content,
      category: 'press' as const,
      published: validatedData.published,
      authorId: session.user.id,
      attachments: validatedData.attachments,
      links: validatedData.links
    }

    // sourceUrl이 있는 경우 links 필드에 추가
    if (validatedData.sourceUrl) {
      noticeData.links = [...noticeData.links, {
        title: '원문 보기',
        url: validatedData.sourceUrl,
        description: '언론사 원문 링크'
      }]
    }

    console.log('데이터베이스 저장 시작:', noticeData)
    
    const press = await prisma.notice.create({
      data: noticeData,
      include: { author: { select: { name: true, email: true } } },
    })
    
    console.log('보도자료 생성 완료:', press.id)

    return NextResponse.json(press, { status: 201 })
  } catch (error) {
    console.error("보도자료 생성 오류:", error)
    
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
        error: "보도자료 생성에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}
