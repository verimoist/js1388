// app/about/page.tsx
import type { Metadata } from "next";
import React from "react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: `소개 - ${SITE.name}`,
  description: `${SITE.name}의 미션과 주요 기능을 소개합니다.`,
};

export default function AboutPage() {
  return (
    <>
      {/* 헤더 섹션 */}
      <Section background="primary" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">센터소개</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {SITE.name}은(는) 청소년의 건강한 성장과 지역사회와의 동반 성장을 지원합니다.
          </p>
        </div>
      </Section>

      {/* 기관 개요 */}
      <Section>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">기관명</h3>
            <p className="text-gray-700">{SITE.name}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">주소</h3>
            <p className="text-gray-700">{SITE.address}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">연락처</h3>
            <p className="text-gray-700">{SITE.phone}</p>
          </Card>
        </div>
      </Section>

      {/* 미션/가치 */}
      <Section background="gray">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">미션</h3>
            <p className="text-gray-700">
              청소년의 전인적 성장을 지원하고 지역사회에 긍정적 변화를 만듭니다.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">핵심가치</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>존중과 공감</li>
              <li>안전과 신뢰</li>
              <li>참여와 협력</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">주요 기능</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>상담·복지 서비스</li>
              <li>청소년 교육·자람 프로그램</li>
              <li>진로탐색 및 지역 연계</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* 안내 */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">방문/문의 안내</h2>
          <p className="text-gray-700 mb-6">
            평일 09:00–18:00 운영(일요일·공휴일 휴관). 자세한 이용문의는 문의 페이지에서 확인하세요.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:opacity-90"
          >
            문의 페이지로 이동
          </a>
        </div>
      </Section>
    </>
  );
}
