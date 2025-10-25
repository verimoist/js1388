import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface SimpleUser {
  id: string
  email: string
  name: string | null
  role: string
}

export function getSimpleUser(request: NextRequest): SimpleUser | null {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token, 
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as any

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function isAdmin(user: SimpleUser | null): boolean {
  return user?.role === 'admin'
}
