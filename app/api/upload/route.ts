import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== 파일 업로드 요청 시작 ===')
    console.log('요청 시간:', new Date().toISOString())
    console.log('요청 헤더:', Object.fromEntries(request.headers.entries()))
    
    // Vercel 제한사항 확인
    const contentLength = request.headers.get('content-length')
    console.log('Content-Length:', contentLength)
    
    if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) { // 4.5MB 제한
      console.log('파일 크기 초과:', contentLength)
      return NextResponse.json({ 
        error: '파일 크기가 너무 큽니다. Vercel 무료 플랜은 4.5MB까지 지원합니다.',
        maxSize: '4.5MB'
      }, { status: 413 })
    }
    
    console.log('FormData 파싱 시작')
    const data = await request.formData()
    console.log('FormData 파싱 완료')
    console.log('FormData 키들:', Array.from(data.keys()))
    
    const file: File | null = data.get('file') as unknown as File
    console.log('파일 정보:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type,
      contentLength: contentLength,
      lastModified: file?.lastModified
    })

    if (!file) {
      console.log('파일이 없음 - FormData 내용:', Array.from(data.entries()))
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    // 파일 크기 제한 (4MB로 안전하게 설정)
    const maxSize = 4 * 1024 * 1024 // 4MB
    if (file.size > maxSize) {
      console.log('파일 크기 초과:', file.size, 'bytes')
      return NextResponse.json({ 
        error: `파일 크기가 너무 큽니다. 최대 ${maxSize / 1024 / 1024}MB까지 지원합니다.`,
        maxSize: `${maxSize / 1024 / 1024}MB`
      }, { status: 413 })
    }

    console.log('파일 버퍼 생성 시작')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('파일 버퍼 생성 완료, 크기:', buffer.length)

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    console.log('업로드 디렉토리:', uploadDir)
    console.log('현재 작업 디렉토리:', process.cwd())
    
    if (!existsSync(uploadDir)) {
      console.log('업로드 디렉토리 생성 시도')
      try {
        mkdirSync(uploadDir, { recursive: true })
        console.log('업로드 디렉토리 생성 완료')
      } catch (mkdirError) {
        console.error('디렉토리 생성 오류:', mkdirError)
        throw new Error(`디렉토리 생성 실패: ${mkdirError instanceof Error ? mkdirError.message : '알 수 없는 오류'}`)
      }
    } else {
      console.log('업로드 디렉토리 이미 존재')
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
      console.log('파일 저장 시작:', filePath)
      await writeFile(filePath, buffer)
      console.log('파일 저장 완료')
      
      // 파일이 실제로 저장되었는지 확인
      if (!existsSync(filePath)) {
        console.error('파일 저장 후 존재하지 않음:', filePath)
        throw new Error('파일 저장 후 존재하지 않음')
      }
      
      // 파일 크기 확인
      const stats = await import('fs').then(fs => fs.promises.stat(filePath))
      console.log('저장된 파일 크기:', stats.size, 'bytes')
      console.log('원본 파일 크기:', file.size, 'bytes')
      
      if (stats.size !== file.size) {
        console.warn('파일 크기 불일치:', stats.size, 'vs', file.size)
      }
      
      console.log('파일 저장 검증 완료')
    } catch (writeError) {
      console.error('파일 저장 오류:', writeError)
      console.error('파일 경로:', filePath)
      console.error('디렉토리 존재 여부:', existsSync(uploadDir))
      console.error('디렉토리 권한:', await import('fs').then(fs => fs.promises.access(uploadDir, fs.constants.W_OK).then(() => '쓰기 가능').catch(() => '쓰기 불가')))
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