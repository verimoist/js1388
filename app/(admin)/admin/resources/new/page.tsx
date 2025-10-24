"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FileUpload from "@/components/admin/FileUpload"

export default function NewResourcePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    fileUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/resources")
      } else {
        const error = await response.json()
        alert(error.error || "자료 생성에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error creating resource:", error)
      alert("자료 생성에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (url: string, filename: string) => {
    setFormData({ ...formData, fileUrl: url })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 자료 추가</h1>
        <p className="text-gray-600">파일을 업로드하고 정보를 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목 *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="자료 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 업로드 *
          </label>
          {formData.fileUrl ? (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">파일 업로드 완료</p>
                    <p className="text-xs text-gray-500">{formData.fileUrl}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, fileUrl: "" })}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                파일 제거
              </button>
            </div>
          ) : (
            <FileUpload
              onUpload={handleFileUpload}
              accept="*/*"
              maxSize={50}
            />
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading || !formData.fileUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  )
}
