import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AuthSessionProvider from '../components/providers/SessionProvider'
import { SITE } from "../lib/site";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL("https://js1388.vercel.app"),
  title: {
    default: `${SITE.name}`,
    template: `%s - ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    url: "https://js1388.vercel.app",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthSessionProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
