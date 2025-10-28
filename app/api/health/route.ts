import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invalidateTag = searchParams.get('invalidate')
    
    console.log('=== 헬스체크 시작 ===')
    
    // 관리자 권한 확인 (간단한 토큰 체크)
    const authHeader = request.headers.get('authorization')
    const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}` || 
                   process.env.NODE_ENV === 'development'
    
    // 캐시 무효화 요청 처리
    if (invalidateTag && isAdmin) {
      console.log(`캐시 무효화 요청: ${invalidateTag}`)
      revalidateTag(invalidateTag)
      console.log(`✅ ${invalidateTag} 태그 무효화 완료`)
    }
    
    // 1. 데이터베이스 연결 테스트
    let dbStatus = false
    try {
      await prisma.$queryRaw`SELECT 1`
      dbStatus = true
      console.log('✅ 데이터베이스 연결 성공')
    } catch (error) {
      console.error('❌ 데이터베이스 연결 실패:', error)
    }

    // 2. NextAuth 설정 확인
    const nextAuthStatus = !!(
      process.env.NEXTAUTH_URL &&
      process.env.NEXTAUTH_SECRET &&
      process.env.GITHUB_ID &&
      process.env.GITHUB_SECRET
    )
    console.log('NextAuth 설정 상태:', nextAuthStatus ? '✅ 완료' : '❌ 미완료')

    // 3. Vercel Blob 토큰 확인
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    const blobStatus = !!blobToken
    console.log('Vercel Blob 토큰 상태:', blobStatus ? '✅ 설정됨' : '❌ 미설정')
    console.log('Blob 토큰 길이:', blobToken?.length || 0)
    console.log('Blob 토큰 접두사:', blobToken?.substring(0, 10) || 'N/A')

    // 4. 관리자 이메일 설정 확인
    const adminStatus = !!(process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS)
    console.log('관리자 이메일 설정 상태:', adminStatus ? '✅ 설정됨' : '❌ 미설정')

    // 5. 환경 정보
    const envInfo = {
      nodeEnv: process.env.NODE_ENV || 'development',
      vercelEnv: process.env.VERCEL_ENV || 'local',
      nextPublicVercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || 'local'
    }
    console.log('환경 정보:', envInfo)

    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        nextAuth: nextAuthStatus,
        vercelBlob: blobStatus,
        adminConfig: adminStatus
      },
      environment: envInfo,
      blobTokenInfo: {
        exists: blobStatus,
        length: blobToken?.length || 0,
        prefix: blobToken?.substring(0, 10) || 'N/A'
      },
      cacheInvalidation: invalidateTag ? {
        tag: invalidateTag,
        success: true,
        message: `${invalidateTag} 태그가 무효화되었습니다`
      } : null
    }

    console.log('=== 헬스체크 완료 ===')
    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error('헬스체크 오류:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}