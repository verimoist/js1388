import type { Metadata } from 'next'
import React from 'react'
import { Download, FileText, Calendar, User, Search } from 'lucide-react'
import Section from '../../components/ui/Section'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: `자료실 - ${SITE.name}`,
  description: `${SITE.name}의 각종 양식, 가이드, 보고서 등 유용한 자료를 다운로드하세요.`,
}

// 더미 데이터
const documentCategories = [
  { id: 'all', name: '전체', count: 12 },
  { id: 'form', name: '양식', count: 5 },
  { id: 'guide', name: '가이드', count: 4 },
  { id: 'report', name: '보고서', count: 3 }
]

const documents = [
  {
    id: 1,
    title: '상담 신청서',
    description: '개인상담 및 가족상담 신청을 위한 양식입니다.',
    category: 'form',
    fileSize: '245KB',
    downloadCount: 156,
    uploadDate: '2024.01.15',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: '청소년 프로그램 참가 신청서',
    description: '청소년 프로그램 참가를 위한 신청서 양식입니다.',
    category: 'form',
    fileSize: '312KB',
    downloadCount: 89,
    uploadDate: '2024.01.10',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: '센터 이용 안내서',
    description: '센터 시설 이용 방법 및 주의사항을 안내합니다.',
    category: 'guide',
    fileSize: '1.2MB',
    downloadCount: 234,
    uploadDate: '2024.01.05',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 4,
    title: '프로그램 참가 가이드',
    description: '다양한 프로그램 참가 방법 및 절차를 안내합니다.',
    category: 'guide',
    fileSize: '856KB',
    downloadCount: 178,
    uploadDate: '2023.12.28',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 5,
    title: '2023년 연간 보고서',
    description: '2023년 센터 운영 실적 및 성과를 정리한 보고서입니다.',
    category: 'report',
    fileSize: '2.1MB',
    downloadCount: 95,
    uploadDate: '2023.12.20',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 6,
    title: '봉사활동 신청서',
    description: '센터 봉사활동 참가를 위한 신청서 양식입니다.',
    category: 'form',
    fileSize: '198KB',
    downloadCount: 67,
    uploadDate: '2023.12.15',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 7,
    title: '상담 서비스 이용 가이드',
    description: '상담 서비스 이용 방법 및 절차를 상세히 안내합니다.',
    category: 'guide',
    fileSize: '1.5MB',
    downloadCount: 142,
    uploadDate: '2023.12.10',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 8,
    title: '진로상담 프로그램 안내서',
    description: '진로상담 프로그램의 내용 및 참가 방법을 안내합니다.',
    category: 'guide',
    fileSize: '723KB',
    downloadCount: 203,
    uploadDate: '2023.12.05',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 9,
    title: '2023년 3분기 보고서',
    description: '2023년 3분기 센터 운영 실적 및 성과 보고서입니다.',
    category: 'report',
    fileSize: '1.8MB',
    downloadCount: 78,
    uploadDate: '2023.11.30',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 10,
    title: '시설 이용 신청서',
    description: '센터 시설 이용을 위한 신청서 양식입니다.',
    category: 'form',
    fileSize: '267KB',
    downloadCount: 45,
    uploadDate: '2023.11.25',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 11,
    title: '개인정보 처리방침',
    description: '센터의 개인정보 처리방침 및 보호 정책입니다.',
    category: 'guide',
    fileSize: '445KB',
    downloadCount: 312,
    uploadDate: '2023.11.20',
    fileType: 'PDF',
    downloadUrl: '#'
  },
  {
    id: 12,
    title: '2023년 2분기 보고서',
    description: '2023년 2분기 센터 운영 실적 및 성과 보고서입니다.',
    category: 'report',
    fileSize: '1.6MB',
    downloadCount: 89,
    uploadDate: '2023.11.15',
    fileType: 'PDF',
    downloadUrl: '#'
  }
]

const popularDocuments = documents
  .sort((a, b) => b.downloadCount - a.downloadCount)
  .slice(0, 5)

export default function ResourcesPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="primary" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">자료실</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {SITE.name}의 각종 양식, 가이드, 보고서 등 유용한 자료를 다운로드하세요.
          </p>
        </div>
      </Section>

      {/* 검색 및 필터 */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="자료명, 설명으로 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                검색
              </Button>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-4">
              {documentCategories.map((category) => (
                <button
                  key={category.id}
                  className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-colors duration-200"
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* 자료 목록 */}
          <div className="space-y-4">
            {documents.map((document) => (
              <Card key={document.id} hover className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        document.category === 'form' 
                          ? 'bg-blue-100 text-blue-800'
                          : document.category === 'guide'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {document.category === 'form' ? '양식' : 
                         document.category === 'guide' ? '가이드' : '보고서'}
                      </span>
                      <span className="text-sm text-gray-500">{document.fileType}</span>
                      <span className="text-sm text-gray-500">{document.fileSize}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {document.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {document.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{document.uploadDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{document.downloadCount}회</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <Button variant="primary" size="sm">
                      <a href={document.downloadUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        다운로드
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* 인기 자료 */}
      <Section background="gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            인기 자료
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDocuments.map((document, index) => (
              <Card key={document.id} hover className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-brand-primary">#{index + 1}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        document.category === 'form' 
                          ? 'bg-blue-100 text-blue-800'
                          : document.category === 'guide'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {document.category === 'form' ? '양식' : 
                         document.category === 'guide' ? '가이드' : '보고서'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {document.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Download className="h-4 w-4" />
                        <span>{document.downloadCount}회</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <a href={document.downloadUrl} download>
                          다운로드
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* 자료실 안내 */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            자료실 안내
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                자료 이용 안내
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• 모든 자료는 무료로 다운로드 가능</li>
                <li>• 개인적 용도로만 사용 가능</li>
                <li>• 상업적 이용 시 사전 허가 필요</li>
                <li>• 자료 수정 및 재배포 금지</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                자료 요청
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• 필요한 자료가 없을 경우 요청 가능</li>
                <li>• 자료 제작 및 업로드까지 3-5일 소요</li>
                <li>• 요청 시 용도 및 목적 명시 필요</li>
                <li>• 문의: {SITE.phone}</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}