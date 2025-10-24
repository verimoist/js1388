"use client"

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { SITE } from "../../lib/site";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* 로고/사이트명 */}
          <Link href="/" className="text-xl font-semibold">
            {SITE.name}
          </Link>

          <div className="flex items-center gap-6">
            {/* 네비게이션 */}
            <nav className="hidden md:flex gap-6 text-sm">
              <Link href="/about">소개</Link>
              <Link href="/programs">사업안내</Link>
              <Link href="/news">공지사항</Link>
              <Link href="/gallery">갤러리</Link>
              <Link href="/resources">자료실</Link>
              <Link href="/contact">문의</Link>
            </nav>

            {/* 인증 관련 버튼 */}
            <div className="flex items-center gap-3">
              {status === "loading" ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-3">
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      관리자
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      {session.user.name || session.user.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => signIn("github")}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  GitHub 로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}