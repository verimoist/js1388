import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('파일 업로드 요청 시작')
    
    const data = await request.formData()
    console.log('FormData 파싱 완료')
    
    const file: File | null = data.get('file') as unknown as File
    console.log('파일 정보:', { name: file?.name, size: file?.size, type: file?.type })

    if (!file) {
      console.log('파일이 없음')
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
    const fileName = `${timestamp}-${file.name}`
    const filePath = join(uploadDir, fileName)
    console.log('파일 경로:', filePath)

    // 파일 저장
    await writeFile(filePath, buffer)
    console.log('파일 저장 완료')

    // 파일 URL 반환
    const fileUrl = `/uploads/${fileName}`
    console.log('파일 URL:', fileUrl)

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('파일 업로드 오류:', error)
    return NextResponse.json(
      { error: '파일 업로드에 실패했습니다.', details: error.message },
      { status: 500 }
    )
  }
}