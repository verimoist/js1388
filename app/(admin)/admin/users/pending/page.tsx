"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string | null
  role: string
  approved: boolean
  createdAt: string
}

export default function PendingUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users/pending")
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAction = async (id: string, approve: boolean, makeAdmin: boolean = false) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve, makeAdmin })
      })
      
      if (!res.ok) {
        alert("작업에 실패했습니다")
        return
      }
      
      // 목록 새로고침
      fetchUsers()
    } catch (error) {
      console.error("Action failed:", error)
      alert("작업 중 오류가 발생했습니다")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">승인 대기 사용자</h1>
      
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">승인 대기 중인 사용자가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.name || "(이름없음)"}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        승인대기
                      </span>
                      <span className="ml-2">role: {user.role}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(user.id, true, false)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleAction(user.id, true, true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    승인+관리자
                  </button>
                  <button
                    onClick={() => handleAction(user.id, false, false)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    거절
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
