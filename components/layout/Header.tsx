// components/layout/Header.tsx
import Link from "next/link";
import { SITE } from "../../lib/site";

export default function Header() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* 로고/사이트명 */}
          <Link href="/" className="text-xl font-semibold">
            {SITE.name}
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/about">소개</Link>
            <Link href="/programs">사업안내</Link>
            <Link href="/news">공지사항</Link>
            <Link href="/gallery">갤러리</Link>
            <Link href="/resources">자료실</Link>
            <Link href="/contact">문의</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}