import type { Metadata } from 'next'
import React from 'react'
import { Calendar, Eye, Search } from 'lucide-react'
import Section from '../../components/ui/Section'
import NoticeList from '../../components/NoticeList'
import Tabs from '../../components/ui/Tabs'
import Button from '../../components/ui/Button'
import { SITE } from '../../lib/site'
import { getNotices, getPressReleases } from '../../lib/data'

export const metadata: Metadata = {
  title: `공지사항 - ${SITE.name}`,
  description: `${SITE.name}의 최신 공지사항과 보도자료를 확인하세요.`,
}

export default async function NewsPage() {
  // 캐시된 데이터 가져오기
  const noticesData = await getNotices()
  const pressData = await getPressReleases()

  // 공지사항과 보도자료 분리
  const notices = noticesData
    .filter(notice => notice.category === 'notice')
    .map(notice => ({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      date: new Date(notice.createdAt).toLocaleDateString('ko-KR'),
      views: notice.views,
      category: notice.category as 'notice' | 'press'
    }))

  const pressReleases = pressData.map(notice => ({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    date: new Date(notice.createdAt).toLocaleDateString('ko-KR'),
    views: notice.views,
    category: notice.category as 'notice' | 'press'
  }))

  const allNotices = [...notices, ...pressReleases].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

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
          <NoticeList notices={allNotices} showCategory={true} />
        </div>
      )
    },
    {
      id: 'notice',
      label: '공지사항',
      content: <NoticeList notices={notices} />
    },
    {
      id: 'press',
      label: '보도자료',
      content: <NoticeList notices={pressReleases} />
    }
  ]
  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="premium-dark" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              공지사항
            </span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {SITE.name}의 최신 공지사항과 보도자료를 확인하세요.
          </p>
        </div>
      </Section>

      {/* 공지사항 목록 */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <Tabs tabs={tabs} defaultTab="all" />
        </div>
      </Section>

      {/* 주요 공지사항 */}
      <Section background="gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            주요 공지사항
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    공지
                  </span>
                  <span className="text-sm text-gray-500">{notice.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {notice.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {notice.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{notice.views}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <a href={`/news/${notice.id}`}>
                      자세히 보기
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 공지사항 안내 */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            공지사항 안내
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                공지사항
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• 센터 운영 관련 주요 사항</li>
                <li>• 프로그램 신청 및 변경 안내</li>
                <li>• 휴관일 및 특별 운영 안내</li>
                <li>• 센터 시설 이용 안내</li>
              </ul>
            </div>
            
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
        </div>
      </Section>
    </>
  )
}
