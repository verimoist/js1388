import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updatePressSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().min(1, "내용은 필수입니다"),
  sourceUrl: z.string().url().optional().or(z.literal("")),
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('보도자료 조회 요청:', params.id)
    
    const press = await prisma.notice.findUnique({
      where: { 
        id: params.id,
        category: 'press' // 보도자료만 조회
      },
      include: { author: { select: { name: true, email: true } } }
    })

    if (!press) {
      console.log('보도자료를 찾을 수 없음:', params.id)
      return NextResponse.json(
        { error: "보도자료를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    console.log('보도자료 조회 성공:', press.id)
    return NextResponse.json(press)
  } catch (error) {
    console.error("Error fetching press:", error)
    return NextResponse.json(
      { error: "보도자료를 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('보도자료 수정 요청:', params.id)
    
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
    
    const validatedData = updatePressSchema.parse(body)
    console.log('검증된 데이터:', validatedData)

    // 보도자료 데이터 구성
    const noticeData: any = {
      title: validatedData.title,
      content: validatedData.content,
      category: 'press', // 보도자료는 press 카테고리
      published: validatedData.published,
    }

    // sourceUrl이 있는 경우 links 필드에 추가
    if (validatedData.sourceUrl) {
      noticeData.links = [{
        title: '원문 보기',
        url: validatedData.sourceUrl,
        description: '언론사 원문 링크'
      }]
    }

    // attachments와 links가 있는 경우에만 추가
    if (validatedData.attachments) {
      noticeData.attachments = validatedData.attachments
    }
    if (validatedData.links) {
      noticeData.links = validatedData.links
    }

    console.log('데이터베이스 업데이트 시작:', noticeData)
    
    const press = await prisma.notice.update({
      where: { 
        id: params.id,
        category: 'press' // 보도자료만 수정
      },
      data: noticeData,
      include: { author: { select: { name: true, email: true } } },
    })
    
    console.log('보도자료 수정 완료:', press.id)

    return NextResponse.json(press)
  } catch (error) {
    console.error("보도자료 수정 오류:", error)
    
    if (error instanceof z.ZodError) {
      console.error("검증 오류:", error.issues)
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "보도자료 수정에 실패했습니다",
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined
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
    console.log('보도자료 삭제 요청:', params.id)
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    await prisma.notice.delete({
      where: { 
        id: params.id,
        category: 'press' // 보도자료만 삭제
      }
    })

    console.log('보도자료 삭제 완료:', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting press:", error)
    return NextResponse.json(
      { error: "보도자료 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}