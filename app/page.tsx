import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Heart, BookOpen, Award, Phone } from 'lucide-react'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import NoticeList from '../components/NoticeList'
import GalleryGrid from '../components/GalleryGrid'
import ProgramCard from '../components/ProgramCard'
import HeroBanner from '../components/HeroBanner'
import { SITE } from '../lib/site'

export const metadata: Metadata = {
    title: `홈 - ${SITE.name}`,
    description: `${SITE.name}은 지역사회 발전과 시민 복지 향상을 위해 노력하는 공공기관입니다.`,
  }

// 더미 데이터
const heroData = {
    title: '지역사회와 함께 성장하는',
    subtitle: SITE.name,   // <<< 따옴표 제거!
    description: '모든 시민이 행복한 지역사회를 만들어가는 것이 우리의 사명입니다.',
    cta: '문의하기'
  }

const services = [
  {
    id: 1,
    title: '상담복지 서비스',
    description: '전문 상담사와 함께하는 맞춤형 복지 서비스',
    icon: Heart,
    color: 'text-red-500'
  },
  {
    id: 2,
    title: '청소년 교육',
    description: '미래를 준비하는 청소년들을 위한 다양한 교육 프로그램',
    icon: BookOpen,
    color: 'text-blue-500'
  },
  {
    id: 3,
    title: '진로체험센터',
    description: '직업 체험을 통한 진로 탐색의 기회 제공',
    icon: Award,
    color: 'text-green-500'
  },
  {
    id: 4,
    title: '방과후 아카데미',
    description: '안전하고 건전한 방과후 활동 공간 제공',
    icon: Users,
    color: 'text-purple-500'
  }
]

const programs = [
  {
    id: 1,
    title: '상담복지 서비스',
    description: '개인 및 가족의 어려움을 해결하고 건강한 삶을 지원하는 전문 상담 서비스입니다.',
    services: ['개인상담', '가족상담', '집단상담', '위기개입'],
    target: '지역주민 누구나',
    schedule: '평일 09:00-18:00',
    location: '본관 2층 상담실',
    image: '/assets/images/counseling.jpg'
  },
  {
    id: 2,
    title: '청소년자람터',
    description: '청소년들의 건강한 성장과 발달을 지원하는 종합 교육 프로그램입니다.',
    services: ['학습지원', '진로상담', '문화활동', '봉사활동'],
    target: '초·중·고등학생',
    schedule: '평일 15:00-20:00',
    location: '청소년센터',
    image: '/assets/images/youth.jpg'
  },
  {
    id: 3,
    title: '진로체험센터',
    description: '다양한 직업 체험을 통해 진로를 탐색할 수 있는 체험형 교육 공간입니다.',
    services: ['직업체험', '진로상담', '멘토링', '현장견학'],
    target: '청소년 및 성인',
    schedule: '주말 10:00-17:00',
    location: '진로체험관',
    image: '/assets/images/career.jpg'
  }
]

const notices = [
  {
    id: 1,
    title: '2024년 상반기 청소년 프로그램 참가자 모집',
    content: '다양한 청소년 프로그램에 참가할 수 있는 기회입니다. 많은 관심과 참여 부탁드립니다.',
    date: '2024.01.15',
    views: 156,
    category: 'notice' as const
  },
  {
    id: 2,
    title: '겨울방학 특별 프로그램 운영 안내',
    content: '겨울방학을 맞아 특별히 준비한 다양한 프로그램을 운영합니다.',
    date: '2024.01.10',
    views: 89,
    category: 'notice' as const
  },
  {
    id: 3,
    title: '센터 휴관일 안내 (설날 연휴)',
    content: '설날 연휴 기간 중 센터 휴관 안내입니다.',
    date: '2024.01.05',
    views: 234,
    category: 'notice' as const
  }
]

const galleryItems = [
  {
    id: 1,
    title: '청소년 캠프 활동',
    image: '/assets/images/gallery1.jpg',
    description: '자연 속에서 함께하는 청소년 캠프'
  },
  {
    id: 2,
    title: '상담실 내부',
    image: '/assets/images/gallery2.jpg',
    description: '편안하고 안전한 상담 공간'
  },
  {
    id: 3,
    title: '진로체험 활동',
    image: '/assets/images/gallery3.jpg',
    description: '다양한 직업을 체험해보는 시간'
  },
  {
    id: 4,
    title: '봉사활동',
    image: '/assets/images/gallery4.jpg',
    description: '지역사회를 위한 봉사활동'
  },
  {
    id: 5,
    title: '교육 프로그램',
    image: '/assets/images/gallery5.jpg',
    description: '참여형 교육 프로그램'
  },
  {
    id: 6,
    title: '센터 전경',
    image: '/assets/images/gallery6.jpg',
    description: `${SITE.name} 센터 전경`
  }
]

const partners = [
  { name: '지역사회복지협의회', logo: '/assets/images/partner1.png' },
  { name: '청소년지원센터', logo: '/assets/images/partner2.png' },
  { name: '여성가족부', logo: '/assets/images/partner3.png' },
  { name: '교육청', logo: '/assets/images/partner4.png' },
  { name: '시청', logo: '/assets/images/partner5.png' },
  { name: '복지재단', logo: '/assets/images/partner6.png' }
]

export default function HomePage() {
  return (
    <>
      {/* 히어로 슬라이더 */}
      <HeroBanner />

      {/* 주요 서비스 섹션 */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            주요 서비스
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            지역사회의 다양한 요구에 맞춘 전문적이고 체계적인 서비스를 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card key={service.id} hover className="text-center p-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${service.color}`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </Card>
            )
          })}
        </div>
      </Section>

      {/* 사업 프로그램 섹션 */}
      <Section background="gray">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            사업 프로그램
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            체계적이고 전문적인 프로그램으로 지역사회의 다양한 요구를 충족합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/programs">
            <Button variant="outline" size="lg">
              모든 프로그램 보기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* 공지사항 섹션 */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">공지사항</h2>
              <Link 
                href="/news" 
                className="text-brand-primary hover:text-blue-700 font-medium flex items-center"
              >
                더보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <NoticeList notices={notices} limit={3} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">포토갤러리</h2>
              <Link 
                href="/gallery" 
                className="text-brand-primary hover:text-blue-700 font-medium flex items-center"
              >
                더보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <GalleryGrid items={galleryItems.slice(0, 4)} columns={2} />
          </div>
        </div>
      </Section>

      {/* 파트너 섹션 */}
      <Section background="gray">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            협력 기관
          </h2>
          <p className="text-lg text-gray-600">
            함께 만들어가는 지역사회 네트워크
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-12 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* CTA 섹션 */}
      <Section background="primary" className="text-white">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            궁금한 점이 있으시거나 서비스 이용을 원하시면 언제든지 연락주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>상담 문의하기</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/programs">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-300/30 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <span>프로그램 보기</span>
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

