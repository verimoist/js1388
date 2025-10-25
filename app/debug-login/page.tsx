"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"

export default function DebugLoginPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log("🔍 로그인 테스트 시작...")
      
      // 1. 현재 세션 확인
      const session = await getSession()
      console.log("현재 세션:", session)
      
      // 2. 로그인 시도
      const loginResult = await signIn("credentials", {
        email: "doori1388@naver.com",
        password: "admin123!",
        redirect: false,
      })
      
      console.log("로그인 결과:", loginResult)
      
      // 3. 로그인 후 세션 확인
      const newSession = await getSession()
      console.log("로그인 후 세션:", newSession)
      
      setResult({
        loginResult,
        beforeSession: session,
        afterSession: newSession,
        success: loginResult?.ok
      })
      
    } catch (error) {
      console.error("로그인 테스트 오류:", error)
      setResult({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">로그인 디버깅</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">테스트 정보</h2>
          <div className="space-y-2 text-sm">
            <p><strong>이메일:</strong> doori1388@naver.com</p>
            <p><strong>비밀번호:</strong> admin123!</p>
            <p><strong>예상 권한:</strong> admin</p>
          </div>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "테스트 중..." : "로그인 테스트"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">테스트 결과</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>브라우저 개발자 도구 콘솔에서도 로그를 확인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}
