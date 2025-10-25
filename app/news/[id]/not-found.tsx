import Link from 'next/link'
import { ArrowLeft, FileX } from 'lucide-react'
import Section from '../../../components/ui/Section'
import Button from '../../../components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Section background="premium-dark" className="text-white">
        <div className="text-center">
          <FileX className="h-24 w-24 mx-auto mb-6 text-green-200" />
          <h1 className="text-4xl font-bold mb-4">공지사항을 찾을 수 없습니다</h1>
          <p className="text-xl text-green-100 mb-8">
            요청하신 공지사항이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link href="/news">
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              공지사항 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
