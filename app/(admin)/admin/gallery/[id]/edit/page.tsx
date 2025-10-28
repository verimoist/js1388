"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Attachment {
  name: string
  url: string
  size: number
  type: string
}

interface GalleryItem {
  id: string
  title: string
  caption: string
  imageUrl: string
  attachments: Attachment[]
}

export default function EditGalleryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    imageUrl: "",
  })
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const response = await fetch(`/api/gallery/${params.id}`)
        if (response.ok) {
          const item: GalleryItem = await response.json()
          setFormData({
            title: item.title,
            caption: item.caption || "",
            imageUrl: item.imageUrl,
          })
          setAttachments(item.attachments || [])
        } else {
          alert("갤러리 항목을 불러오는데 실패했습니다.")
          router.push("/admin/gallery")
        }
      } catch (error) {
        console.error("Error fetching gallery item:", error)
        alert("갤러리 항목을 불러오는데 실패했습니다.")
        router.push("/admin/gallery")
      } finally {
        setLoadingData(false)
      }
    }

    fetchGalleryItem()
  }, [params.id, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'gallery')

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
        alert(`파일 업로드 오류: ${file.name} - ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }
  }

  const removeAttachment = (index: number) => {
    const attachment = attachments[index]
    if (attachment.url) {
      setRemovedAttachments(prev => [...prev, attachment.url])
    }
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 기존 첨부파일에서 제거된 것들을 제외하고 새로 업로드된 것들과 병합
      const finalAttachments = attachments.filter(attachment => 
        !removedAttachments.includes(attachment.url)
      )

      const submitData = {
        title: formData.title,
        caption: formData.caption,
        imageUrl: formData.imageUrl,
        attachments: finalAttachments
      }
      
      console.log('수정할 데이터:', submitData)
      console.log('제거된 첨부파일:', removedAttachments)

      const response = await fetch(`/api/gallery/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        router.push("/admin/gallery")
      } else {
        const error = await response.json()
        console.error("API Error:", error)
        alert(`갤러리 항목 수정에 실패했습니다: ${error.error || "알 수 없는 오류"}\n상세: ${error.details || ''}`)
      }
    } catch (error) {
      console.error("Error updating gallery item:", error)
      alert("갤러리 항목 수정에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUploadForImage = (url: string, filename: string) => {
    setFormData({ ...formData, imageUrl: url })
  }

  if (loadingData) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">갤러리 항목 수정</h1>
        <p className="text-gray-600">이미지와 정보를 수정하세요.</p>
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

        {/* 첨부파일 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첨부파일
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          {attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">업로드된 파일:</h4>
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{attachment.name}</div>
                        <div className="text-gray-500">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  alt="미리보기"
                  className="max-w-full h-64 object-contain mx-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                현재 이미지: {formData.imageUrl}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">이미지를 업로드하세요</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/gallery")}
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
