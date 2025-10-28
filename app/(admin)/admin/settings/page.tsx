"use client"

import { useState, useEffect } from "react"

export default function AdminSettingsPage() {
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 현재 관리자 이메일 목록 가져오기 (실제로는 API에서 가져와야 함)
    setAdminEmails(["verimoist@naver.com"])
  }, [])

  const handleAddEmail = async () => {
    if (!newEmail || adminEmails.includes(newEmail)) return

    setLoading(true)
    try {
      // 실제로는 API를 통해 환경 변수 업데이트
      console.log("새 관리자 이메일 추가:", newEmail)
      setAdminEmails([...adminEmails, newEmail])
      setNewEmail("")
    } catch (error) {
      console.error("Error adding admin email:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveEmail = (email: string) => {
    setAdminEmails(adminEmails.filter(e => e !== email))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">관리자 설정</h1>
        <p className="text-gray-600">관리자 권한을 가진 사용자들을 관리합니다.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">관리자 이메일 목록</h2>
        
        <div className="space-y-3">
          {adminEmails.map((email, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-900">{email}</span>
              <button
                onClick={() => handleRemoveEmail(email)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                제거
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900 mb-2">새 관리자 추가</h3>
          <div className="flex space-x-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="관리자 이메일을 입력하세요"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddEmail}
              disabled={loading || !newEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "추가 중..." : "추가"}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>주의:</strong> 관리자 이메일 변경은 환경 변수 수정이 필요합니다. 
            실제 운영 환경에서는 Vercel 대시보드에서 ADMIN_EMAILS 환경 변수를 수정해야 합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
