import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createGallerySchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  imageUrl: z.string().url("올바른 이미지 URL이 필요합니다"),
  caption: z.string().optional(),
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
            { caption: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [gallery, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.galleryItem.count({ where }),
    ])

    return NextResponse.json({
      gallery,
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
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createGallerySchema.parse(body)

    const galleryItem = await prisma.galleryItem.create({
      data: validatedData,
    })

    return NextResponse.json(galleryItem, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error creating gallery item:", error)
    return NextResponse.json(
      { error: "갤러리 항목 생성에 실패했습니다" },
      { status: 500 }
    )
  }
}
