import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '<<회사명>> - 공공기관 홈페이지',
  description: '<<회사명>>은 지역사회 발전과 시민 복지 향상을 위해 노력하는 공공기관입니다.',
  keywords: '공공기관, 복지, 상담, 교육, 지역사회',
  authors: [{ name: '<<회사명>>' }],
  openGraph: {
    title: '<<회사명>> - 공공기관 홈페이지',
    description: '<<회사명>>은 지역사회 발전과 시민 복지 향상을 위해 노력하는 공공기관입니다.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
