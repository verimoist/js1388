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
    <header className="bg-white shadow-lg sticky top-0 z-50">
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
                <div className="flex space-x-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    관리자 로그인
                  </Link>
                </div>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}