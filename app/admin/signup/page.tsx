"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminSignup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, inviteToken: token })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        alert(data.error || "회원가입에 실패했습니다")
        return
      }
      
      alert("관리자 계정 생성 완료. 로그인 해주세요.")
      router.push("/auth/signin")
    } catch (error) {
      console.error("Signup error:", error)
      alert("회원가입 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            관리자 회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            초대 토큰이 필요합니다
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                초대 토큰 *
              </label>
              <input
                id="token"
                name="token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="초대 토큰을 입력하세요"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="이름을 입력하세요"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="이메일을 입력하세요"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "생성 중..." : "관리자 계정 생성"}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/auth/signin"
              className="text-sm text-green-600 hover:text-green-500"
            >
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
