import { NextRequest } from 'next/server'
import { getSimpleUser, isAdmin } from '@/lib/simple-auth'
import { prisma } from '@/lib/prisma'

export default async function SimpleAdminPage() {
  // 서버 사이드에서 쿠키 확인
  const request = new NextRequest('http://localhost:3000')
  const user = getSimpleUser(request)
  
  if (!user || !isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">관리자 권한이 필요합니다.</p>
          <a 
            href="/simple-login" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            로그인하기
          </a>
        </div>
      </div>
    )
  }

  // 통계 데이터 가져오기
  const [noticesCount, pressCount, galleryCount, resourcesCount] = await Promise.all([
    prisma.notice.count(),
    prisma.press.count(),
    prisma.galleryItem.count(),
    prisma.resource.count(),
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600">시스템 현황을 확인하고 콘텐츠를 관리하세요.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">로그인된 사용자</p>
              <p className="font-medium">{user.email}</p>
              <a 
                href="/api/simple-logout" 
                className="text-sm text-red-600 hover:text-red-500"
              >
                로그아웃
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">공지사항</h3>
              <p className="text-3xl font-bold text-blue-600">{noticesCount}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">보도자료</h3>
              <p className="text-3xl font-bold text-green-600">{pressCount}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">갤러리</h3>
              <p className="text-3xl font-bold text-purple-600">{galleryCount}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">자료실</h3>
              <p className="text-3xl font-bold text-orange-600">{resourcesCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="/admin/notices" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h4 className="font-medium text-gray-900">공지사항 관리</h4>
                <p className="text-sm text-gray-500">공지사항을 작성하고 관리합니다</p>
              </a>
              <a 
                href="/admin/press" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h4 className="font-medium text-gray-900">보도자료 관리</h4>
                <p className="text-sm text-gray-500">보도자료를 작성하고 관리합니다</p>
              </a>
              <a 
                href="/admin/gallery" 
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h4 className="font-medium text-gray-900">갤러리 관리</h4>
                <p className="text-sm text-gray-500">갤러리 이미지를 관리합니다</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
