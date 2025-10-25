import type { Metadata } from 'next'
import React from 'react'
import { Calendar, Eye, Search } from 'lucide-react'
import Section from '../../components/ui/Section'
import NoticeList from '../../components/NoticeList'
import Tabs from '../../components/ui/Tabs'
import Button from '../../components/ui/Button'
import { SITE } from '../../lib/site'
import { prisma } from '../../lib/prisma'

export const metadata: Metadata = {
  title: `보도자료 - ${SITE.name}`,
  description: `${SITE.name}의 최신 보도자료를 확인하세요.`,
}

export default async function PressPage() {
  // 실제 데이터베이스에서 보도자료 가져오기
  const pressData = await prisma.press.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  // NoticeList 컴포넌트에 맞는 형식으로 변환
  const pressReleases = pressData.map(press => ({
    id: press.id,
    title: press.title,
    content: press.content,
    date: press.createdAt.toLocaleDateString('ko-KR'),
    views: 0, // Press 모델에는 views 필드가 없으므로 0으로 설정
    category: 'press' as 'notice' | 'press'
  }))

  const tabs = [
    {
      id: 'all',
      label: '전체',
      content: (
        <div>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="제목, 내용으로 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                검색
              </Button>
            </div>
          </div>
          <NoticeList notices={pressReleases} showCategory={true} />
        </div>
      )
    }
  ]

  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="premium-dark" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              보도자료
            </span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {SITE.name}의 최신 보도자료를 확인하세요.
          </p>
        </div>
      </Section>

      {/* 보도자료 목록 */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <Tabs tabs={tabs} defaultTab="all" />
        </div>
      </Section>

      {/* 주요 보도자료 */}
      <Section background="gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            주요 보도자료
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pressReleases.slice(0, 3).map((press) => (
              <div key={press.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    보도자료
                  </span>
                  <span className="text-sm text-gray-500">{press.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {press.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {press.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{press.views}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <a href={`/press/${press.id}`}>
                      자세히 보기
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 보도자료 안내 */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            보도자료 안내
          </h2>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              보도자료
            </h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• 센터 주요 성과 및 실적</li>
              <li>• 새로운 프로그램 및 서비스</li>
              <li>• 기관 간 협력 및 MOU 체결</li>
              <li>• 수상 및 인정 관련 소식</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
