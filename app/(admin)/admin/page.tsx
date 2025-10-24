import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <div>로그인이 필요합니다.</div>
  }
  
  if (session.user.role !== "admin") {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
        <p className="text-gray-600 mb-4">관리자 권한이 필요합니다.</p>
        <p className="text-sm text-gray-500">
          현재 사용자: {session.user.email} (권한: {session.user.role})
        </p>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600">시스템 현황을 확인하고 콘텐츠를 관리하세요.</p>
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
    </div>
  )
}
