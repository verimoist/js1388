// app/contact/page.tsx
import type { Metadata } from "next";
import React from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: `상담·문의 - ${SITE.name}`,
  description:
    "궁금한 점이 있으시거나 서비스 이용을 원하시면 언제든지 연락주세요.",
};

// 안내/부서/FAQ 더미 데이터 (필요 시 수정)
const departments = [
  { name: "상담복지팀", phone: SITE.phone, email: "", description: "개인·가족·집단 상담" },
  { name: "청소년팀", phone: SITE.phone, email: "", description: "청소년 프로그램·교육·활동" },
];

const faqItems = [
  { question: "상담 신청은 어떻게 하나요?",
    answer: "전화로 신청하시면 상담사와 일정을 조율해 진행합니다." },
  { question: "센터 이용 시간은 어떻게 되나요?",
    answer: "평일 09:00–18:00 운영, 일요일·공휴일 휴관입니다." },
];

export default function ContactPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <Section background="primary" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">상담·문의</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            궁금한 점이 있으시면 아래 연락처로 문의해 주세요.
          </p>
        </div>
      </Section>

      {/* 연락처 정보 */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 기본 연락처 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">연락처 정보</h2>
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">주소</h3>
                      <p className="text-gray-600">{SITE.address}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">전화</h3>
                      <p className="text-gray-600">
                        <a href={`tel:${SITE.phone}`} className="underline">{SITE.phone}</a>
                      </p>
                       <a href={`tel:${SITE.phone}`} className="inline-block mt-3">
                         <Button variant="primary" size="sm">📞 전화걸기</Button>
                       </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">운영시간</h3>
                      <p className="text-gray-600">평일 09:00–18:00</p>
                      <p className="text-gray-600 text-sm mt-1">일요일·공휴일 휴관</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* (선택) 문의 폼은 이메일이 생기면 나중에 활성화 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">문의하기</h2>
              <Card className="p-6 text-gray-700">
                현재는 전화 문의만 받고 있습니다.
                 <div className="mt-4">
                   <a href={`tel:${SITE.phone}`} className="block">
                     <Button variant="primary" className="w-full">📞 {SITE.phone} 로 전화하기</Button>
                   </a>
                 </div>
                {/* 이메일/폼이 생기면 아래 폼을 사용하세요 (Formspree 등)
                <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="space-y-6">
                  ...
                </form>
                */}
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* 부서별 연락처 (예시) */}
      <Section background="gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">부서별 연락처</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, i) => (
              <Card key={i} hover className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4 text-brand-primary" />
                    <span className="text-sm text-gray-700">{dept.phone}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* 자주 묻는 질문 (예시) */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">자주 묻는 질문</h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}