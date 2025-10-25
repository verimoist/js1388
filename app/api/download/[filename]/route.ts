import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, params.filename)
    
    // 파일 존재 확인
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    // 파일 읽기
    const fileBuffer = await readFile(filePath)
    
    // 파일명에서 원본 이름 추출 (Base64 디코딩)
    const base64Name = params.filename.split('-').slice(1).join('-')
    let originalName = 'download'
    
    try {
      originalName = Buffer.from(base64Name, 'base64').toString('utf8')
    } catch (error) {
      console.log('파일명 디코딩 실패, 기본 이름 사용')
    }
    
    // Content-Disposition 헤더로 한글 파일명 지원
    const encodedFileName = encodeURIComponent(originalName)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
    
  } catch (error) {
    console.error('파일 다운로드 오류:', error)
    return NextResponse.json(
      { error: '파일 다운로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}
