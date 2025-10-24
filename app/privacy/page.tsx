import type { Metadata } from 'next'
import Section from '../../components/ui/Section'
import { SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: `개인정보처리방침 - ${SITE.name}`,
  description: `${SITE.name}의 개인정보처리방침입니다.`,
}

export default function PrivacyPage() {
  return (
    <Section background="premium">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">개인정보처리방침</span>
          </h1>
          <p className="text-xl text-gray-700">
            장성청소년자람터 오늘은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 개인정보의 처리목적</h2>
            <p className="text-gray-700 leading-relaxed">
              장성청소년자람터 오늘은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700">
              <li>청소년 상담 및 진로지도 서비스 제공</li>
              <li>프로그램 참여자 관리 및 안전관리</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>민원 처리 및 고객 상담</li>
            </ul>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 개인정보의 처리 및 보유기간</h2>
            <p className="text-gray-700 leading-relaxed">
              장성청소년자람터 오늘은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700">
              <li>상담 기록: 상담 종료 후 3년</li>
              <li>프로그램 참여 기록: 프로그램 종료 후 1년</li>
              <li>민원 처리 기록: 민원 처리 완료 후 3년</li>
            </ul>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 leading-relaxed">
              장성청소년자람터 오늘은 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 개인정보처리의 위탁</h2>
            <p className="text-gray-700 leading-relaxed">
              장성청소년자람터 오늘은 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700">
              <li>위탁받는 자: 웹사이트 운영업체</li>
              <li>위탁하는 업무의 내용: 웹사이트 운영 및 관리</li>
            </ul>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-gray-700 leading-relaxed">
              정보주체는 장성청소년자람터 오늘에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700">
              <li>개인정보 처리현황 통지요구</li>
              <li>개인정보 열람요구</li>
              <li>개인정보 정정·삭제요구</li>
              <li>개인정보 처리정지요구</li>
            </ul>
          </div>

          <div className="card-premium p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. 개인정보보호책임자</h2>
            <div className="text-gray-700">
              <p className="mb-2"><strong>개인정보보호책임자:</strong> 장성청소년자람터 오늘 대표</p>
              <p className="mb-2"><strong>연락처:</strong> 061-810-1388</p>
              <p><strong>이메일:</strong> info@js1388.org</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}