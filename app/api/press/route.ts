import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPressSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().min(1, "내용은 필수입니다"),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(true),
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
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createPressSchema.parse(body)

    // 보도자료를 Notice 모델의 press 카테고리로 저장
    const noticeData: any = {
      title: validatedData.title,
      content: validatedData.content,
      category: 'press', // 보도자료는 press 카테고리
      published: validatedData.published,
      authorId: session.user.id,
    }

    // sourceUrl이 있는 경우 links 필드에 추가
    if (validatedData.sourceUrl) {
      noticeData.links = [{
        title: '원문 보기',
        url: validatedData.sourceUrl,
        description: '언론사 원문 링크'
      }]
    }

    const press = await prisma.notice.create({
      data: noticeData,
      include: { author: { select: { name: true, email: true } } },
    })

    return NextResponse.json(press, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error creating press:", error)
    return NextResponse.json(
      { error: "보도자료 생성에 실패했습니다" },
      { status: 500 }
    )
  }
}
