import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Section from '../../../components/ui/Section'
import Button from '../../../components/ui/Button'
import { prisma } from '../../../lib/prisma'
import { SITE } from '../../../lib/site'

interface PressDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PressDetailPageProps): Promise<Metadata> {
  const press = await prisma.notice.findUnique({
    where: { 
      id: params.id,
      category: 'press' // 보도자료만 조회
    },
    include: { author: { select: { name: true } } }
  })

  if (!press) {
    return {
      title: '보도자료를 찾을 수 없습니다',
    }
  }

  return {
    title: `${press.title} - ${SITE.name}`,
    description: press.content.substring(0, 160),
  }
}

export default async function PressDetailPage({ params }: PressDetailPageProps) {
  const press = await prisma.notice.findUnique({
    where: { 
      id: params.id,
      category: 'press' // 보도자료만 조회
    },
    include: { 
      author: { 
        select: { 
          name: true, 
          email: true 
        } 
      } 
    }
  })

  if (!press) {
    notFound()
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="premium-dark" className="text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/press" 
              className="inline-flex items-center text-green-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              보도자료 목록으로
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
              보도자료
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {press.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-green-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{press.createdAt.toLocaleDateString('ko-KR')}</span>
            </div>
            {press.author && (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{press.author.name}</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* 보도자료 내용 */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: press.content.replace(/\n/g, '<br>') 
              }}
            />
          </div>
          
          {/* 하단 버튼 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/press">
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

      {/* 관련 보도자료 */}
      <Section background="gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            관련 보도자료
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 최신 보도자료 4개 표시 */}
            {await (async () => {
              const relatedPress = await prisma.notice.findMany({
                where: { 
                  published: true,
                  category: 'press',
                  id: { not: params.id }
                },
                orderBy: { createdAt: 'desc' },
                take: 4,
                include: { author: { select: { name: true } } }
              })
              
              return relatedPress.map(relatedItem => (
                <Link 
                  key={relatedItem.id} 
                  href={`/press/${relatedItem.id}`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      보도자료
                    </span>
                    <span className="text-sm text-gray-500">
                      {relatedItem.createdAt.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedItem.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedItem.content}
                  </p>
                  {relatedItem.author && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">
                        {relatedItem.author.name}
                      </span>
                    </div>
                  )}
                </Link>
              ))
            })()}
          </div>
        </div>
      </Section>
    </>
  )
}
