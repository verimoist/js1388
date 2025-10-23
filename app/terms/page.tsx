import type { Metadata } from "next";
import Section from "../../components/ui/Section";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: `이용약관 - ${SITE.name}`,
  description: `${SITE.name} 홈페이지 이용약관`,
};

export default function TermsPage() {
  return (
    <>
      <Section background="primary" className="text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">이용약관</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {SITE.name} 홈페이지 이용과 관련된 기본 약관을 안내드립니다.
          </p>
        </div>
      </Section>

      <Section>
        <div className="prose max-w-4xl mx-auto">
          <h2>제1조 (목적)</h2>
          <p>이 약관은 {SITE.name}가 제공하는 서비스를 이용함에 있어 필요한 사항을 규정합니다.</p>

          <h2>제2조 (정의)</h2>
          <p>본 약관에서 사용하는 용어의 정의는 관련 법령 및 서비스 안내에 따릅니다.</p>

          <h2>제3조 (약관의 효력과 변경)</h2>
          <p>약관은 공지 후 적용되며, 필요한 경우 변경될 수 있습니다.</p>

          <h2>제4조 (서비스의 제공)</h2>
          <p>프로그램 안내, 공지사항 제공 등 홈페이지 서비스의 내용과 범위를 규정합니다.</p>

          <h2>제5조 (책임과 의무)</h2>
          <p>이용자는 관계 법령과 본 약관을 준수하여야 합니다.</p>

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