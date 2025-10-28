import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 관리자 권한 확인
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // 쿠키 설정
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24시간
    })

    return response

  } catch (error) {
    console.error('Simple auth error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
