"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "대시보드", href: "/admin" },
  { name: "공지사항", href: "/admin/notices" },
  { name: "보도자료", href: "/admin/press" },
  { name: "갤러리", href: "/admin/gallery" },
  { name: "자료실", href: "/admin/resources" },
  { name: "설정", href: "/admin/settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">관리자</h2>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={() => signOut()}
          className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
