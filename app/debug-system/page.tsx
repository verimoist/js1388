"use client"

import { useState } from "react"

export default function DebugSystemPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testFileUpload = async () => {
    setLoading(true)
    try {
      console.log('파일 업로드 테스트 시작')
      
      // 실제 파일 생성 (영문 파일명으로 테스트)
      const file = new File(["test file content"], "testfile.txt", { type: "text/plain" })
      console.log('생성된 파일:', { name: file.name, size: file.size, type: file.type })
      
      const formData = new FormData()
      formData.append('file', file)
      console.log('FormData 생성 완료')

      console.log('API 호출 시작')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('응답 상태:', response.status)
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('응답 오류:', errorText)
        setResults((prev: any) => ({ ...prev, fileUpload: { error: `HTTP ${response.status}: ${errorText}` } }))
        return
      }
      
      const result = await response.json()
      console.log('응답 결과:', result)
      
      setResults((prev: any) => ({ ...prev, fileUpload: result }))
    } catch (error) {
      console.error('파일 업로드 테스트 오류:', error)
      setResults((prev: any) => ({ ...prev, fileUpload: { error: error instanceof Error ? error.message : '알 수 없는 오류' } }))
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
      setResults((prev: any) => ({ ...prev, pressAPI: result }))
    } catch (error) {
      setResults((prev: any) => ({ ...prev, pressAPI: { error: error instanceof Error ? error.message : '알 수 없는 오류' } }))
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
      setResults((prev: any) => ({ ...prev, noticesAPI: result }))
    } catch (error) {
      setResults((prev: any) => ({ ...prev, noticesAPI: { error: error instanceof Error ? error.message : '알 수 없는 오류' } }))
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
      setResults((prev: any) => ({ ...prev, auth: result }))
    } catch (error) {
      setResults((prev: any) => ({ ...prev, auth: { error: error instanceof Error ? error.message : '알 수 없는 오류' } }))
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setLoading(true)
    try {
      console.log('데이터베이스 조회 시작')
      
      // 공지사항 조회
      const noticesResponse = await fetch('/api/notices', {
        method: 'GET',
      })
      const noticesData = await noticesResponse.json()
      console.log('공지사항 데이터:', noticesData)

      // 보도자료 조회
      const pressResponse = await fetch('/api/press', {
        method: 'GET',
      })
      const pressData = await pressResponse.json()
      console.log('보도자료 데이터:', pressData)

      // 첨부파일과 링크 정보 확인
      const noticesWithAttachments = noticesData.notices?.filter(n => n.attachments && n.attachments.length > 0) || []
      const noticesWithLinks = noticesData.notices?.filter(n => n.links && n.links.length > 0) || []
      const pressWithAttachments = pressData.press?.filter(p => p.attachments && p.attachments.length > 0) || []
      const pressWithLinks = pressData.press?.filter(p => p.links && p.links.length > 0) || []

      console.log('첨부파일이 있는 공지사항:', noticesWithAttachments.length)
      console.log('링크가 있는 공지사항:', noticesWithLinks.length)
      console.log('첨부파일이 있는 보도자료:', pressWithAttachments.length)
      console.log('링크가 있는 보도자료:', pressWithLinks.length)

      setResults((prev: any) => ({ 
        ...prev, 
        database: {
          notices: noticesData,
          press: pressData,
          noticesCount: noticesData.notices?.length || 0,
          pressCount: pressData.press?.length || 0,
          attachmentsInfo: {
            noticesWithAttachments: noticesWithAttachments.length,
            noticesWithLinks: noticesWithLinks.length,
            pressWithAttachments: pressWithAttachments.length,
            pressWithLinks: pressWithLinks.length
          }
        }
      }))
    } catch (error) {
      console.error('데이터베이스 조회 오류:', error)
      setResults((prev: any) => ({ ...prev, database: { error: error instanceof Error ? error.message : '알 수 없는 오류' } }))
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

        <button
          onClick={testDatabase}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          데이터베이스 조회 테스트
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
