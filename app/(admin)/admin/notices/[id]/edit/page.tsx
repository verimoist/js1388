"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Link as LinkIcon, Paperclip } from "lucide-react"

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

interface Notice {
  id: string
  title: string
  content: string
  category: string
  published: boolean
  attachments?: Attachment[]
  links?: LinkItem[]
}

export default function EditNoticePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "notice" as "notice" | "press",
    published: true,
  })
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [links, setLinks] = useState<LinkItem[]>([])
  const [newLink, setNewLink] = useState({ title: "", url: "", description: "" })

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await fetch(`/api/notices/${params.id}`)
        if (response.ok) {
          const notice: Notice = await response.json()
          setFormData({
            title: notice.title,
            content: notice.content,
            category: notice.category as "notice" | "press",
            published: notice.published,
          })
          setAttachments(notice.attachments || [])
          setLinks(notice.links || [])
        } else {
          alert("공지사항을 불러오는데 실패했습니다.")
          router.push("/admin/notices")
        }
      } catch (error) {
        console.error("Error fetching notice:", error)
        alert("공지사항을 불러오는데 실패했습니다.")
        router.push("/admin/notices")
      } finally {
        setLoadingData(false)
      }
    }

    fetchNotice()
  }, [params.id, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      try {
        // 파일 타입 검증 (이미지, 문서, 압축 파일 등 허용)
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
        
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          const attachment: Attachment = {
            name: result.name,
            url: result.url,
            size: result.size,
            type: result.type
          }
          setAttachments(prev => [...prev, attachment])
        } else {
          alert(`파일 업로드 실패: ${file.name}`)
        }
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
      const response = await fetch(`/api/notices/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(attachments.length > 0 && { attachments }),
          ...(links.length > 0 && { links }),
        }),
      })

      if (response.ok) {
        router.push("/admin/notices")
      } else {
        const error = await response.json()
        console.error("API Error:", error)
        alert(`공지사항 수정에 실패했습니다: ${error.error || "알 수 없는 오류"}`)
      }
    } catch (error) {
      console.error("Error updating notice:", error)
      alert("공지사항 수정에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">공지사항을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">공지사항 수정</h1>
        <p className="text-gray-600">공지사항 또는 보도자료를 수정하세요.</p>
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
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            카테고리
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as "notice" | "press" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="notice">공지사항</option>
            <option value="press">보도자료</option>
          </select>
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
