import type { Metadata } from "next";
import Section from "../../components/ui/Section";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: `개인정보처리방침 - ${SITE.name}`,
  description: `${SITE.name}의 개인정보처리방침 안내`,
};

export default function PrivacyPage() {
  return (
    <>
      <Section background="primary" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">개인정보처리방침</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {SITE.name}의 개인정보 처리 목적, 보유·이용기간, 제3자 제공 등에 대해 안내드립니다.
          </p>
        </div>
      </Section>

      <Section>
        <div className="prose max-w-4xl mx-auto">
          <h2>1. 개인정보의 처리 목적</h2>
          <p>
            {SITE.name}는 서비스 제공, 민원 처리, 프로그램 운영 등을 위해 필요한 최소한의 개인정보를 처리합니다.
          </p>

          <h2>2. 처리 및 보유 기간</h2>
          <p>
            법령에 따른 보유기간 또는 정보주체로부터 개인정보를 수집 시 동의받은 보유기간 내에서 개인정보를 처리·보유합니다.
          </p>

          <h2>3. 제3자 제공</h2>
          <p>원칙적으로 개인정보를 외부에 제공하지 않습니다. 제공이 필요한 경우 사전 동의를 받습니다.</p>

          <h2>4. 개인정보 처리 위탁</h2>
          <p>서비스 향상을 위해 처리업무를 위탁할 수 있으며, 위탁 시 관련 사항을 공개합니다.</p>

          <h2>5. 정보주체의 권리</h2>
          <p>개인정보 열람, 정정·삭제, 처리정지 요구 등 권리를 행사할 수 있습니다.</p>

          <h2>문의</h2>
          <p>
            주소: {SITE.address}<br />
            전화: {SITE.phone}
          </p>
        </div>
      </Section>
    </>
  );
}