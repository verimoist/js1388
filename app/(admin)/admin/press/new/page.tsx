"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Attachment {
  name: string
  url: string
  size: number
  type: string
}

interface LinkItem {
  title: string
  url: string
  description?: string
}

export default function NewPressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sourceUrl: "",
    published: true,
  })
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [links, setLinks] = useState<LinkItem[]>([])
  const [newLink, setNewLink] = useState({ title: "", url: "", description: "" })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    console.log('=== 보도자료 파일 업로드 시작 ===')
    console.log('파일 수:', files.length)

    for (const file of Array.from(files)) {
      try {
        console.log('파일 처리 시작:', {
          name: file.name,
          size: file.size,
          type: file.type
        })

        // 파일 크기 제한 (10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
          alert(`파일 크기가 너무 큽니다: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'press') // 보도자료 폴더

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          console.log('업로드 성공:', result)
          const attachment: Attachment = {
            name: result.originalName,
            url: result.url,
            size: result.size,
            type: result.contentType
          }
          setAttachments(prev => [...prev, attachment])
        } else {
          const errorResult = await response.json()
          console.error('업로드 실패:', errorResult)
          alert(`파일 업로드 실패: ${file.name} - ${errorResult.error}`)
        }
      } catch (error) {
        console.error('파일 업로드 오류:', error)
        alert(`파일 업로드 오류: ${file.name}`)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        attachments: attachments.length > 0 ? attachments : undefined,
        links: links.length > 0 ? links : undefined,
      }
      
      console.log('보도자료 제출 데이터:', submitData)
      
      const response = await fetch("/api/press", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      console.log('응답 상태:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('보도자료 생성 성공:', result)
        router.push("/admin/press")
      } else {
        const error = await response.json()
        console.error('보도자료 생성 실패:', error)
        alert(`보도자료 생성에 실패했습니다: ${error.error || '알 수 없는 오류'}\n상세: ${error.details || ''}`)
      }
    } catch (error) {
      console.error("Error creating press:", error)
      alert("보도자료 생성에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 보도자료 작성</h1>
        <p className="text-gray-600">보도자료를 작성하세요.</p>
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
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700">
            원문 링크
          </label>
          <input
            type="url"
            id="sourceUrl"
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용 *
          </label>
          <textarea
            id="content"
            required
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            즉시 발행
          </label>
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  )
}
