"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    // 통합 로그인 페이지로 리다이렉트
    router.push("/auth/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">로그인 페이지로 이동 중...</p>
      </div>
    </div>
  )
}
