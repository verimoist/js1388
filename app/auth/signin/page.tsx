"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Github } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("doori1388@naver.com")
  const [password, setPassword] = useState("admin123!")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    })
    
    if (res?.error) {
      alert("로그인 실패: " + res.error)
    } else {
      window.location.href = "/admin"
    }
    
    setLoading(false)
  }

  const showAdminSignup = !!process.env.NEXT_PUBLIC_ADMIN_SIGNUP_ENABLED || !!process.env.NEXT_PUBLIC_HAS_ADMIN_TOKEN

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            GitHub 또는 이메일로 로그인하세요
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {/* GitHub 로그인 */}
          <div>
            <button
              onClick={() => signIn("github", { callbackUrl: "/admin" })}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub로 로그인
            </button>
          </div>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">또는</span>
            </div>
          </div>

          {/* 이메일 로그인 */}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "로그인 중..." : "이메일로 로그인"}
              </button>
            </div>
          </form>

          {/* 관리자 회원가입 링크 - 조건부 노출 */}
          {showAdminSignup && (
            <div className="text-center">
              <a
                href="/admin/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                관리자 회원가입
              </a>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center">
            * 승인되지 않은 계정은 로그인할 수 없습니다. (관리자 승인 대기)
          </p>
        </div>
      </div>
    </div>
  )
}