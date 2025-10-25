import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/simple-login', 'http://localhost:3000'))
  
  // 쿠키 삭제
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0 // 즉시 만료
  })

  return response
}
