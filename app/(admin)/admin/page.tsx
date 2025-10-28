import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <div>로그인이 필요합니다.</div>
  }
  
  if ((session.user as any).role !== "ADMIN") {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
        <p className="text-gray-600 mb-4">관리자 권한이 필요합니다.</p>
        <p className="text-sm text-gray-500">
          현재 사용자: {session.user.email} (권한: {(session.user as any).role})
        </p>
      </div>
    )
  }

  // 통계 데이터 가져오기
  const [noticesCount, pressCount, galleryCount, resourcesCount, usersCount, pendingUsersCount] = await Promise.all([
    prisma.notice.count({ where: { category: 'notice' } }),
    prisma.notice.count({ where: { category: 'press' } }),
    prisma.galleryItem.count(),
    prisma.resource.count(),
    prisma.user.count({ where: { approved: true } }),
    prisma.user.count({ where: { approved: false } }),
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

      {/* 사용자 관리 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">사용자 관리</h2>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            사용자 관리
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">승인된 사용자</h3>
            <p className="text-2xl font-bold text-green-600">{usersCount}</p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">승인 대기</h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingUsersCount}</p>
            {pendingUsersCount > 0 && (
              <p className="text-sm text-yellow-700 mt-1">
                승인이 필요한 사용자가 있습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
