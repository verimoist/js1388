// components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { SITE } from "../../lib/site";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 기관 정보 */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-base font-semibold">
              <Image
                src="/assets/images/logo.svg"
                alt="자림터 로고"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {SITE.name}
            </div>
            <div>{SITE.address}</div>
            <div>
              전화:{" "}
              <a href={`tel:${SITE.phone}`} className="underline">
                {SITE.phone}
              </a>
            </div>
            {/* 이메일이 있을 때만 노출 */}
            {SITE.email && (
              <div>
                이메일:{" "}
                <a href={`mailto:${SITE.email}`} className="underline">
                  {SITE.email}
                </a>
              </div>
            )}
          </div>

          {/* 바로가기 */}
          <div className="text-sm">
            <div className="font-medium mb-2">바로가기</div>
            <ul className="space-y-1">
              <li><Link href="/about">소개</Link></li>
              <li><Link href="/programs">사업안내</Link></li>
              <li><Link href="/news">공지사항</Link></li>
              <li><Link href="/gallery">갤러리</Link></li>
              <li><Link href="/resources">자료실</Link></li>
              <li><Link href="/contact">문의</Link></li>
            </ul>
          </div>

          {/* 안내문 */}
          <div className="text-sm md:col-span-2">
            <div className="font-medium mb-2">안내</div>
            <p className="opacity-80">
              청소년의 건강한 성장과 자람을 지원하는 장성청소년자람터오늘입니다.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-xs opacity-70">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}