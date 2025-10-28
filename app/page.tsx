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
import ScrollAnimation from '../components/ui/ScrollAnimation'
import { SITE } from '../lib/site'
import { prisma } from '../lib/prisma'

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

// 공지사항 데이터는 서버에서 가져옵니다

// 실제 데이터베이스에서 갤러리 데이터 가져오기

const partners = [
  { 
    name: '전라남도 교육청', 
    logo: '/assets/images/partners/jeonnam-edu.svg',
    url: 'https://www.jne.go.kr'
  },
  { 
    name: '전라남도장성교육지원청', 
    logo: '/assets/images/partners/jangseong-edu.svg',
    url: 'https://www.jne.go.kr/jangseong'
  },
  { 
    name: '한국청소년활동진흥원', 
    logo: '/assets/images/partners/kywa.svg',
    url: 'https://www.kywa.or.kr'
  },
  { 
    name: '한국청소년상담복지개발원', 
    logo: '/assets/images/partners/kyci.svg',
    url: 'https://www.kyci.or.kr'
  },
  { 
    name: '전라남도청소년미래재단', 
    logo: '/assets/images/partners/jnyf.svg',
    url: 'https://www.jnyf.or.kr'
  },
  { 
    name: '전라남도', 
    logo: '/assets/images/partners/jeonnam-province.svg',
    url: 'https://www.jeonnam.go.kr'
  },
  { 
    name: '장성군', 
    logo: '/assets/images/partners/jangseong-county.svg',
    url: 'https://www.jangseong.go.kr'
  }
]

import { getNotices, getGalleryItems } from '@/lib/data'
import InteractiveButton from '@/components/ui/InteractiveButton'
import Container from '@/components/ui/Container'

export default async function HomePage() {
  // 캐시된 데이터 가져오기
  const noticesData = await getNotices(3)
  const galleryData = await getGalleryItems({ limit: 6 })

  // NoticeList 컴포넌트에 맞는 형식으로 변환
  const notices = noticesData.map(notice => ({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    date: new Date(notice.createdAt).toLocaleDateString('ko-KR'),
    views: notice.views,
    category: notice.category as 'notice' | 'press'
  }))

  // GalleryGrid 컴포넌트에 맞는 형식으로 변환
  const galleryItems = galleryData.map(item => ({
    id: item.id,
    title: item.title,
    image: item.imageUrl,
    description: item.caption || ''
  }))
  return (
    <>
      {/* 히어로 슬라이더 */}
      <HeroBanner />

      {/* 주요 사업 섹션 */}
      <Section background="premium">
        <ScrollAnimation animation="fadeIn" delay={200}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">주요 사업</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              지역사회의 다양한 요구에 맞춘 전문적이고 체계적인 사업을 운영합니다.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <ScrollAnimation key={service.id} animation="slideUp" delay={index * 100}>
                <Card hover className="text-center p-6">
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
              </ScrollAnimation>
            )
          })}
        </div>
      </Section>

      {/* 사업 프로그램 섹션 */}
      <Section background="gray">
        <ScrollAnimation animation="fadeIn" delay={200}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">사업 프로그램</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              체계적이고 전문적인 프로그램으로 지역사회의 다양한 요구를 충족합니다.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <ScrollAnimation key={program.id} animation="slideUp" delay={index * 150}>
              <ProgramCard program={program} />
            </ScrollAnimation>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/programs">
            <div className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 rounded-2xl font-medium text-lg shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:-translate-y-0.5">
              <span className="mr-2">모든 프로그램 보기</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>
        </div>
      </Section>

      {/* 공지사항 섹션 */}
      <Section background="premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ScrollAnimation animation="slideRight" delay={200}>
            <div>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold">
                  <span className="text-gradient">공지사항</span>
                </h2>
                <Link 
                  href="/news" 
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 rounded-xl font-medium shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span className="mr-2">더보기</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              <NoticeList notices={notices} limit={3} />
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="slideLeft" delay={400}>
            <div>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold">
                  <span className="text-gradient">포토갤러리</span>
                </h2>
                <Link 
                  href="/gallery" 
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 rounded-xl font-medium shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span className="mr-2">더보기</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              <GalleryGrid items={galleryItems.slice(0, 4)} columns={2} />
            </div>
          </ScrollAnimation>
        </div>
      </Section>

      {/* 파트너 섹션 */}
      <Section background="gray">
        <ScrollAnimation animation="fadeIn" delay={200}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              협력 기관
            </h2>
            <p className="text-lg text-gray-600">
              함께 만들어가는 지역사회 네트워크
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {partners.map((partner, index) => (
            <ScrollAnimation key={index} animation="scale" delay={index * 100}>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="mt-2 text-xs text-gray-600 text-center group-hover:text-gray-900 transition-colors duration-300">
                  {partner.name}
                </span>
              </a>
            </ScrollAnimation>
          ))}
        </div>
      </Section>

    </>
  )
}

