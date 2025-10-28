import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { noticeCreateSchema } from "@/lib/schemas"
import { z } from "zod"
import { revalidateTag, revalidatePath } from 'next/cache'

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
    
    const validatedData = await noticeCreateSchema.parseAsync(body)
    console.log('검증된 데이터:', validatedData)

    const noticeData = {
      title: validatedData.title,
      content: validatedData.content,
      category: validatedData.category,
      published: validatedData.published,
      authorId: session.user.id,
      attachments: validatedData.attachments,
      links: validatedData.links
    }

    console.log('데이터베이스 저장 시작:', noticeData)

    const notice = await prisma.notice.create({
      data: noticeData,
      include: { author: { select: { name: true, email: true } } },
    })

    console.log('공지사항 생성 완료:', notice.id)
    
    // 캐시 무효화
    revalidateTag('notices')
    revalidatePath('/')
    revalidatePath('/news')
    
    return NextResponse.json(notice, { status: 201 })
  } catch (error) {
    console.error("공지사항 생성 오류:", error)
    
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
        error: "공지사항 생성에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}
