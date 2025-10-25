import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createNoticeSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().min(1, "내용은 필수입니다"),
  category: z.enum(["notice", "press"]).default("notice"),
  published: z.boolean().default(true),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
    type: z.string()
  })).optional().nullable(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string(),
    description: z.string().optional()
  })).optional().nullable(),
})

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

    const whereWithPublished = { published: true, ...where }
    console.log('공지사항 조회 조건:', whereWithPublished)

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where: whereWithPublished,
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notice.count({ where: whereWithPublished }),
    ])

    console.log('조회된 공지사항 수:', notices.length)
    console.log('총 공지사항 수:', total)
    console.log('공지사항 카테고리 분포:', notices.map(n => n.category))

    return NextResponse.json({
      notices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notices:", error)
    return NextResponse.json(
      { error: "공지사항을 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('공지사항 생성 요청 시작')
    
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
    
    const validatedData = createNoticeSchema.parse(body)
    console.log('검증된 데이터:', validatedData)

    const noticeData: any = {
      title: validatedData.title,
      content: validatedData.content,
      category: validatedData.category,
      published: validatedData.published,
      authorId: session.user.id,
    }

    // attachments와 links가 있는 경우에만 추가
    if (validatedData.attachments && validatedData.attachments.length > 0) {
      noticeData.attachments = validatedData.attachments
      console.log('첨부파일 추가:', validatedData.attachments.length, '개')
    }
    if (validatedData.links && validatedData.links.length > 0) {
      noticeData.links = validatedData.links
      console.log('링크 추가:', validatedData.links.length, '개')
    }

    console.log('데이터베이스 저장 시작:', noticeData)

    const notice = await prisma.notice.create({
      data: noticeData,
      include: { author: { select: { name: true, email: true } } },
    })

    console.log('공지사항 생성 완료:', notice.id)
    return NextResponse.json(notice, { status: 201 })
  } catch (error) {
    console.error("공지사항 생성 오류:", error)
    
    if (error instanceof z.ZodError) {
      console.error("검증 오류:", error.issues)
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "공지사항 생성에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
