# <<회사명>> 공공기관 홈페이지

Next.js App Router + TypeScript + Tailwind CSS로 구축된 반응형 공공기관 홈페이지입니다.

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router 페이지
│   ├── about/             # 센터소개
│   ├── programs/          # 사업안내
│   ├── news/             # 공지사항
│   ├── gallery/          # 포토갤러리
│   ├── resources/        # 자료실
│   ├── contact/          # 상담문의
│   ├── privacy/          # 개인정보처리방침
│   ├── terms/            # 이용약관
│   ├── globals.css       # 전역 스타일
│   └── layout.tsx        # 루트 레이아웃
├── components/           # 재사용 가능한 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트
├── public/              # 정적 파일
│   └── assets/          # 이미지, 아이콘 등
└── lib/                 # 유틸리티 함수
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 http://localhost:3000 에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📱 주요 기능

### 페이지 구성
- **홈페이지**: 히어로 섹션, 주요 서비스, 사업 프로그램, 공지사항, 포토갤러리
- **센터소개**: 인사말, 미션/비전, 연혁, 조직도, 오시는 길
- **사업안내**: 카드형 프로그램 소개, 신청 방법, 주요 혜택
- **공지사항**: 탭 분류(공지/보도자료), 검색, 인기 게시물
- **포토갤러리**: 그리드 레이아웃, 모달 뷰어, 앨범 분류
- **자료실**: 문서 다운로드, 카테고리 분류, 인기 자료
- **상담문의**: 문의 폼, 부서별 연락처, FAQ, 오시는 길

### 컴포넌트
- **공통 레이아웃**: Header(모바일 햄버거), Footer
- **UI 컴포넌트**: Button, Card, Section, Tabs, Accordion, Modal
- **기능 컴포넌트**: NoticeList, GalleryGrid, ProgramCard, Timeline, OrgChart

## 🎨 디자인 시스템

### 브랜드 컬러
- **Primary**: #2563eb (파란색)
- **Secondary**: #f59e0b (주황색)
- **Gray Scale**: 50-900 단계

### 반응형 디자인
- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

## 🚀 배포 (Vercel)

### 1. GitHub 저장소 생성
1. GitHub에서 새 저장소 생성
2. 로컬 프로젝트를 GitHub에 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Vercel 배포
1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 자동 배포 설정 완료

### 3. 환경 변수 설정 (필요시)
Vercel 대시보드에서 환경 변수 설정:
- `NEXT_PUBLIC_SITE_URL`: 사이트 URL
- 기타 API 키 등

## 📝 커스터마이징

### 1. 브랜드 정보 변경
다음 파일들에서 `<<회사명>>`, `<<주소>>` 등을 실제 정보로 교체:

- `app/layout.tsx` - 사이트 메타데이터
- `components/layout/Header.tsx` - 헤더 로고
- `components/layout/Footer.tsx` - 연락처 정보
- 각 페이지의 더미 데이터

### 2. 이미지 교체
`public/assets/images/` 폴더의 더미 이미지를 실제 이미지로 교체:

- `gallery1.jpg` ~ `gallery12.jpg` - 갤러리 이미지
- `counseling.jpg` - 상담 서비스 이미지
- `youth.jpg` - 청소년 프로그램 이미지
- `career.jpg` - 진로체험 이미지
- `partner1.png` ~ `partner6.png` - 파트너 로고

### 3. 컬러 테마 변경
`tailwind.config.js`에서 브랜드 컬러 수정:

```javascript
colors: {
  brand: {
    primary: '#your-color',    // 메인 컬러
    secondary: '#your-color', // 보조 컬러
  }
}
```

### 4. 폰트 변경
`app/globals.css`에서 폰트 패밀리 수정:

```css
font-family: 'Your-Font', system-ui, sans-serif;
```

## 🔧 개발 가이드

### 컴포넌트 추가
1. `components/ui/` - 기본 UI 컴포넌트
2. `components/` - 기능별 컴포넌트

### 페이지 추가
1. `app/` 폴더에 새 폴더 생성
2. `page.tsx` 파일 생성
3. `layout.tsx`에서 메타데이터 설정

### 스타일링
- Tailwind CSS 클래스 사용
- 커스텀 스타일은 `app/globals.css`에 추가
- 컴포넌트별 스타일은 해당 컴포넌트 파일에 작성

## 📋 체크리스트

### 배포 전 확인사항
- [ ] 모든 `<<회사명>>` 텍스트를 실제 회사명으로 교체
- [ ] 연락처 정보 (전화번호, 이메일, 주소) 업데이트
- [ ] 더미 이미지를 실제 이미지로 교체
- [ ] 메타데이터 (title, description) 수정
- [ ] 문의 폼 Formspree 설정 (contact/page.tsx)
- [ ] 지도 API 연동 (Google Maps, Kakao Map 등)
- [ ] SEO 최적화 (sitemap.xml, robots.txt)

### 교체해야 할 항목
1. **텍스트**
   - `<<회사명>>` → 실제 회사명
   - `<<주소>>` → 실제 주소
   - `<<연락처/이메일>>` → 실제 연락처
   - `<<역명>>`, `<<버스번호>>` → 실제 교통편 정보

2. **이미지**
   - 갤러리 이미지 (gallery1.jpg ~ gallery12.jpg)
   - 프로그램 이미지 (counseling.jpg, youth.jpg 등)
   - 파트너 로고 (partner1.png ~ partner6.png)
   - 센터 전경 사진

3. **설정**
   - Formspree 폼 ID (contact/page.tsx)
   - 지도 API 키 및 설정
   - 소셜 미디어 링크

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 도움이 필요하시면 언제든지 연락주세요:
- 이메일: <<연락처/이메일>>
- 전화: 000-000-0000
