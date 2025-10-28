import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log('=== 마이그레이션 실행 요청 ===')
    
    // 관리자 권한 확인 (간단한 토큰 체크)
    const authHeader = request.headers.get('authorization')
    const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}` || 
                   process.env.NODE_ENV === 'development'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      )
    }

    // 마이그레이션 상태 확인
    const migrationStatus = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations 
      ORDER BY finished_at DESC 
      LIMIT 5
    `
    
    console.log('현재 마이그레이션 상태:', migrationStatus)

    // 데이터베이스 연결 테스트
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ 데이터베이스 연결 성공')

    // GalleryItem 테이블 스키마 확인
    const galleryColumns = await prisma.$queryRaw<Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }>>`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryItem' 
      ORDER BY ordinal_position
    `
    
    console.log('GalleryItem 테이블 컬럼들:', galleryColumns)

    const attachmentsColumn = galleryColumns.find((col) => col.column_name === 'attachments')
    
    return NextResponse.json({
      success: true,
      message: "마이그레이션 상태 확인 완료",
      migrationStatus: migrationStatus,
      galleryColumns: galleryColumns,
      attachmentsColumnExists: !!attachmentsColumn,
      attachmentsColumn: attachmentsColumn,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('마이그레이션 확인 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    console.log('=== 마이그레이션 상태 조회 ===')
    
    // 데이터베이스 연결 테스트
    await prisma.$queryRaw`SELECT 1`
    
    // GalleryItem 테이블 스키마 확인
    const galleryColumns = await prisma.$queryRaw<Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }>>`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryItem' 
      ORDER BY ordinal_position
    `
    
    const attachmentsColumn = galleryColumns.find((col) => col.column_name === 'attachments')
    
    return NextResponse.json({
      success: true,
      galleryColumns: galleryColumns,
      attachmentsColumnExists: !!attachmentsColumn,
      attachmentsColumn: attachmentsColumn,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('마이그레이션 상태 조회 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}
