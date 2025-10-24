"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Button from "./ui/Button"
import { SITE } from "../lib/site"

export default function HeroBanner() {
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-200 rounded-full"></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300 rounded-full"></div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* 로고와 사이트명 */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/assets/images/logo.svg"
                alt="자림터 로고"
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-2">
                  {SITE.name}
                </h1>
                <div className="w-24 h-1 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 메인 메시지 */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              청소년의 성장과 자람을 돕는 지역 자람터
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              상담·진로·자람 프로그램을 통해 청소년들의 꿈과 희망을 응원합니다.
              <br />
              <span className="text-green-600 font-medium">더불어 함께 사는 세상</span>을 만들어갑니다.
            </p>
          </div>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/programs">
              <Button 
                variant="primary" 
                size="lg"
                className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
              >
                프로그램 보기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="secondary" 
                size="lg"
                className="text-lg px-8 py-4 border-green-600 text-green-600 hover:bg-green-50"
              >
                문의하기
              </Button>
            </Link>
            <a 
              href="https://me2.do/xoYOEKQ5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              후원신청
            </a>
          </div>

          {/* 하단 정보 */}
          <div className="mt-12 text-sm text-gray-500">
            <p>전라남도 장성군 장성읍 매화6길 8 | 061-810-1388</p>
          </div>
        </div>
      </div>

      {/* 장식적 요소들 */}
      <div className="absolute top-10 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-20"></div>
    </div>
  )
}
