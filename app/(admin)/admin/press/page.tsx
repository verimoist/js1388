"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

// 강제 동적 렌더링
export const dynamic = 'force-dynamic'

interface Press {
  id: string
  title: string
  content: string
  sourceUrl: string | null
  published: boolean
  createdAt: string
  author: {
    name: string | null
    email: string | null
  } | null
}

export default function PressPage() {
  const [press, setPress] = useState<Press[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPress()
  }, [])

  const fetchPress = async () => {
    try {
      const response = await fetch("/api/press")
      const data = await response.json()
      setPress(data.press || [])
    } catch (error) {
      console.error("Error fetching press:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const response = await fetch(`/api/press/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPress(press.filter((item) => item.id !== id))
      } else {
        alert("삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error deleting press:", error)
      alert("삭제에 실패했습니다.")
    }
  }

  const filteredPress = press.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.content.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">보도자료 관리</h1>
        <Link
          href="/admin/press/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          새 보도자료 작성
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <input
            type="text"
            placeholder="보도자료 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPress.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    {item.sourceUrl && (
                      <div className="text-xs text-gray-500">
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          원문 링크
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.published ? "발행" : "임시저장"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm", { locale: ko })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.author?.name || item.author?.email || "알 수 없음"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/press/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
