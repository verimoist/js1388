"use client"

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { SITE } from "../../lib/site";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* 로고/사이트명 */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/images/logo.svg"
              alt="자림터 로고"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-medium text-green-600 tracking-wide">
              {SITE.name}
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex gap-6 text-sm">
              <Link href="/about">소개</Link>
              <Link href="/programs">사업안내</Link>
              <Link href="/news">공지사항</Link>
              <Link href="/gallery">갤러리</Link>
              <Link href="/resources">자료실</Link>
              <Link href="/contact">문의</Link>
              <a 
                href="https://me2.do/xoYOEKQ5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                후원신청
              </a>
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* 인증 관련 버튼 */}
            <div className="flex items-center gap-3">
              {status === "loading" ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-3">
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          관리자
                        </div>
                      </div>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 font-medium">
                      {session.user.name || session.user.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-4 text-sm">
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>소개</Link>
              <Link href="/programs" onClick={() => setIsMobileMenuOpen(false)}>사업안내</Link>
              <Link href="/news" onClick={() => setIsMobileMenuOpen(false)}>공지사항</Link>
              <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>갤러리</Link>
              <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)}>자료실</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>문의</Link>
              <a 
                href="https://me2.do/xoYOEKQ5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                후원신청
              </a>
              
              {/* 모바일 로그인 버튼 */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {session?.user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {session.user.name || session.user.email}님
                    </div>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block w-full text-center py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        관리자
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-center py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block w-full text-center py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}