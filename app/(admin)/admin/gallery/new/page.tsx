"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FileUpload from "@/components/admin/FileUpload"

export default function NewGalleryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/gallery")
      } else {
        const error = await response.json()
        alert(error.error || "갤러리 항목 생성에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error creating gallery item:", error)
      alert("갤러리 항목 생성에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (url: string, filename: string) => {
    setFormData({ ...formData, imageUrl: url })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 갤러리 항목 추가</h1>
        <p className="text-gray-600">이미지를 업로드하고 정보를 입력하세요.</p>
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
            placeholder="이미지 제목을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            id="caption"
            rows={3}
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="이미지에 대한 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 업로드 *
          </label>
          {formData.imageUrl ? (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <img
                  src={formData.imageUrl}
                  alt="업로드된 이미지"
                  className="max-w-full h-48 object-cover rounded"
                />
                <p className="text-sm text-gray-600 mt-2">업로드 완료</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                이미지 제거
              </button>
            </div>
          ) : (
            <FileUpload
              onUpload={handleFileUpload}
              accept="image/*"
              maxSize={10}
              folder="gallery"
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
            disabled={loading || !formData.imageUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  )
}
