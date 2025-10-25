import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Section from '../../../components/ui/Section'
import Button from '../../../components/ui/Button'
import { prisma } from '../../../lib/prisma'
import { SITE } from '../../../lib/site'

interface NoticeDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: NoticeDetailPageProps): Promise<Metadata> {
  const notice = await prisma.notice.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true } } }
  })

  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다',
    }
  }

  return {
    title: `${notice.title} - ${SITE.name}`,
    description: notice.content.substring(0, 160),
  }
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const notice = await prisma.notice.findUnique({
    where: { id: params.id },
    include: { 
      author: { 
        select: { 
          name: true, 
          email: true 
        } 
      } 
    }
  })

  if (!notice) {
    notFound()
  }

  // 조회수 증가
  await prisma.notice.update({
    where: { id: params.id },
    data: { views: { increment: 1 } }
  })

  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="premium-dark" className="text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/news" 
              className="inline-flex items-center text-green-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              공지사항 목록으로
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              notice.category === 'notice' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {notice.category === 'notice' ? '공지사항' : '보도자료'}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {notice.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-green-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{notice.createdAt.toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>{notice.views + 1}회 조회</span>
            </div>
            {notice.author && (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{notice.author.name}</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* 공지사항 내용 */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: notice.content.replace(/\n/g, '<br>') 
              }}
            />
            
            {/* 첨부파일 섹션 */}
            {(notice as any).attachments && Array.isArray((notice as any).attachments) && (notice as any).attachments.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  첨부파일
                </h3>
                <div className="space-y-2">
                  {(notice as any).attachments.map((attachment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-xs text-gray-500">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <a
                        href={`/api/download/${attachment.url.split('/').pop()}`}
                        download={attachment.name}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        다운로드
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 링크 섹션 */}
            {(notice as any).links && Array.isArray((notice as any).links) && (notice as any).links.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  관련 링크
                </h3>
                <div className="space-y-3">
                  {(notice as any).links.map((link: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-gray-100 p-2 rounded transition-colors"
                      >
                        <h4 className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          {link.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{link.url}</p>
                        {link.description && (
                          <p className="text-sm text-gray-600 mt-2">{link.description}</p>
                        )}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 하단 버튼 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/news">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로 돌아가기
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                공유하기
              </Button>
              <Button variant="outline" size="sm">
                인쇄하기
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 관련 공지사항 */}
      <Section background="gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            관련 공지사항
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 최신 공지사항 4개 표시 */}
            {await (async () => {
              const relatedNotices = await prisma.notice.findMany({
                where: { 
                  published: true,
                  id: { not: params.id }
                },
                orderBy: { createdAt: 'desc' },
                take: 4,
                include: { author: { select: { name: true } } }
              })
              
              return relatedNotices.map(relatedNotice => (
                <Link 
                  key={relatedNotice.id} 
                  href={`/news/${relatedNotice.id}`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      relatedNotice.category === 'notice' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {relatedNotice.category === 'notice' ? '공지' : '보도자료'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {relatedNotice.createdAt.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedNotice.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedNotice.content}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{relatedNotice.views}</span>
                    </div>
                    {relatedNotice.author && (
                      <span className="text-sm text-gray-500">
                        {relatedNotice.author.name}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            })()}
          </div>
        </div>
      </Section>
    </>
  )
}
