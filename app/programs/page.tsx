import type { Metadata } from "next";
import React from "react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: `사업안내 - ${SITE.name}`,
  description: `${SITE.name}에서 운영하는 주요 프로그램을 소개합니다.`,
};

const programsData = [
  {
    title: "상담복지 서비스",
    description:
      "개인 및 가족의 어려움을 해결하고 건강한 삶을 지원하는 전문 상담 서비스입니다.",
    items: ["개인상담", "가족상담", "집단상담", "위기개입"],
    target: "지역주민 누구나",
    schedule: "평일 09:00–18:00",
    location: "본관 2층 상담실",
  },
  {
    title: "청소년자람터",
    description:
      "청소년의 건강한 성장과 발달을 돕는 종합 교육·자람 프로그램입니다.",
    items: ["학습지원", "진로상담", "문화활동", "봉사활동"],
    target: "초·중·고등학생",
    schedule: "평일 15:00–20:00",
    location: "청소년센터",
  },
  {
    title: "진로체험센터",
    description:
      "다양한 직업 체험을 통해 진로를 탐색할 수 있는 체험형 교육 공간입니다.",
    items: ["직업체험", "멘토링", "현장견학", "진로상담"],
    target: "청소년 및 성인",
    schedule: "주말 10:00–17:00",
    location: "진로체험관",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <Section background="premium-dark" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              사업안내
            </span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {SITE.name}에서 운영하는 주요 프로그램을 소개합니다.
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsData.map((p, i) => (
            <Card key={i} hover className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-gray-700 mb-4">{p.description}</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
                {p.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium text-gray-900">대상:</span> {p.target}</p>
                <p><span className="font-medium text-gray-900">운영시간:</span> {p.schedule}</p>
                <p><span className="font-medium text-gray-900">장소:</span> {p.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}