import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

// 허용되는 폴더 타입
const ALLOWED_FOLDERS = ['notice', 'press', 'gallery', 'resources'] as const
type FolderType = typeof ALLOWED_FOLDERS[number]

// 허용되는 파일 타입
const ALLOWED_FILE_TYPES = [
  // 이미지
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // 문서
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  // 압축 파일
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed'
]

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    console.log('=== Vercel Blob 업로드 요청 시작 ===')
    console.log('요청 시간:', new Date().toISOString())
    console.log('요청 헤더:', Object.fromEntries(request.headers.entries()))

    // BLOB_READ_WRITE_TOKEN 확인
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Missing BLOB_READ_WRITE_TOKEN')
      return NextResponse.json(
        { error: 'Missing BLOB_READ_WRITE_TOKEN' },
        { status: 401 }
      )
    }

    // Content-Length 확인
    const contentLength = request.headers.get('content-length')
    console.log('Content-Length:', contentLength)
    
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      console.error('파일 크기 초과:', contentLength)
      return NextResponse.json(
        { 
          error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 지원합니다.`,
          maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`
        },
        { status: 413 }
      )
    }

    // FormData 파싱
    console.log('FormData 파싱 시작')
    const formData = await request.formData()
    console.log('FormData 파싱 완료')
    console.log('FormData 키들:', Array.from(formData.keys()))

    // 파일과 폴더 추출
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string

    // 상세 로그 정보 수집
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    console.log('업로드 요청 정보:', {
      folder: folder,
      filename: file?.name,
      size: file?.size,
      contentType: file?.type,
      clientIP: clientIP,
      userAgent: userAgent.substring(0, 100) // 개인정보 보호를 위해 100자로 제한
    })

    // 파일 존재 확인
    if (!file) {
      console.error('파일이 없음')
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      )
    }

    // 폴더 유효성 확인
    if (!folder || !ALLOWED_FOLDERS.includes(folder as FolderType)) {
      console.error('지원하지 않는 폴더:', folder)
      return NextResponse.json(
        { 
          error: `지원하지 않는 폴더입니다. 허용되는 폴더: ${ALLOWED_FOLDERS.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // 파일 크기 확인
    if (file.size > MAX_FILE_SIZE) {
      console.error('파일 크기 초과:', file.size, 'bytes')
      return NextResponse.json(
        { 
          error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 지원합니다.`,
          maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`
        },
        { status: 413 }
      )
    }

    // 파일 타입 확인
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.error('지원하지 않는 파일 타입:', file.type)
      return NextResponse.json(
        { 
          error: `지원하지 않는 파일 형식입니다: ${file.type}`,
          allowedTypes: ALLOWED_FILE_TYPES
        },
        { status: 400 }
      )
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'bin'
    const fileName = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    console.log('업로드할 파일명:', fileName)
    console.log('Vercel Blob 업로드 시작')

    // Vercel Blob에 파일 업로드
    const blob = await put(fileName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log('Vercel Blob 업로드 완료:', {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType
    })

    // 성공 응답
    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: file.size, // 원본 파일 크기 사용
      originalName: file.name
    })

  } catch (error) {
    console.error('Vercel Blob 업로드 오류:', error)
    console.error('오류 스택:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: '파일 업로드에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}