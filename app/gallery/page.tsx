import type { Metadata } from 'next'
import React from 'react'
import { Calendar, Camera, Filter } from 'lucide-react'
import Section from '../../components/ui/Section'
import GalleryGrid from '../../components/GalleryGrid'
import Button from '../../components/ui/Button'
import { SITE } from '../../lib/site'
import { getGalleryItems } from '../../lib/data'

export const metadata: Metadata = {
  title: `포토갤러리 - ${SITE.name}`,
  description: `${SITE.name}의 다양한 활동과 프로그램을 사진으로 확인하세요.`,
}

// 실제 데이터베이스에서 갤러리 데이터 가져오기

const recentAlbums = [
  {
    id: 1,
    title: '2024년 청소년 캠프',
    date: '2024.01.15',
    imageCount: 25,
    thumbnail: '/assets/images/gallery1.jpg'
  },
  {
    id: 2,
    title: '겨울방학 특별 프로그램',
    date: '2024.01.10',
    imageCount: 18,
    thumbnail: '/assets/images/gallery5.jpg'
  },
  {
    id: 3,
    title: '진로체험센터 오픈',
    date: '2024.01.05',
    imageCount: 32,
    thumbnail: '/assets/images/gallery3.jpg'
  }
]

export default async function GalleryPage() {
  // lib/data.ts의 getGalleryItems 함수 사용
  const galleryData = await getGalleryItems()

  // GalleryGrid 컴포넌트에 맞는 형식으로 변환
  const galleryItems = galleryData.map(item => ({
    id: item.id,
    title: item.title,
    image: item.imageUrl,
    description: item.caption || ''
  }))

  // 카테고리 정의
  const categories = [
    { id: 'all', name: '전체', count: galleryItems.length },
    { id: 'program', name: '프로그램', count: Math.floor(galleryItems.length * 0.4) },
    { id: 'facility', name: '시설', count: Math.floor(galleryItems.length * 0.2) },
    { id: 'event', name: '행사', count: Math.floor(galleryItems.length * 0.4) }
  ]
  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="premium-dark" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              포토갤러리
            </span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {SITE.name}의 다양한 활동과 프로그램을 사진으로 확인하세요.
          </p>
        </div>
      </Section>

      {/* 갤러리 필터 */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-colors duration-200"
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* 갤러리 그리드 */}
          <GalleryGrid items={galleryItems} columns={3} />
        </div>
      </Section>

      {/* 최근 앨범 */}
      <Section background="gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            최근 앨범
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAlbums.map((album) => (
              <div key={album.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={album.thumbnail}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <Camera className="h-6 w-6 text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{album.date}</span>
                    </div>
                    <span>{album.imageCount}장</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 갤러리 안내 */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            포토갤러리 안내
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                사진 업로드
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• 프로그램 참가자 및 관계자만 업로드 가능</li>
                <li>• 개인정보가 포함된 사진은 업로드 금지</li>
                <li>• 저작권이 있는 사진은 업로드 금지</li>
                <li>• 부적절한 내용의 사진은 삭제될 수 있음</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                사진 다운로드
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• 개인적 용도로만 사용 가능</li>
                <li>• 상업적 이용 시 사전 허가 필요</li>
                <li>• 고화질 원본은 별도 문의</li>
                <li>• 사진 삭제 요청 시 즉시 처리</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              사진 업로드하기
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
