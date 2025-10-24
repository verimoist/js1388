"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface GalleryItem {
  id: string
  title: string
  imageUrl: string
  caption: string | null
  createdAt: string
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setGallery(data.gallery || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setGallery(gallery.filter((item) => item.id !== id))
      } else {
        alert("삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      alert("삭제에 실패했습니다.")
    }
  }

  const filteredGallery = gallery.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.caption && item.caption.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">갤러리 관리</h1>
        <Link
          href="/admin/gallery/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          새 이미지 추가
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <input
            type="text"
            placeholder="갤러리 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                  {item.caption && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.caption}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(item.createdAt), "yyyy-MM-dd", { locale: ko })}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Link
                      href={`/admin/gallery/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
