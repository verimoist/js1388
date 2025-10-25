import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('파일 업로드 요청 시작')
    
    // Vercel 제한사항 확인
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) { // 4.5MB 제한
      return NextResponse.json({ 
        error: '파일 크기가 너무 큽니다. Vercel 무료 플랜은 4.5MB까지 지원합니다.',
        maxSize: '4.5MB'
      }, { status: 413 })
    }
    
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    
    console.log('파일 정보:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type,
      contentLength: contentLength
    })

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    // 파일 크기 제한 (4MB로 안전하게 설정)
    const maxSize = 4 * 1024 * 1024 // 4MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `파일 크기가 너무 큽니다. 최대 ${maxSize / 1024 / 1024}MB까지 지원합니다.`,
        maxSize: `${maxSize / 1024 / 1024}MB`
      }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('파일 버퍼 생성 완료, 크기:', buffer.length)

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    console.log('업로드 디렉토리:', uploadDir)
    
    if (!existsSync(uploadDir)) {
      console.log('업로드 디렉토리 생성')
      mkdirSync(uploadDir, { recursive: true })
    }

    // 파일명 생성 (타임스탬프 + 간단한 파일명)
    const timestamp = Date.now()
    // 파일 확장자 추출
    const fileExtension = file.name.split('.').pop() || 'bin'
    // 간단한 파일명 생성 (한글 문제 방지)
    const fileName = `${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    console.log('파일 경로:', filePath)
    console.log('원본 파일명:', file.name)
    console.log('생성된 파일명:', fileName)

    // 파일 저장
    try {
      await writeFile(filePath, buffer)
      console.log('파일 저장 완료')
      
      // 파일이 실제로 저장되었는지 확인
      if (!existsSync(filePath)) {
        throw new Error('파일 저장 후 존재하지 않음')
      }
      
      console.log('파일 저장 검증 완료')
    } catch (writeError) {
      console.error('파일 저장 오류:', writeError)
      throw new Error(`파일 저장 실패: ${writeError instanceof Error ? writeError.message : '알 수 없는 오류'}`)
    }

    // 파일 URL 반환
    const fileUrl = `/uploads/${fileName}`
    console.log('파일 URL:', fileUrl)

    const response = {
      success: true,
      url: fileUrl,
      name: file.name, // 원본 파일명 유지
      size: file.size,
      type: file.type,
      originalName: file.name // 한글 파일명을 위한 원본 이름
    }
    
    console.log('응답 데이터:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('파일 업로드 오류:', error)
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