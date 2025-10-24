import type { Metadata } from 'next'
import Section from '../../components/ui/Section'
import { SITE } from '../../lib/site'

export const metadata: Metadata = {
  title: `이용약관 - ${SITE.name}`,
  description: `${SITE.name}의 이용약관입니다.`,
}

export default function TermsPage() {
  return (
    <Section background="premium">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">이용약관</span>
          </h1>
          <p className="text-xl text-gray-700">
            장성청소년자람터 오늘의 서비스 이용약관입니다.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              이 약관은 장성청소년자람터 오늘(이하 &quot;기관&quot;)이 제공하는 청소년 상담, 진로지도, 자람 프로그램 등의 서비스(이하 &quot;서비스&quot;)를 이용함에 있어 기관과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제2조 (정의)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul className="list-disc list-inside text-gray-700">
              <li>&quot;서비스&quot;란 기관이 제공하는 청소년 상담, 진로지도, 자람 프로그램 등을 의미합니다.</li>
              <li>&quot;이용자&quot;란 기관의 서비스에 접속하여 이 약관에 따라 기관이 제공하는 서비스를 받는 청소년 및 보호자를 의미합니다.</li>
              <li>&quot;보호자&quot;란 청소년의 법정대리인 또는 사실상의 보호자를 의미합니다.</li>
            </ul>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-gray-700 leading-relaxed">
              이 약관은 이용자가 동의함으로써 효력을 발생합니다. 기관은 관련 법령을 위반하지 않는 범위에서 이 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.
            </p>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제4조 (서비스의 제공)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">기관은 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc list-inside text-gray-700">
              <li>청소년 상담 서비스</li>
              <li>진로지도 및 진로상담</li>
              <li>자람 프로그램 운영</li>
              <li>방과후 아카데미 운영</li>
              <li>진로체험센터 운영</li>
              <li>기타 청소년 관련 서비스</li>
            </ul>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제5조 (이용자의 의무)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc list-inside text-gray-700">
              <li>서비스 이용 신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>기관이 게시한 정보의 변경</li>
              <li>기관이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>기관 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>기관 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제6조 (서비스의 중단)</h2>
            <p className="text-gray-700 leading-relaxed">
              기관은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </div>

          <div className="card-premium p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제7조 (개인정보보호)</h2>
            <p className="text-gray-700 leading-relaxed">
              기관은 관련법령이 정하는 바에 따라서 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법령 및 기관의 개인정보처리방침이 적용됩니다.
            </p>
          </div>

          <div className="card-premium p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">제8조 (면책조항)</h2>
            <p className="text-gray-700 leading-relaxed">
              기관은 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 기관은 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}