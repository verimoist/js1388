import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('파일 업로드 요청 시작')
    console.log('요청 헤더:', Object.fromEntries(request.headers.entries()))
    
    const data = await request.formData()
    console.log('FormData 파싱 완료')
    console.log('FormData 키들:', Array.from(data.keys()))
    
    const file: File | null = data.get('file') as unknown as File
    console.log('파일 정보:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type,
      lastModified: file?.lastModified 
    })

    if (!file) {
      console.log('파일이 없음 - FormData 내용:', Array.from(data.entries()))
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
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

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    // 한글 파일명을 URL 인코딩으로 처리
    const encodedFileName = encodeURIComponent(file.name)
    const fileName = `${timestamp}-${encodedFileName}`
    const filePath = join(uploadDir, fileName)
    console.log('파일 경로:', filePath)
    console.log('원본 파일명:', file.name)
    console.log('인코딩된 파일명:', fileName)

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