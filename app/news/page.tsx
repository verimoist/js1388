import type { Metadata } from 'next'
import React from 'react'
import { Calendar, Eye, Search } from 'lucide-react'
import Section from '../../components/ui/Section'
import NoticeList from '../../components/NoticeList'
import Tabs from '../../components/ui/Tabs'
import Button from '../../components/ui/Button'
import { SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: `공지사항 - ${SITE.name}`,
  description: `${SITE.name}의 최신 공지사항과 보도자료를 확인하세요.`,
}

// 더미 데이터
const notices = [
  {
    id: 1,
    title: '2024년 상반기 청소년 프로그램 참가자 모집',
    content: '다양한 청소년 프로그램에 참가할 수 있는 기회입니다. 많은 관심과 참여 부탁드립니다. 프로그램은 3월부터 시작되며, 신청은 2월 말까지 받습니다.',
    date: '2024.01.15',
    views: 156,
    category: 'notice' as const
  },
  {
    id: 2,
    title: '겨울방학 특별 프로그램 운영 안내',
    content: '겨울방학을 맞아 특별히 준비한 다양한 프로그램을 운영합니다. 학습지원, 체험활동, 문화프로그램 등이 준비되어 있습니다.',
    date: '2024.01.10',
    views: 89,
    category: 'notice' as const
  },
  {
    id: 3,
    title: '센터 휴관일 안내 (설날 연휴)',
    content: '설날 연휴 기간 중 센터 휴관 안내입니다. 2월 9일(금)부터 2월 12일(월)까지 휴관하며, 2월 13일(화)부터 정상 운영됩니다.',
    date: '2024.01.05',
    views: 234,
    category: 'notice' as const
  },
  {
    id: 4,
    title: '2024년 신규 상담사 채용 공고',
    content: `${SITE.name}에서 함께할 열정적인 상담사를 모집합니다. 상담 관련 자격증 보유자 우대하며, 자세한 내용은 첨부파일을 확인해주세요.`,
    date: '2024.01.03',
    views: 312,
    category: 'notice' as const
  },
  {
    id: 5,
    title: '진로체험센터 신규 프로그램 오픈',
    content: '다양한 직업을 체험할 수 있는 새로운 프로그램이 추가되었습니다. IT, 의료, 교육, 예술 분야의 체험 프로그램을 운영합니다.',
    date: '2023.12.28',
    views: 178,
    category: 'notice' as const
  }
]

const pressReleases = [
  {
    id: 6,
    title: '지역사회 복지 서비스 확대를 위한 MOU 체결',
    content: `${SITE.name}이 지역사회 복지 서비스 확대를 위해 관련 기관과 업무협약을 체결했습니다. 이를 통해 더욱 체계적이고 전문적인 서비스를 제공할 예정입니다.`,
    date: '2024.01.12',
    views: 95,
    category: 'press' as const
  },
  {
    id: 7,
    title: '청소년 진로상담 프로그램 성과 발표',
    content: '2023년 청소년 진로상담 프로그램의 성과가 발표되었습니다. 참가자 만족도 95%를 기록하며, 높은 성과를 거두었습니다.',
    date: '2024.01.08',
    views: 142,
    category: 'press' as const
  },
  {
    id: 8,
    title: '디지털 전환을 통한 서비스 혁신',
    content: '코로나19 이후 디지털 전환을 통해 온라인 상담 및 교육 서비스를 도입했습니다. 이를 통해 접근성이 크게 향상되었습니다.',
    date: '2023.12.20',
    views: 203,
    category: 'press' as const
  }
]

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

export default function NewsPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="primary" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">공지사항</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
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
