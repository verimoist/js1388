"use client"

import { useState } from "react"

export default function DebugSystemPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testFileUpload = async () => {
    setLoading(true)
    try {
      const file = new File(["test content"], "test.txt", { type: "text/plain" })
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setResults(prev => ({ ...prev, fileUpload: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, fileUpload: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testPressAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/press', {
        method: 'GET',
      })

      const result = await response.json()
      setResults(prev => ({ ...prev, pressAPI: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, pressAPI: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testNoticesAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/notices', {
        method: 'GET',
      })

      const result = await response.json()
      setResults(prev => ({ ...prev, noticesAPI: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, noticesAPI: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
      })

      const result = await response.json()
      setResults(prev => ({ ...prev, auth: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, auth: { error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">시스템 디버깅</h1>
      
      <div className="space-y-4">
        <button
          onClick={testFileUpload}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          파일 업로드 테스트
        </button>

        <button
          onClick={testPressAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          보도자료 API 테스트
        </button>

        <button
          onClick={testNoticesAPI}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          공지사항 API 테스트
        </button>

        <button
          onClick={testAuth}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          인증 테스트
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">테스트 결과:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  )
}
