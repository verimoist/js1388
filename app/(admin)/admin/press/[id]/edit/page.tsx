"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, X, Link as LinkIcon, Paperclip } from "lucide-react"
import { uploadToBlob } from "@/lib/upload-client"

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

export default function EditPressPage() {
  const router = useRouter()
  const params = useParams()
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

  useEffect(() => {
    if (params.id) {
      fetchPress()
    }
  }, [params.id])

  const fetchPress = async () => {
    try {
      const response = await fetch(`/api/press/${params.id}`)
      if (response.ok) {
        const press = await response.json()
        setFormData({
          title: press.title,
          content: press.content,
          sourceUrl: press.sourceUrl || "",
          published: press.published,
        })
        
        // 첨부파일과 링크 설정
        if (press.attachments && Array.isArray(press.attachments)) {
          setAttachments(press.attachments)
        }
        if (press.links && Array.isArray(press.links)) {
          setLinks(press.links)
        }
      } else {
        alert("보도자료를 찾을 수 없습니다.")
        router.push("/admin/press")
      }
    } catch (error) {
      console.error("Error fetching press:", error)
      alert("보도자료를 불러오는데 실패했습니다.")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      try {
        // 파일 타입 검증
        const allowedTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain', 'application/zip', 'application/x-rar-compressed'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          alert(`지원하지 않는 파일 형식입니다: ${file.name} (${file.type})`)
          continue
        }
        
        // 파일 크기 제한 (10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          alert(`파일 크기가 너무 큽니다: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
          continue
        }
        
        // 공용 업로드 유틸 사용 - 폴더 명시적 전달
        const uploaded = await uploadToBlob(file, 'press')
        
        const attachment: Attachment = {
          name: uploaded.name,
          url: uploaded.url,
          size: uploaded.size || file.size,
          type: uploaded.contentType || file.type
        }
        setAttachments(prev => [...prev, attachment])
      } catch (error) {
        console.error('파일 업로드 오류:', error)
        alert(`파일 업로드 오류: ${file.name} - ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setLinks(prev => [...prev, { ...newLink }])
      setNewLink({ title: "", url: "", description: "" })
    }
  }

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/press/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
          ...formData,
          attachments: attachments,
          links: links?.filter(Boolean) ?? []
        }),
      })

      if (response.ok) {
        router.push("/admin/press")
      } else {
        const error = await response.json()
        alert(`보도자료 수정에 실패했습니다: ${error.error || "알 수 없는 오류"}`)
      }
    } catch (error) {
      console.error("Error updating press:", error)
      alert("보도자료 수정에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">보도자료 수정</h1>
        <p className="text-gray-600">보도자료를 수정하세요.</p>
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

        {/* 첨부파일 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첨부파일
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Paperclip className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">파일을 선택하거나 여기에 드래그하세요</span>
            </label>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 링크 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            관련 링크
          </label>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="링크 제목"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="url"
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="설명 (선택사항)"
              value={newLink.description}
              onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {links.length > 0 && (
            <div className="mt-4 space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{link.title}</p>
                      <p className="text-xs text-gray-500">{link.url}</p>
                      {link.description && (
                        <p className="text-xs text-gray-400">{link.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            {loading ? "수정 중..." : "수정"}
          </button>
        </div>
      </form>
    </div>
  )
}
